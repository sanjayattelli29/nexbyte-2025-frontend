import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Trophy, Loader2, MousePointer2, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const RewardManager = () => {
    const [rewards, setRewards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [rewardTitle, setRewardTitle] = useState("");
    const [audienceCount, setAudienceCount] = useState<number>(0);
    const [audienceData, setAudienceData] = useState<{ name: string; mobile: string }[]>([]);
    const [riggedIndex, setRiggedIndex] = useState<string>("-1");

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards`);
            const data = await response.json();
            if (data.success) setRewards(data.data);
        } catch (error) {
            toast.error("Error fetching rewards");
        } finally {
            setLoading(false);
        }
    };

    const handleAudienceCountChange = (count: number) => {
        setAudienceCount(count);
        const newData = [...audienceData];
        if (count > newData.length) {
            for (let i = newData.length; i < count; i++) {
                newData.push({ name: "", mobile: "" });
            }
        } else {
            newData.splice(count);
        }
        setAudienceData(newData);
    };

    const handleAudienceDataChange = (index: number, field: "name" | "mobile", value: string) => {
        const newData = [...audienceData];
        newData[index][field] = value;
        setAudienceData(newData);
    };

    const handleCreateReward = async () => {
        if (!rewardTitle) return toast.error("Please enter a reward title");
        if (audienceData.length === 0) return toast.error("Please add audience members");
        if (audienceData.some(a => !a.name || !a.mobile)) return toast.error("Please fill all audience details");

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: rewardTitle, audience: audienceData })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Reward created successfully!");
                setRewardTitle("");
                setAudienceCount(0);
                setAudienceData([]);
                fetchRewards();
            } else {
                toast.error("Failed to create reward");
            }
        } catch (error) {
            toast.error("Error creating reward");
        } finally {
            setLoading(false);
        }
    };

    const handleSetRigged = async (rewardId: string, index: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/rewards/${rewardId}/rig`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ riggedIndex: index })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Rigged winner updated!");
                fetchRewards();
            }
        } catch (error) {
            toast.error("Error updating rig");
        }
    };

    const handleDeleteReward = async (id: string) => {
        if (!confirm("Are you sure you want to delete this reward?")) return;
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
        <div className="space-y-6">
            <Card className="border-2 border-blue-500/20 bg-blue-50/10 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle>Create New Reward</CardTitle>
                            <CardDescription>Set up a new reward and audience list</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Reward Title</Label>
                            <Input
                                placeholder="e.g., Summer Giveaway 2024"
                                value={rewardTitle}
                                onChange={(e) => setRewardTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Number of Audience</Label>
                            <Input
                                type="number"
                                placeholder="Enter count"
                                value={audienceCount || ""}
                                onChange={(e) => handleAudienceCountChange(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    {audienceData.length > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-semibold text-sm text-gray-500 uppercase">Audience Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {audienceData.map((data, index) => (
                                    <div key={index} className="p-3 bg-white rounded-lg border shadow-sm space-y-2">
                                        <Label className="text-xs font-bold text-blue-600">Participant {index + 1}</Label>
                                        <Input
                                            placeholder="Full Name"
                                            value={data.name}
                                            onChange={(e) => handleAudienceDataChange(index, "name", e.target.value)}
                                        />
                                        <Input
                                            placeholder="Mobile Number"
                                            value={data.mobile}
                                            onChange={(e) => handleAudienceDataChange(index, "mobile", e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={handleCreateReward}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        Create Reward & Generate Audience
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Reward Dashbaord</CardTitle>
                        <CardDescription>Manage active rewards and view history</CardDescription>
                    </div>
                    <Button variant="outline" size="icon" onClick={fetchRewards}>
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Audience</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Rig Winner</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rewards.map((reward) => (
                                <TableRow key={reward._id}>
                                    <TableCell className="text-sm">
                                        {new Date(reward.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-medium">{reward.title}</TableCell>
                                    <TableCell>{reward.audience.length} Members</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${reward.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {reward.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {reward.status === 'active' ? (
                                            <div className="flex items-center gap-2">
                                                <MousePointer2 className="w-4 h-4 text-orange-500" />
                                                <Select
                                                    value={reward.riggedIndex?.toString() || "-1"}
                                                    onValueChange={(val) => handleSetRigged(reward._id, val)}
                                                >
                                                    <SelectTrigger className="w-[150px]">
                                                        <SelectValue placeholder="Select Winner" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="-1">Random</SelectItem>
                                                        {reward.audience.map((a: any, i: number) => (
                                                            <SelectItem key={i} value={i.toString()}>
                                                                {i + 1}. {a.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-bold text-blue-600">
                                                Winner: {reward.winner?.name}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteReward(reward._id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RewardManager;
