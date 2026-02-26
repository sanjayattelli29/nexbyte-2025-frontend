import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Trophy, Share2, Star, Zap, Clock, Award, Users, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

// --- Types & Interfaces ---

interface Participant {
    name: string;
    mobile: string;
    index?: number;
}

interface Reward {
    _id: string;
    title: string;
    description?: string;
    bannerUrl?: string;
    audience: Participant[];
    spinTriggeredAt?: string;
    riggedIndex?: number;
    status: "active" | "completed";
    buttonText?: string;
    buttonLink?: string;
}

interface HistoryItem extends Reward {
    winner?: Participant;
    completedAt: string;
}

// --- Styles ---

const COLORS = ["#0E1628", "#18C9A8"];

const REWARDS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --bg:        #F6F7FB;
    --surface:   #FFFFFF;
    --border:    #E4E8F0;
    --navy:      #0E1628;
    --teal:      #18C9A8;
    --teal-dim:  #12A88D;
    --gold:      #F5A623;
    --text:      #1A202C;
    --muted:     #7A8499;
    --radius:    24px;
    --shadow:    0 4px 24px rgba(14,22,40,0.06);
    --shadow-lg: 0 12px 48px rgba(14,22,40,0.12);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 120px;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .rp-container { 
    max-width: 1540px; 
    margin: 0 auto; 
    padding: 0 40px; 
  }

  /* --- Section 1: Hero --- */
  .rp-hero {
    background: var(--navy);
    padding: 100px 40px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 60px;
  }
  .rp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(24,201,168,0.25) 0%, transparent 75%);
  }
  .rp-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(24,201,168,0.12);
    border: 1px solid rgba(24,201,168,0.35);
    border-radius: 999px;
    padding: 8px 20px;
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--teal);
    margin-bottom: 28px;
    letter-spacing: 0.12em;
  }
  .rp-hero-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 800;
    color: #fff;
    line-height: 1.05;
    margin-bottom: 24px;
  }
  .rp-hero-title span { color: var(--teal); }
  .rp-hero-sub {
    font-size: 20px;
    color: rgba(255,255,255,0.6);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    font-weight: 300;
  }

  /* --- Section 2: Info & Banner --- */
  .rp-info-banner-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: center;
    margin-bottom: 60px;
  }
  @media (max-width: 1024px) { .rp-info-banner-grid { grid-template-columns: 1fr; gap: 40px; } }

  .rp-session-info {
    padding-right: 40px;
  }
  .rp-session-title {
    font-family: 'Sora', sans-serif;
    font-size: 48px;
    font-weight: 800;
    color: var(--navy);
    margin-bottom: 20px;
    line-height: 1.1;
  }
  .rp-session-desc {
    font-size: 18px;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 32px;
  }
  .rp-live-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    background: #EF4444;
    color: white;
    border-radius: 999px;
    font-family: 'Sora', sans-serif;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .rp-session-banner-wrap {
    height: 480px;
    border-radius: 32px;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    position: relative;
  }
  .rp-session-banner-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .rp-banner-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(14,22,40,0.4), transparent);
  }
  .rp-banner-button {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 16px 48px;
    background: #EF4444;
    color: white;
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
    z-index: 5;
  }
  .rp-banner-button:hover {
    background: #DC2626;
    transform: translateX(-50%) translateY(-4px);
    box-shadow: 0 12px 32px rgba(239, 68, 68, 0.4);
  }
  .rp-banner-button:active {
    transform: translateX(-50%) translateY(-2px);
  }

  /* --- Section 3: Interaction --- */
  .rp-interaction-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: flex-start;
    margin-bottom: 80px;
  }
  @media (max-width: 1024px) { .rp-interaction-grid { grid-template-columns: 1fr; } }

  .rp-table-wrap {
    padding: 40px;
  }
  .rp-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }
  .rp-table-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; }
  .rp-participant-count { background: var(--teal); color: white; padding: 4px 14px; border-radius: 999px; font-weight: 700; font-size: 14px; }

  .participant-list { display: flex; flex-direction: column; gap: 12px; }
  .participant-item {
    padding: 16px 24px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .participant-item:hover { border-color: var(--teal); transform: translateX(8px); }
  .participant-item.is-winner { border-color: var(--gold); background: rgba(245, 166, 35, 0.05); }
  .participant-rank { width: 32px; height: 32px; background: var(--bg); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: var(--muted); }
  .participant-name { font-size: 16px; font-weight: 600; flex: 1; }

  /* --- Enhanced Wheel --- */
  .rp-wheel-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    min-height: 520px;
    position: relative;
  }
  .wheel-box { position: relative; width: 380px; height: 380px; }
  @media (max-width: 640px) { .wheel-box { width: 280px; height: 280px; } }
  
  .wheel-canvas { border-radius: 50%; box-shadow: 0 0 80px rgba(24,201,168,0.15); }
  .wheel-pointer-main {
    position: absolute; top: -20px; left: 50%; transform: translateX(-50%);
    width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-top: 36px solid var(--navy);
    z-index: 10;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  }

  .spin-status {
    margin-top: 40px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 32px;
    background: var(--navy);
    color: white;
    border-radius: 999px;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* Countdown Display */
  .rp-countdown-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .rp-countdown-number {
    font-family: 'Sora', sans-serif;
    font-size: 140px;
    font-weight: 900;
    color: var(--navy);
    line-height: 1;
    margin-bottom: 20px;
  }
  .rp-countdown-label {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--muted);
  }

  /* --- Winner Billboard --- */
  .winner-billboard {
    text-align: center;
    background: linear-gradient(135deg, var(--navy), #1a2b4b);
    color: white;
    padding: 80px 40px;
    border-radius: 32px;
    width: 100%;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }
  .winner-confetti-icon { margin-bottom: 24px; animation: bounce 2s infinite; }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

  /* --- Section 4: Hall of Fame --- */
  .hof-header { margin: 100px 0 40px; border-bottom: 2px solid var(--border); padding-bottom: 24px; }
  .hof-title { font-family: 'Sora', sans-serif; font-size: 40px; font-weight: 800; display: flex; align-items: center; gap: 16px; }
  .hof-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 32px; }
  .hof-item-card { overflow: hidden; }
  .hof-img { height: 220px; background: #000; position: relative; }
  .hof-img img { width: 100%; height: 100%; object-fit: cover; }
  .hof-content { padding: 32px; }

  /* Empty State */
  .empty-box { padding: 120px; text-align: center; color: var(--muted); }
`;

// --- Sub-Components ---

const Hero = () => (
    <header className="rp-hero">
        <div className="rp-container">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="rp-hero-badge"><Zap size={14} fill="currentColor" /> Live Session</div>
                <h1 className="rp-hero-title">Spin The Wheel,<br /><span>Win Big</span></h1>
                <p className="rp-hero-sub">Exclusive rewards for our active community members. Join the live arena now.</p>
            </motion.div>
        </div>
    </header>
);

const RewardsPage = () => {
    const [reward, setReward] = useState<Reward | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [winner, setWinner] = useState<Participant | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastTriggeredAt, setLastTriggeredAt] = useState<string | null>(null);
    const [spinRotation, setSpinRotation] = useState(0);
    const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const countdownIntervalRef = useRef<any>(null);
    const activeSpinTriggerRef = useRef<string | null>(null);
    const isSpinningRef = useRef(false);

    const drawWheel = useCallback((audience: Participant[], rotation: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !audience?.length) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = canvas.width;
        const cx = size / 2, cy = size / 2;
        const r = (size / 2) - 10;
        const slice = (2 * Math.PI) / audience.length;

        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.translate(-cx, -cy);

        audience.forEach((_, i) => {
            const a = i * slice;
            ctx.beginPath();
            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, a, a + slice);
            ctx.fill();

            // Labels
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(a + slice / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.font = "bold 24px Sora, sans-serif";
            ctx.fillText(`${i + 1}`, r - 30, 8);
            ctx.restore();
        });
        ctx.restore();

        // Center Hub
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#0E1628";
        ctx.lineWidth = 5;
        ctx.stroke();
    }, []);

    const fetchActiveReward = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/rewards/active`);
            const data = await res.json();
            if (data.success) {
                const r = data.data;
                setReward(r);

                // Logic check: Is there a spin trigger?
                if (r.spinTriggeredAt && r.spinTriggeredAt !== activeSpinTriggerRef.current) {
                    activeSpinTriggerRef.current = r.spinTriggeredAt;
                    startCountdownFlow(r);
                }

                // Reset reference if spin is cleared on server
                if (!r.spinTriggeredAt) {
                    activeSpinTriggerRef.current = null;
                }
            } else {
                setReward(null);
                activeSpinTriggerRef.current = null;
            }
        } catch (e) {
            console.error("Poll Error:", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/rewards`);
            const data = await res.json();
            if (data.success) {
                setHistory(data.data.filter((h: any) => h.status === "completed"));
            }
        } catch (e) { }
    };

    const startCountdownFlow = (activeReward: Reward) => {
        // Clear any existing interval just in case
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        setCountdown(10);
        countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                    handleRemoteSpin(activeReward);
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleRemoteSpin = (activeReward: Reward) => {
        if (isSpinningRef.current) return;

        isSpinningRef.current = true;
        setIsSpinning(true);
        setWinner(null);
        setShowCongrats(false);
        setWinnerIndex(null);

        const audience = activeReward.audience;
        const ri = activeReward.riggedIndex !== undefined && activeReward.riggedIndex !== -1
            ? activeReward.riggedIndex
            : Math.floor(Math.random() * audience.length);

        const slice = (2 * Math.PI) / audience.length;
        const fullSpins = 12 + Math.floor(Math.random() * 6);
        const target = fullSpins * 2 * Math.PI - (ri * slice + slice / 2);
        const duration = 7000;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 5);

            setSpinRotation(target * ease);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                finishSpin(activeReward, ri);
            }
        };
        requestAnimationFrame(animate);
    };

    const finishSpin = async (activeReward: Reward, wi: number) => {
        const winning = activeReward.audience[wi];
        setWinner(winning);
        setWinnerIndex(wi);

        setTimeout(async () => {
            setIsSpinning(false);
            setShowCongrats(true);
            confetti({ particleCount: 250, spread: 140, origin: { y: 0.6 }, colors: ["#18C9A8", "#FFFFFF", "#0E1628"] });

            try {
                await fetch(`${API_BASE_URL}/api/rewards/${activeReward._id}/winner`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ winner: { ...winning, index: wi } }),
                });
                fetchHistory();
            } catch (e) { }

            setTimeout(() => {
                setShowCongrats(false);
                setWinner(null);
                setWinnerIndex(null);
                isSpinningRef.current = false;
            }, 7000);
        }, 1200);
    };

    useEffect(() => {
        const tag = document.createElement("style");
        tag.textContent = REWARDS_STYLES;
        document.head.appendChild(tag);
        fetchActiveReward();
        fetchHistory();
        const interval = setInterval(fetchActiveReward, 3000);
        return () => {
            document.head.removeChild(tag);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (reward) drawWheel(reward.audience, spinRotation);
    }, [reward, spinRotation, drawWheel]);

    return (
        <div className="rp-root">
            <Hero />

            <main className="rp-container">
                {loading ? (
                    <div className="empty-box glass-card">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <Clock size={48} color="var(--teal)" />
                        </motion.div>
                        <p style={{ marginTop: 24, fontSize: 18, fontWeight: 600 }}>Syncing Session Data...</p>
                    </div>
                ) : !reward ? (
                    <div className="empty-box glass-card">
                        <Trophy size={64} color="var(--border)" style={{ marginBottom: 24 }} />
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--navy)" }}>Nexbyteind Is Evolving</h2>
                        <p style={{ fontSize: 18, color: "var(--muted)" }}>Check back later for our next live session!</p>
                    </div>
                ) : (
                    <>
                        {/* Section 2: Info & Banner */}
                        <div className="rp-info-banner-grid">
                            <motion.div className="rp-session-info" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="rp-live-tag">
                                    <span style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }} />
                                    Live Now
                                </div>
                                <h2 className="rp-session-title">{reward.title}</h2>
                                <p className="rp-session-desc">{reward.description || "The ultimate tech giveaway session. Make sure you are active in the participant list to be eligible for the spin."}</p>

                                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                    <div style={{ padding: '20px 32px', background: '#fff', borderRadius: 20, border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Participants</div>
                                        <div style={{ fontSize: 32, fontWeight: 800 }}>{reward.audience.length}</div>
                                    </div>
                                    <div style={{ padding: '20px 32px', background: '#fff', borderRadius: 20, border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Reward Type</div>
                                        <div style={{ fontSize: 32, fontWeight: 800 }}>Premium</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div className="rp-session-banner-wrap" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                                {reward.bannerUrl ? <img src={reward.bannerUrl} alt={reward.title} /> : <div style={{ height: '100%', background: 'linear-gradient(135deg, #0E1628, #1a2b4b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy size={100} color="rgba(255,255,255,0.1)" /></div>}
                                <div className="rp-banner-overlay" />
                                {reward.buttonText && reward.buttonLink && (
                                    <a 
                                        href={reward.buttonLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="rp-banner-button"
                                    >
                                        {reward.buttonText}
                                    </a>
                                )}
                            </motion.div>
                        </div>

                        {/* Section 3: Interaction Area */}
                        <div className="rp-interaction-grid">
                            {/* Participant List */}
                            <motion.div className="glass-card rp-table-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="rp-table-header">
                                    <h3 className="rp-table-title">Live Audience</h3>
                                    <span className="rp-participant-count">{reward.audience.length} Active</span>
                                </div>
                                <div className="participant-list">
                                    {reward.audience.map((p, i) => (
                                        <div key={i} className={`participant-item ${winnerIndex === i && showCongrats ? 'is-winner' : ''}`}>
                                            <div className="participant-rank">{i + 1}</div>
                                            <span className="participant-name">{p.name}</span>
                                            {winnerIndex === i && showCongrats && <Star size={20} color="var(--gold)" fill="var(--gold)" />}
                                            <ChevronRight size={18} color="var(--border)" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Interaction Panel (Countdown / Wheel / Winner) */}
                            <motion.div className="glass-card rp-wheel-panel" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                                <AnimatePresence mode="wait">
                                    {countdown !== null ? (
                                        <motion.div
                                            key="countdown"
                                            className="rp-countdown-overlay"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 1.2, opacity: 0 }}
                                        >
                                            <div className="rp-countdown-number">{countdown}</div>
                                            <div className="rp-countdown-label">Preparing Spin...</div>
                                        </motion.div>
                                    ) : showCongrats && winner ? (
                                        <motion.div
                                            key="win"
                                            className="winner-billboard"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="winner-confetti-icon"><Trophy size={80} color="var(--gold)" /></div>
                                            <p style={{ color: 'var(--teal)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>Congratulations</p>
                                            <h3 style={{ fontSize: 44, fontWeight: 800, marginBottom: 10 }}>{winner.name}</h3>
                                            <p style={{ fontSize: 20, opacity: 0.6 }}>{winner.mobile.substring(0, 7)}***</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="wheel"
                                            style={{ textAlign: 'center' }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="wheel-box">
                                                <div className="wheel-pointer-main" />
                                                <canvas ref={canvasRef} width={380} height={380} className="wheel-canvas" />
                                            </div>
                                            <div className="spin-status">
                                                {isSpinning ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap size={20} color="var(--teal)" fill="var(--teal)" /></motion.div> : <Users size={20} />}
                                                {isSpinning ? "SPINNING IN PROGRESS..." : "WAITING FOR HOST TO SPIN"}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </>
                )}

                {/* Section 4: Hall of Fame */}
                <div className="hof-header">
                    <h2 className="hof-title"><Award size={48} color="var(--teal)" /> Hall of Fame</h2>
                    <p style={{ color: 'var(--muted)', fontSize: 18, marginTop: 8 }}>The legend lives on. Previous session winners.</p>
                </div>

                {history.length === 0 ? (
                    <div className="glass-card" style={{ padding: 100, textAlign: 'center', color: 'var(--muted)' }}>
                        <p style={{ fontSize: 20 }}>The Hall of Fame is waiting for its first hero.</p>
                    </div>
                ) : (
                    <div className="hof-grid">
                        {history.map((h) => (
                            <motion.div key={h._id} className="glass-card hof-item-card" whileHover={{ y: -10 }}>
                                <div className="hof-img">
                                    {h.bannerUrl ? <img src={h.bannerUrl} alt={h.title} /> : <div style={{ height: '100%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy size={60} color="rgba(255,255,255,0.1)" /></div>}
                                    <div className="hof-date">{new Date(h.completedAt).toLocaleDateString()}</div>
                                </div>
                                <div className="hof-content">
                                    <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{h.title}</h4>
                                    <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>{h.description || "Won in a highly competitive live arena session."}</p>

                                    {h.winner && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg)', borderRadius: 16 }}>
                                            <div style={{ width: 44, height: 44, background: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>{h.winner.name[0]}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800 }}>{h.winner.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{h.winner.mobile.substring(0, 7)}***</div>
                                            </div>
                                            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/rewards#reward-${h._id}`); toast.success("Shared!"); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><Share2 size={20} /></button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default RewardsPage;