import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Trophy, Plus, Trash2, Save, Download, RefreshCw, Play, RotateCcw, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RewardManager = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [audienceCount, setAudienceCount] = useState(0);
    const [audience, setAudience] = useState<{ name: string; mobile: string }[]>([]);
    const [rewards, setRewards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards`);
            const data = await response.json();
            if (data.success) setRewards(data.data);
        } catch (error) {
            toast.error("Failed to fetch rewards");
        }
    };

    const handleAudienceCountChange = (count: number) => {
        setAudienceCount(count);
        const newAudience = Array.from({ length: count }, (_, i) => audience[i] || { name: "", mobile: "" });
        setAudience(newAudience);
    };

    const handleAudienceChange = (index: number, field: "name" | "mobile", value: string) => {
        const updated = [...audience];
        updated[index][field] = value;
        setAudience(updated);
    };

    const createReward = async () => {
        if (!title || audience.some(p => !p.name || !p.mobile)) {
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, bannerUrl, audience })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Reward created successfully");
                setTitle("");
                setDescription("");
                setBannerUrl("");
                setAudience([]);
                setAudienceCount(0);
                fetchRewards();
            }
        } catch (error) {
            toast.error("Error creating reward");
        } finally {
            setLoading(false);
        }
    };

    const updateRiggedIndex = async (rewardId: string, index: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards/${rewardId}/rig`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ riggedIndex: index })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Winner rigged successfully");
                fetchRewards();
            }
        } catch (error) {
            toast.error("Error rigging winner");
        }
    };

    const triggerSpin = async (rewardId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards/${rewardId}/trigger-spin`, {
                method: "PUT"
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Spin triggered on public page!");
                fetchRewards();
            }
        } catch (error) {
            toast.error("Error triggering spin");
        }
    };

    const resetSpin = async (rewardId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards/${rewardId}/reset-spin`, {
                method: "PUT"
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Spin state reset (Deleted history for this wheel)");
                fetchRewards();
            }
        } catch (error) {
            toast.error("Error resetting spin");
        }
    };

    const deleteReward = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
                toast.success("Reward deleted");
                fetchRewards();
            }
        } catch (error) {
            toast.error("Error deleting reward");
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reward Manager</h2>
                    <p className="text-muted-foreground">Manage giveaways and live spins.</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Reward Form */}
                <Card className="shadow-lg border border-border bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" /> New Giveaway
                        </CardTitle>
                        <CardDescription>Launch a new reward session for your audience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">Reward Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Premium Access Giveaway"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief details about the prize..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="banner" className="text-xs font-bold uppercase tracking-wider">Banner URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="banner"
                                        placeholder="https://..."
                                        value={bannerUrl}
                                        onChange={(e) => setBannerUrl(e.target.value)}
                                    />
                                    <div className="w-10 h-10 border rounded-lg flex items-center justify-center bg-muted shrink-0 overflow-hidden">
                                        {bannerUrl ? <img src={bannerUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-muted-foreground" />}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="count" className="text-xs font-bold uppercase tracking-wider">Audience Count</Label>
                                <Input
                                    id="count"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={audienceCount}
                                    onChange={(e) => handleAudienceCountChange(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        {audience.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-border">
                                <Label className="text-xs font-bold uppercase tracking-wider">Participants</Label>
                                <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {audience.map((person, i) => (
                                        <div key={i} className="flex gap-2 items-center p-2 bg-muted/30 rounded-lg">
                                            <span className="text-[10px] font-bold opacity-30 w-6 text-center">#{i + 1}</span>
                                            <Input
                                                className="h-8 text-xs"
                                                placeholder="Name"
                                                value={person.name}
                                                onChange={(e) => handleAudienceChange(i, "name", e.target.value)}
                                            />
                                            <Input
                                                className="h-8 text-xs"
                                                placeholder="Mobile"
                                                value={person.mobile}
                                                onChange={(e) => handleAudienceChange(i, "mobile", e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            className="w-full h-12"
                            disabled={loading || !title || audienceCount === 0}
                            onClick={createReward}
                        >
                            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Initialize Strategy
                        </Button>
                    </CardContent>
                </Card>

                {/* Rewards Dashboard */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                        <Download className="h-4 w-4 text-primary" /> Active Sessions & History
                    </h3>
                    <div className="grid gap-4 max-h-[850px] overflow-y-auto pr-2 custom-scrollbar">
                        {rewards.length === 0 ? (
                            <div className="text-center p-12 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
                                <p className="text-muted-foreground text-sm">No giveaway data found.</p>
                            </div>
                        ) : (
                            rewards.map((reward) => (
                                <Card key={reward._id} className={`overflow-hidden transition-all ${reward.status === 'active' ? 'border-primary/50 shadow-md bg-card' : 'opacity-70 bg-muted/20'}`}>
                                    <div className="p-4 flex gap-4">
                                        <div className="w-24 h-24 rounded-xl bg-muted overflow-hidden shrink-0">
                                            {reward.bannerUrl ? (
                                                <img src={reward.bannerUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold truncate">{reward.title}</h4>
                                                <div className="flex gap-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${reward.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                        {reward.status}
                                                    </span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => deleteReward(reward._id)}>
                                                        <Trash2 className="h-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 mb-2">{reward.description || "The community giveaway event."}</p>

                                            {reward.status === 'active' && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Select
                                                            value={reward.riggedIndex.toString()}
                                                            onValueChange={(val) => updateRiggedIndex(reward._id, parseInt(val))}
                                                        >
                                                            <SelectTrigger className="h-8 text-xs">
                                                                <SelectValue placeholder="Random Outcome" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="-1">🎲 Random Outcome</SelectItem>
                                                                {reward.audience.map((p: any, idx: number) => (
                                                                    <SelectItem key={idx} value={idx.toString()}>
                                                                        🎯 {p.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>

                                                        {!reward.spinTriggeredAt ? (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4"
                                                                onClick={() => triggerSpin(reward._id)}
                                                            >
                                                                <Play className="mr-1.5 h-3.5 w-3.5 fill-current" /> RUN
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 border-primary text-primary hover:bg-primary/10 font-bold px-4 group"
                                                                onClick={() => resetSpin(reward._id)}
                                                            >
                                                                <RotateCcw className="mr-1.5 h-3.5 w-3.5 group-hover:rotate-[-90deg] transition-transform" /> RESET
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {reward.winner && (
                                                <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/10 flex items-center gap-2">
                                                    <Trophy className="h-3.5 w-3.5 text-primary" />
                                                    <div className="text-[10px] truncate">
                                                        <span className="font-bold">Won:</span> {reward.winner.name} ({reward.winner.mobile})
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardManager;
