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
                toast.success("Spin state reset");
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
                    <p className="text-muted-foreground">Create and manage giveaways with live synchronization.</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Reward Form */}
                <Card className="shadow-lg border-2 border-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" /> New Giveaway
                        </CardTitle>
                        <CardDescription>Fill in the details for the next reward draw.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Reward Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Summer Special Giveaway"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tell the audience about this prize..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="banner">Banner Image URL (Optional)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="banner"
                                        placeholder="https://example.com/banner.jpg"
                                        value={bannerUrl}
                                        onChange={(e) => setBannerUrl(e.target.value)}
                                    />
                                    <div className="w-10 h-10 border rounded flex items-center justify-center bg-muted">
                                        {bannerUrl ? <img src={bannerUrl} className="w-full h-full object-cover rounded" /> : <ImageIcon className="w-4 h-4 text-muted-foreground" />}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="count">Number of Audience Members</Label>
                                <Input
                                    id="count"
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={audienceCount}
                                    onChange={(e) => handleAudienceCountChange(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        {audience.length > 0 && (
                            <div className="space-y-4 pt-4 border-t">
                                <Label>Audience Details</Label>
                                <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                                    {audience.map((person, i) => (
                                        <div key={i} className="flex gap-2 items-center p-3 bg-muted/50 rounded-lg">
                                            <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
                                            <Input
                                                placeholder="Name"
                                                value={person.name}
                                                onChange={(e) => handleAudienceChange(i, "name", e.target.value)}
                                            />
                                            <Input
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
                            className="w-full"
                            size="lg"
                            disabled={loading || !title || audienceCount === 0}
                            onClick={createReward}
                        >
                            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Create Strategy
                        </Button>
                    </CardContent>
                </Card>

                {/* Rewards List */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Download className="h-5 w-5" /> Recent Rewards
                    </h3>
                    <div className="grid gap-4 max-h-[800px] overflow-y-auto pr-2">
                        {rewards.length === 0 ? (
                            <div className="text-center p-12 bg-muted/30 rounded-xl border-2 border-dashed">
                                <p className="text-muted-foreground">No rewards created yet.</p>
                            </div>
                        ) : (
                            rewards.map((reward) => (
                                <Card key={reward._id} className={`overflow-hidden ${reward.status === 'active' ? 'border-primary ring-1 ring-primary/20' : 'opacity-80'}`}>
                                    <div className="aspect-video w-full relative bg-muted group">
                                        {reward.bannerUrl ? (
                                            <img src={reward.bannerUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                No Banner
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold text-white ${reward.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}>
                                                {reward.status}
                                            </span>
                                            <Button size="icon" variant="destructive" className="h-6 w-6" onClick={() => deleteReward(reward._id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 space-y-4">
                                        <div>
                                            <h4 className="font-bold text-lg">{reward.title}</h4>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{reward.description || "No description provided."}</p>
                                        </div>

                                        {reward.status === 'active' && (
                                            <div className="p-3 bg-primary/5 rounded-lg space-y-3 border border-primary/10">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-[10px] uppercase tracking-wider font-bold">Rigged Winner</Label>
                                                    <Select
                                                        value={reward.riggedIndex.toString()}
                                                        onValueChange={(val) => updateRiggedIndex(reward._id, parseInt(val))}
                                                    >
                                                        <SelectTrigger className="h-8 w-[180px]">
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
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-10"
                                                        disabled={reward.spinTriggeredAt}
                                                        onClick={() => triggerSpin(reward._id)}
                                                    >
                                                        <Play className="mr-2 h-4 w-4 fill-current" />
                                                        {reward.spinTriggeredAt ? "Wheel Running..." : "RUN WHEEL"}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="h-10 px-3"
                                                        onClick={() => resetSpin(reward._id)}
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                {reward.spinTriggeredAt && (
                                                    <p className="text-[10px] text-center text-orange-500 font-medium">
                                                        Last triggered: {new Date(reward.spinTriggeredAt).toLocaleTimeString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {reward.winner && (
                                            <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded flex items-center gap-2">
                                                <Trophy className="h-4 w-4 text-yellow-500" />
                                                <div className="text-[10px]">
                                                    <span className="font-bold">Winner:</span> {reward.winner.name} ({reward.winner.mobile})
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
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
