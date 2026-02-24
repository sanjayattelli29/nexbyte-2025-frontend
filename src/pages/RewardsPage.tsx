import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Smartphone, User, History, Gift, CheckCircle2, Star, PartyPopper, ArrowDown, SmartphoneIcon, RefreshCw, TrendingUp } from "lucide-react";
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
        "hsl(var(--primary))",
        "hsl(var(--accent))",
        "hsl(var(--success))",
        "#FF9500",
        "#AF52DE",
        "#FF2D55",
        "#007AFF"
    ];

    useEffect(() => {
        fetchActiveReward();
        fetchHistory();

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

                if (activeReward.spinTriggeredAt && activeReward.spinTriggeredAt !== lastTriggeredAt) {
                    setLastTriggeredAt(activeReward.spinTriggeredAt);
                    handleRemoteSpin(activeReward);
                }

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
        ctx.strokeStyle = "hsl(var(--primary))";
        ctx.lineWidth = 10;
        ctx.stroke();

        audience.forEach((person, i) => {
            const angle = i * sliceAngle;

            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "white";
            ctx.font = `bold ${audience.length > 20 ? '10px' : '12px'} Inter, sans-serif`;

            const text = `${i + 1}. ${person.name.substring(0, 8)}`;
            ctx.fillText(text, radius - 30, 5);
            ctx.restore();
        });

        // Center Hub
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "hsl(var(--primary))";
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
        const fullSpins = 8 + Math.floor(Math.random() * 5);
        const targetRotation = fullSpins * 2 * Math.PI - (riggedIndex * sliceAngle + sliceAngle / 2);

        const duration = 5000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
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

        setTimeout(async () => {
            setIsSpinning(false);
            setShowCongrats(true);

            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.5 },
                colors: ['hsl(var(--primary))', '#FFFFFF', 'hsl(var(--accent))']
            });

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

            setTimeout(() => {
                setShowCongrats(false);
                setWinner(null);
            }, 3000);

        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success/5 rounded-full blur-3xl animate-pulse-subtle" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="relative z-10">
                {/* --- SECTION 1: HERO HEADER --- */}
                <div className="container mx-auto px-4 pt-12 text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2"
                    >
                        <TrendingUp className="w-3 h-3" /> NexByte Rewards
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold leading-tight"
                    >
                        <span className="text-gradient-primary">Spin the Wheel of Fortune!</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto"
                    >
                        Winners are announced live. Join the excitement and see if today is your lucky day.
                    </motion.p>
                </div>

                {/* --- SECTION 2: ACTIVE REWARD & WHEEL --- */}
                <div className="container mx-auto px-4 py-12">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="flex items-center justify-center p-20">
                                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : !reward ? (
                            <motion.div
                                key="no-reward"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="max-w-2xl mx-auto p-12 rounded-3xl bg-card border border-border text-center space-y-6 shadow-sm shadow-primary/5"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                    <Gift className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Waiting for the Arena...</h2>
                                <p className="text-muted-foreground text-sm">The arena is being prepared. Stay tuned for the next big giveaway session.</p>
                            </motion.div>
                        ) : (
                            <div key="active-arena" className="space-y-12">
                                {/* Split Layout: Info & Banner */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                        className="p-8 rounded-3xl bg-card border border-border flex flex-col justify-center space-y-4"
                                    >
                                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                                            <Star className="w-3 h-3 fill-current" /> Live Giveaway
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{reward.title}</h2>
                                        <p className="text-muted-foreground leading-relaxed">{reward.description || "The ultimate gift awaits the lucky winner of this session. Stay tuned for the live spin!"}</p>
                                        <div className="pt-2 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {reward.audience.length} Registrations</span>
                                            <span className="w-1 h-1 bg-border rounded-full" />
                                            <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> 1 Winner Soon</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                        className="rounded-3xl overflow-hidden border border-border shadow-md bg-muted aspect-video relative"
                                    >
                                        {reward.bannerUrl ? (
                                            <img src={reward.bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                                <ImageIcon className="w-16 h-16" />
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Interactive Core: List & Wheel */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                    {/* Table on Left */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        className="lg:col-span-4 bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
                                    >
                                        <div className="p-5 border-b border-border bg-muted/30 flex justify-between items-center">
                                            <h3 className="font-bold uppercase tracking-tight text-xs italic">Participant List</h3>
                                            <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{reward.audience.length} Entries</span>
                                        </div>
                                        <div className="max-h-[500px] overflow-y-auto p-2">
                                            {reward.audience.map((p: any, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-primary/10 hover:bg-primary/5 transition m-1">
                                                    <span className="w-6 h-6 rounded-md bg-muted text-[10px] flex items-center justify-center font-bold font-mono">#{i + 1}</span>
                                                    <span className="font-medium text-sm">{p.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Wheel on Right */}
                                    <div className="lg:col-span-8 flex flex-col items-center justify-center bg-card/30 backdrop-blur-md rounded-[40px] py-16 border border-border shadow-inner relative min-h-[600px] overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            {showCongrats ? (
                                                <motion.div
                                                    key="victory"
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 1.2, opacity: 0 }}
                                                    className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-background/80 backdrop-blur-3xl text-center"
                                                >
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                                                        className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-2xl shadow-primary/20"
                                                    >
                                                        <PartyPopper className="w-10 h-10 text-primary" />
                                                    </motion.div>
                                                    <p className="text-primary font-bold uppercase tracking-[10px] text-[10px] mb-4">Winner Detected</p>
                                                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{winner?.name}</h1>
                                                    <div className="bg-muted px-6 py-3 rounded-full border border-border flex items-center gap-3">
                                                        <Smartphone className="w-4 h-4 text-primary" />
                                                        <span className="text-xl font-bold tracking-widest">{winner?.mobile}</span>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="wheel-zone"
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                    className="relative flex flex-col items-center"
                                                >
                                                    {/* Pointer */}
                                                    <div className="absolute top-1/2 -left-12 -translate-y-1/2 z-30 drop-shadow-lg">
                                                        <div className="w-12 h-10 bg-primary flex items-center justify-center" style={{ clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' }} />
                                                    </div>

                                                    <motion.div
                                                        className="w-[380px] h-[380px] md:w-[480px] md:h-[480px] rounded-full border-[10px] border-card shadow-2xl bg-white overflow-hidden relative"
                                                        style={{ rotate: `${spinRotation}rad` }}
                                                    >
                                                        <canvas ref={canvasRef} width={500} height={500} className="w-full h-full" />
                                                    </motion.div>

                                                    <div className="mt-8">
                                                        {isSpinning ? (
                                                            <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
                                                                <RefreshCw className="w-3 h-3 animate-spin" /> Spinning Now...
                                                            </div>
                                                        ) : (
                                                            <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                                Awaiting Launch <ArrowDown className="w-3 h-3 animate-bounce" />
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
                </div>

                {/* --- SECTION 3: HISTORY GALLERY --- */}
                <section className="container mx-auto px-4 py-24 pb-48">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-widest">
                                <History className="w-3.5 h-3.5" /> History
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Winner Hall of Fame</h2>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-sm italic">Celebrating our community of winners. Every spin has a story.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.length === 0 ? (
                            <div className="col-span-full py-20 text-center opacity-20 bg-muted/30 rounded-3xl border border-dashed">
                                <Trophy className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-sm font-bold uppercase tracking-widest">No history yet</p>
                            </div>
                        ) : (
                            history.map((h, i) => (
                                <Card key={h._id} className="rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow group bg-card">
                                    <div className="h-40 relative overflow-hidden bg-muted">
                                        {h.bannerUrl ? (
                                            <img src={h.bannerUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-60" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                                <Gift className="w-10 h-10" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-background/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold">
                                            {new Date(h.completedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold mb-1 truncate">{h.title}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{h.description || "The community gathered for an epic spin session where luck favored one brave participant."}</p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-primary uppercase leading-none mb-1">Winner</p>
                                                <p className="text-sm font-bold truncate">{h.winner?.name}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                                                    <SmartphoneIcon className="w-3 h-3" />
                                                    {h.winner?.mobile?.substring(0, 6)}****
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

const ImageIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
);

export default RewardsPage;
