import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Trophy, Smartphone, User, History, Gift, CheckCircle2, Star, PartyPopper, ArrowDown, MapPin, SmartphoneIcon, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

const RewardsPage = () => {
    const [reward, setReward] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [winner, setWinner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastTriggeredAt, setLastTriggeredAt] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [spinRotation, setSpinRotation] = useState(0);

    const colors = [
        "#FF3B30", "#FF9500", "#FFCC00", "#4CD964", "#5AC8FA",
        "#007AFF", "#34C759", "#AF52DE", "#FF2D55", "#5856D6"
    ];

    useEffect(() => {
        fetchActiveReward();
        fetchHistory();

        // Polling to check for admin-triggered spins
        const interval = setInterval(fetchActiveReward, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchActiveReward = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards/active`);
            const data = await response.json();
            if (data.success) {
                const activeReward = data.data;
                setReward(activeReward);
                drawWheel(activeReward.audience);

                // Check if admin triggered a new spin
                if (activeReward.spinTriggeredAt && activeReward.spinTriggeredAt !== lastTriggeredAt) {
                    setLastTriggeredAt(activeReward.spinTriggeredAt);
                    handleRemoteSpin(activeReward);
                }

                // If reward was reset (spinTriggeredAt is null)
                if (!activeReward.spinTriggeredAt) {
                    setLastTriggeredAt(null);
                }

            } else {
                setReward(null);
            }
        } catch (error) {
            console.error("Error fetching active reward");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards`);
            const data = await response.json();
            if (data.success) {
                setHistory(data.data.filter((r: any) => r.status === 'completed'));
            }
        } catch (error) {
            console.error("Error fetching history");
        }
    };

    const drawWheel = (audience: any[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        const sliceAngle = (2 * Math.PI) / audience.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Outer Ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 10;
        ctx.stroke();

        audience.forEach((person, i) => {
            const angle = i * sliceAngle;

            // Draw Slice
            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
            ctx.fill();

            // Draw Line
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 2;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();

            // Add text or Number
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "white";
            ctx.shadowBlur = 4;
            ctx.shadowColor = "black";
            ctx.font = `bold ${audience.length > 20 ? '10px' : '14px'} Inter, sans-serif`;

            // Show Number + Small Name if space allows
            const text = `${i + 1}. ${person.name.substring(0, 8)}`;
            ctx.fillText(text, radius - 30, 5);
            ctx.restore();
        });

        // Center Point
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
        ctx.fillStyle = "#1a1a1a";
        ctx.fill();
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 4;
        ctx.stroke();
    };

    const handleRemoteSpin = (activeReward: any) => {
        if (isSpinning) return;

        setIsSpinning(true);
        setWinner(null);
        setShowCongrats(false);

        const audience = activeReward.audience;
        const riggedIndex = activeReward.riggedIndex !== -1 ? activeReward.riggedIndex : Math.floor(Math.random() * audience.length);

        const sliceAngle = (2 * Math.PI) / audience.length;
        const fullSpins = 8 + Math.floor(Math.random() * 5); // 8 to 13 full spins

        // Target angle to land on riggedIndex
        // The pointer is at Math.PI (Left side pointing Right)
        const targetRotation = fullSpins * 2 * Math.PI - (riggedIndex * sliceAngle + sliceAngle / 2);

        const duration = 5000; // 5 seconds
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Custom cubic-bezier for wheel slowing down
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
            const currentRotation = targetRotation * easeOut(progress);

            setSpinRotation(currentRotation);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                finishSpin(activeReward, riggedIndex);
            }
        };

        requestAnimationFrame(animate);
    };

    const finishSpin = async (activeReward: any, winnerIndex: number) => {
        const winningPerson = activeReward.audience[winnerIndex];
        setWinner(winningPerson);

        // Phase 1: Show winner on wheel for a tiny bit
        setTimeout(async () => {
            // Phase 2: Disappear wheel, show congrats
            setIsSpinning(false);
            setShowCongrats(true);

            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.5 },
                colors: ['#FFD700', '#FFFFFF', '#007AFF']
            });

            // Save winner to DB
            try {
                await fetch(`${API_BASE_URL}/api/rewards/${activeReward._id}/winner`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ winner: { ...winningPerson, index: winnerIndex } })
                });
                fetchHistory();
            } catch (error) {
                console.error("Error saving winner");
            }

            // Phase 3: Transition back after 3 seconds
            setTimeout(() => {
                setShowCongrats(false);
                setWinner(null); // Clear for next spin
            }, 3000);

        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-blue-500/30">

            {/* --- SECTION 1: HEADER --- */}
            <div className="relative py-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/10 blur-[120px] rounded-full" />

                <header className="relative z-10 container mx-auto px-4 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wider uppercase mb-2"
                    >
                        <Star className="w-4 h-4 fill-current" /> NexByte Exclusive
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter"
                    >
                        NEXBYTE <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">REWARDS</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-medium"
                    >
                        Spin the wheel of fortune! Winners are announced live. Join the excitement and see if today is your lucky day.
                    </motion.p>
                </header>
            </div>

            {/* --- SECTION 2: INTERACTIVE CORE --- */}
            <section className="container mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" className="flex items-center justify-center p-20">
                            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
                        </motion.div>
                    ) : !reward ? (
                        <motion.div
                            key="no-reward"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="max-w-4xl mx-auto p-16 rounded-[40px] bg-white/5 border border-white/10 text-center space-y-8 backdrop-blur-3xl"
                        >
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                                <Gift className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-4xl font-bold italic">Waiting for the next session...</h2>
                            <p className="text-gray-400 text-lg max-w-md mx-auto">The arena is being prepared. Our team is setting up the next big reward for our community.</p>
                        </motion.div>
                    ) : (
                        <div key="active-reward" className="space-y-12">

                            {/* Reward Details & Banner */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                                    className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-white/10 flex flex-col justify-center space-y-6"
                                >
                                    <h4 className="text-blue-400 font-bold uppercase tracking-widest text-sm">Active Reward</h4>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">{reward.title}</h2>
                                    <p className="text-gray-300 text-lg leading-relaxed">{reward.description || "The ultimate gift awaits the lucky winner of this session. Stay tuned for the live spin!"}</p>
                                    <div className="pt-4 flex items-center gap-6">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0c] bg-gray-600" />)}
                                        </div>
                                        <span className="text-sm font-bold text-gray-400">{reward.audience.length} Registrations</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                                    className="rounded-[40px] overflow-hidden border border-white/10 relative group shadow-2xl shadow-blue-500/10 min-h-[300px]"
                                >
                                    {reward.bannerUrl ? (
                                        <img src={reward.bannerUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Reward Banner" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <Gift className="w-20 h-20 text-white/10" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-8 left-8">
                                        <span className="bg-yellow-500 text-black text-xs font-black uppercase px-4 py-1.5 rounded-full">Coming Up Next</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Section 2: Interactive Table and Wheel */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">

                                {/* Participant Table */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                    className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden h-full flex flex-col"
                                >
                                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                        <CardTitle className="text-lg uppercase tracking-tight font-black italic">Audience List</CardTitle>
                                        <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-mono">{reward.audience.length} Slots</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto max-h-[500px] p-4 space-y-2">
                                        {reward.audience.map((p: any, i: number) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.07] transition group">
                                                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black italic">#{i + 1}</span>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-200 group-hover:text-white transition">{p.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">Verified entry</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* The Wheel Arena */}
                                <div className="lg:col-span-8 relative flex flex-col items-center justify-center bg-blue-900/10 rounded-[40px] py-16 border border-blue-500/10 backdrop-blur-sm min-h-[600px] overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {showCongrats ? (
                                            <motion.div
                                                key="congrats"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 1.5, opacity: 0 }}
                                                className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-2xl text-center"
                                            >
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        rotate: [0, 5, -5, 0]
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                    className="w-32 h-32 rounded-full bg-yellow-500 flex items-center justify-center mb-8 shadow-3xl shadow-yellow-500/40"
                                                >
                                                    <PartyPopper className="w-16 h-16 text-black" />
                                                </motion.div>
                                                <h2 className="text-blue-400 font-black tracking-widest uppercase mb-4">You have won!</h2>
                                                <h1 className="text-6xl md:text-8xl font-black uppercase mb-6 drop-shadow-2xl">{winner?.name}</h1>
                                                <div className="bg-white/10 rounded-full px-8 py-4 backdrop-blur-md border border-white/20 flex items-center gap-4">
                                                    <Smartphone className="text-blue-400" />
                                                    <span className="text-2xl font-mono font-bold tracking-[6px]">{winner?.mobile}</span>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="wheel-display"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.1 }}
                                                className="relative"
                                            >
                                                {/* Pointer Arrow */}
                                                <div className="absolute top-1/2 left-[-40px] -translate-y-1/2 z-30 filter drop-shadow-2xl">
                                                    <motion.div
                                                        animate={{ x: [0, 10, 0] }}
                                                        transition={{ repeat: Infinity, duration: 1 }}
                                                        className="w-16 h-12 bg-yellow-500 rounded-lg flex items-center justify-center"
                                                        style={{ clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' }}
                                                    />
                                                </div>

                                                <motion.div
                                                    className="relative z-10 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full border-[12px] border-[#1a1a1a] shadow-inner-xl bg-white overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.3)]"
                                                    style={{ rotate: `${spinRotation}rad` }}
                                                >
                                                    <canvas ref={canvasRef} width={500} height={500} className="w-full h-full" />
                                                </motion.div>

                                                <div className="mt-12 text-center">
                                                    {isSpinning ? (
                                                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                                                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-ping" />
                                                            <span className="uppercase text-sm font-black tracking-widest animate-pulse">Session Live: Spinning...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-400 uppercase text-xs font-bold tracking-widest flex items-center gap-2 justify-center">
                                                            Waiting for Admin Launch <ArrowDown className="w-4 h-4 animate-bounce" />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </section>

            {/* --- SECTION 3: HISTORY GALLERY --- */}
            <section className="container mx-auto px-4 py-24 pb-40">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-sm">
                            <History className="w-5 h-5" /> Hall of Fame
                        </div>
                        <h2 className="text-5xl font-black italic">PREVIOUS <span className="text-blue-500">VICTORIES</span></h2>
                    </div>
                    <p className="text-gray-400 max-w-sm italic">Every card tells a story of luck and success. Swipe through our record of past giveaways.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {history.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-20">
                            <Trophy className="w-20 h-20 mx-auto mb-4" />
                            <p className="text-2xl font-bold italic uppercase tracking-tighter">History is still being written...</p>
                        </div>
                    ) : (
                        history.map((h, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                key={h._id}
                                className="group relative bg-[#131316] border border-white/5 rounded-[32px] overflow-hidden hover:border-blue-500/50 transition-all duration-500"
                            >
                                {/* Banner Part */}
                                <div className="h-48 relative overflow-hidden bg-white/5">
                                    {h.bannerUrl ? (
                                        <img src={h.bannerUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-60" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-10">
                                            <Gift className="w-20 h-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#131316] via-[#131316]/20 to-transparent" />
                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-300">
                                        {new Date(h.completedAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Content Part */}
                                <div className="p-8 space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight mb-2 uppercase italic">{h.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{h.description || "The community gathered for an epic spin session where luck favored one brave participant."}</p>
                                    </div>

                                    <div className="relative p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 overflow-hidden">
                                        <div className="absolute top-0 right-[-10px] opacity-10">
                                            <Trophy className="w-16 h-16 text-blue-500" />
                                        </div>
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                <User className="text-white w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-0.5">The Winner</p>
                                                <p className="text-xl font-black text-white">{h.winner?.name}</p>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono mt-1">
                                                    <SmartphoneIcon className="w-3.5 h-3.5" />
                                                    {h.winner?.mobile?.substring(0, 6)}****
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

        </div>
    );
};

export default RewardsPage;
