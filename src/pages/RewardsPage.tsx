import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Trophy, RefreshCw, Smartphone, User, Play, Clock, History, Gift, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

const RewardsPage = () => {
    const [reward, setReward] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Wheel state
    const [startAngle, setStartAngle] = useState(0);
    const [spinRotation, setSpinRotation] = useState(0);

    const colors = [
        "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
        "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"
    ];

    useEffect(() => {
        fetchActiveReward();
        fetchHistory();
    }, []);

    const fetchActiveReward = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards/active`);
            const data = await response.json();
            if (data.success) {
                setReward(data.data);
                drawWheel(data.data.audience);
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
        const radius = Math.min(centerX, centerY) - 10;
        const sliceAngle = (2 * Math.PI) / audience.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        audience.forEach((person, i) => {
            const angle = i * sliceAngle;
            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
            ctx.fill();
            ctx.stroke();

            // Add text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "white";
            ctx.font = "bold 14px Arial";
            ctx.fillText(person.name.substring(0, 10), radius - 30, 0);
            ctx.restore();
        });

        // Pointer
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.moveTo(centerX + radius + 10, centerY);
        ctx.lineTo(centerX + radius - 10, centerY - 10);
        ctx.lineTo(centerX + radius - 10, centerY + 10);
        ctx.fill();
    };

    const spinWheel = () => {
        if (isSpinning || !reward) return;

        setIsSpinning(true);
        setWinner(null);

        const audience = reward.audience;
        const riggedIndex = reward.riggedIndex !== -1 ? reward.riggedIndex : Math.floor(Math.random() * audience.length);

        const sliceAngle = (2 * Math.PI) / audience.length;
        const fullSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 full spins

        // Target angle to land on riggedIndex
        // The pointer is at 0 degrees (right side). 
        // We need to calculate what rotation will bring the riggedIndex slice to 0.
        // Slice i starts at i * sliceAngle. 
        // To bring it to 0, we need to rotate by - (i * sliceAngle + sliceAngle / 2)
        const targetRotation = fullSpins * 2 * Math.PI - (riggedIndex * sliceAngle + sliceAngle / 2);

        const duration = 5000; // 5 seconds
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth stop
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
            const currentRotation = targetRotation * easeOut(progress);

            setSpinRotation(currentRotation);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                finishSpin(riggedIndex);
            }
        };

        requestAnimationFrame(animate);
    };

    const finishSpin = async (winnerIndex: number) => {
        setIsSpinning(false);
        const winningPerson = reward.audience[winnerIndex];
        setWinner(winningPerson);

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Move to history and save winner
        try {
            await fetch(`${API_BASE_URL}/api/rewards/${reward._id}/winner`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ winner: { ...winningPerson, index: winnerIndex } })
            });
            fetchHistory();
            fetchActiveReward();
        } catch (error) {
            console.error("Error saving winner");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 py-12 px-4 text-white">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <header className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-3 bg-yellow-500 rounded-full shadow-lg"
                    >
                        <Trophy className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-5xl font-extrabold tracking-tight"
                    >
                        NexByte <span className="text-yellow-400">Rewards</span>
                    </motion.h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        Spin the wheel of fortune! Winners are announced live. Join the excitement and see if today is your lucky day.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Spin Section */}
                    <div className="lg:col-span-12 xl:col-span-8 flex flex-col items-center justify-center space-y-8">
                        <AnimatePresence mode="wait">
                            {!reward ? (
                                <motion.div
                                    key="no-reward"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-12 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center space-y-6 w-full max-w-2xl"
                                >
                                    <div className="p-4 bg-blue-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                        <Gift className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold">No Active Rewards</h2>
                                    <p className="text-blue-200">Our team is preparing the next big reward. Stay tuned and check back soon!</p>
                                    <Button
                                        onClick={fetchActiveReward}
                                        className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-full"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="wheel-active"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative flex flex-col items-center space-y-12 w-full"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-bold text-yellow-400">{reward.title}</h2>
                                        <p className="text-blue-200">{reward.audience.length} participants registered</p>
                                    </div>

                                    {/* The Wheel */}
                                    <div className="relative group">
                                        <div className="absolute -inset-4 bg-yellow-500/30 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                        <motion.div
                                            className="relative z-10 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full border-[8px] border-yellow-500 shadow-2xl overflow-hidden bg-white"
                                            style={{ rotate: `${spinRotation}rad` }}
                                        >
                                            <canvas
                                                ref={canvasRef}
                                                width={500}
                                                height={500}
                                                className="w-full h-full"
                                            />
                                            {/* Center Hub */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900 rounded-full border-4 border-yellow-500 z-20 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Control */}
                                    <div className="z-20 text-center space-y-6">
                                        <Button
                                            disabled={isSpinning}
                                            onClick={spinWheel}
                                            className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 border-8 border-yellow-300 shadow-2xl flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:grayscale"
                                        >
                                            <Play className="fill-current w-8 h-8 md:w-10 md:h-10 ml-1" />
                                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">SPIN</span>
                                        </Button>

                                        <p className="text-sm text-blue-300 animate-pulse">
                                            {isSpinning ? "The wheel is turning..." : "Click to test your luck!"}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Winner Announcement / History */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8">

                        {/* Current Winner Notification */}
                        <AnimatePresence>
                            {winner && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 border-none shadow-2xl overflow-hidden text-gray-900">
                                        <CardHeader className="text-center pb-2">
                                            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                                                <span className="p-2 bg-white/20 rounded-lg">🎉</span>
                                                WE HAVE A WINNER!
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center space-y-4">
                                            <div className="w-24 h-24 bg-white/30 rounded-full mx-auto flex items-center justify-center border-4 border-white/50">
                                                <User className="w-12 h-12 text-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-3xl font-black uppercase">{winner.name}</h3>
                                                <div className="flex items-center justify-center gap-2 font-mono bg-black/10 rounded-full py-1 px-4 inline-flex">
                                                    <Smartphone className="w-4 h-4" />
                                                    {winner.mobile}
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold opacity-80 pt-2">Congratulations on your winning!</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Recent Winners List */}
                        <Card className="bg-indigo-950/50 backdrop-blur-xl border-indigo-400/20 text-white min-h-[500px]">
                            <CardHeader className="border-b border-indigo-400/10">
                                <div className="flex items-center gap-3">
                                    <History className="text-blue-400 w-5 h-5" />
                                    <CardTitle className="text-xl">Winner Hall of Fame</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[400px] overflow-y-auto pt-6 space-y-4">
                                {history.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-blue-300/50 space-y-2">
                                        <Clock className="w-10 h-10" />
                                        <p>No history yet</p>
                                    </div>
                                ) : (
                                    history.map((reward, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={reward._id}
                                            className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3"
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-bold text-blue-400 uppercase">{reward.title}</span>
                                                <span className="text-[10px] text-blue-300/50">{new Date(reward.completedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{reward.winner?.name}</p>
                                                    <div className="flex items-center gap-1 text-[10px] text-blue-300">
                                                        <Smartphone className="w-3 h-3" />
                                                        {reward.winner?.mobile?.slice(0, 6)}****
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardsPage;
