import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trash2, Save, Plus, Trash, Download, Loader2, Image as ImageIcon, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";
import { IKContext, IKUpload, IKImage } from "imagekitio-react";

const IK_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IK_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

const QuizManager = () => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState<any[]>([]);
    const [selectedQuizIdForAttempts, setSelectedQuizIdForAttempts] = useState("");
    const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

    const [newQuiz, setNewQuiz] = useState({
        name: "",
        bannerImage: "",
        companyName: "",
        companyLink: "",
        isTimed: false,
        durationMinutes: 5,
        questions: [] as any[]
    });

    const [uploadingBanner, setUploadingBanner] = useState(false);

    const authenticator = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/imagekit-auth`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error: any) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    };

    const handleUploadError = (err: any) => {
        setUploadingBanner(false);
        toast.error("Image upload failed");
    };

    const handleUploadSuccess = (res: any) => {
        setUploadingBanner(false);
        setNewQuiz({ ...newQuiz, bannerImage: res.filePath });
        toast.success("Image uploaded successfully");
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (selectedQuizIdForAttempts) {
            fetchAttempts(selectedQuizIdForAttempts);
        } else {
            setAttempts([]);
        }
    }, [selectedQuizIdForAttempts]);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/quizzes`);
            const data = await res.json();
            if (data.success) {
                setQuizzes(data.data);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            toast.error("Failed to load quizzes");
        } finally {
            setLoading(false);
        }
    };

    const fetchAttempts = async (quizId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/attempts`);
            const data = await res.json();
            if (data.success) {
                setAttempts(data.data);
            }
        } catch (error) {
            console.error("Error fetching attempts:", error);
        }
    };

    const handleAddQuestion = () => {
        setNewQuiz({
            ...newQuiz,
            questions: [
                ...newQuiz.questions,
                { question: "", options: ["", "", "", ""], correctAnswer: "" }
            ]
        });
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        const updatedQuestions = [...newQuiz.questions];
        if (field === "question") {
            updatedQuestions[index].question = value;
        } else if (field === "correctAnswer") {
            updatedQuestions[index].correctAnswer = value;
        } else if (field.startsWith("option")) {
            const optIndex = parseInt(field.replace("option", ""));
            updatedQuestions[index].options[optIndex] = value;
        }
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleRemoveQuestion = (index: number) => {
        const updatedQuestions = [...newQuiz.questions];
        updatedQuestions.splice(index, 1);
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleEditClick = (quiz: any) => {
        setNewQuiz({
            name: quiz.name,
            bannerImage: quiz.bannerImage || "",
            companyName: quiz.companyName || "",
            companyLink: quiz.companyLink || "",
            isTimed: quiz.isTimed || false,
            durationMinutes: quiz.durationMinutes || 5,
            questions: quiz.questions || []
        });
        setEditingQuizId(quiz._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingQuizId(null);
        setNewQuiz({
            name: "", bannerImage: "", companyName: "", companyLink: "", isTimed: false, durationMinutes: 5, questions: []
        });
    };

    const handleCreateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate questions
        if (newQuiz.questions.length === 0) {
            return toast.error("Please add at least one question.");
        }
        for (let i = 0; i < newQuiz.questions.length; i++) {
            const q = newQuiz.questions[i];
            if (!q.question) return toast.error(`Question ${i+1} is empty.`);
            if (q.options.some((opt: string) => !opt)) return toast.error(`Question ${i+1} has empty options.`);
            if (!q.correctAnswer) return toast.error(`Question ${i+1} has no correct answer selected.`);
            if (!q.options.includes(q.correctAnswer)) return toast.error(`Question ${i+1}'s correct answer does not match any option.`);
        }

        try {
            const url = editingQuizId ? `${API_BASE_URL}/api/quizzes/${editingQuizId}` : `${API_BASE_URL}/api/quizzes`;
            const method = editingQuizId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQuiz)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(editingQuizId ? "Quiz updated successfully!" : "Quiz created successfully!");
                fetchQuizzes();
                if (editingQuizId) {
                    handleCancelEdit();
                } else {
                    setNewQuiz({
                        name: "", bannerImage: "", companyName: "", companyLink: "", isTimed: false, durationMinutes: 5, questions: []
                    });
                }
            } else {
                toast.error(editingQuizId ? "Failed to update quiz." : "Failed to create quiz.");
            }
        } catch (error) {
            toast.error(editingQuizId ? "Error updating quiz." : "Error creating quiz.");
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (!confirm("Delete this quiz?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/quizzes/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast.success("Quiz deleted");
                fetchQuizzes();
                if (selectedQuizIdForAttempts === id) {
                    setSelectedQuizIdForAttempts("");
                }
            } else {
                toast.error("Failed to delete quiz");
            }
        } catch (error) {
            toast.error("Error deleting quiz");
        }
    };

    const handleDownloadCSV = () => {
        if (attempts.length === 0) return toast.error("No data to download");

        const headers = ["Date", "Name/Mobile", "Email", "Correct", "Wrong", "Total Time (s)", "Avg Time per Q (s)"];
        const rows = attempts.map(app => {
            return [
                new Date(app.submittedAt).toLocaleDateString(),
                app.mobile,
                app.email,
                app.correctCount,
                app.wrongCount,
                app.totalTimeSeconds,
                app.avgTimePerQuestion
            ].map(f => `"${f || ''}"`).join(",");
        });

        const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.href = encodedUri;
        const selectedQuiz = quizzes.find(q => q._id === selectedQuizIdForAttempts);
        const quizName = selectedQuiz ? selectedQuiz.name : "Quiz";
        link.download = `${quizName.replace(/\\s+/g, '_')}_attempts.csv`;
        link.click();
    };


    return (
        <IKContext
            publicKey={IK_PUBLIC_KEY}
            urlEndpoint={IK_URL_ENDPOINT}
            authenticator={authenticator}
        >
            <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Create Quiz Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{editingQuizId ? "Edit Quiz" : "Create a New Quiz"}</CardTitle>
                        <CardDescription>{editingQuizId ? "Update existing quiz configuration." : "Design a quiz for a hackathon or event."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateQuiz} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Quiz Name <span className="text-red-500">*</span></Label>
                                <Input required value={newQuiz.name} onChange={(e) => setNewQuiz({ ...newQuiz, name: e.target.value })} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Banner Image <span className="text-red-500">*</span></Label>
                                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                    <IKUpload
                                        fileName="quiz-banner.jpg"
                                        folder="/quizzes"
                                        useUniqueFileName={true}
                                        onError={handleUploadError}
                                        onSuccess={handleUploadSuccess}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onUploadStart={() => setUploadingBanner(true)}
                                    />
                                    {uploadingBanner ? (
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="mx-auto h-8 w-8 text-blue-500 animate-spin mb-2" />
                                            <span className="text-sm text-blue-500 font-medium">Uploading...</span>
                                        </div>
                                    ) : newQuiz.bannerImage ? (
                                        <div className="flex flex-col items-center justify-center">
                                            <IKImage path={newQuiz.bannerImage} className="max-h-24 object-contain mb-2 rounded" loading="lazy" />
                                            <span className="text-sm text-green-600 font-medium">Image Uploaded Successfully! Click to replace.</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Click to upload banner image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Promoting Company Name <span className="text-red-500">*</span></Label>
                                    <Input required value={newQuiz.companyName} onChange={(e) => setNewQuiz({ ...newQuiz, companyName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company Link URL <span className="text-red-500">*</span></Label>
                                    <Input type="url" required value={newQuiz.companyLink} onChange={(e) => setNewQuiz({ ...newQuiz, companyLink: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4 p-4 border rounded-lg bg-gray-50">
                                <input
                                    type="checkbox"
                                    id="isTimed"
                                    className="h-4 w-4"
                                    checked={newQuiz.isTimed}
                                    onChange={(e) => setNewQuiz({ ...newQuiz, isTimed: e.target.checked })}
                                />
                                <Label htmlFor="isTimed" className="font-bold">Is this a timed quiz?</Label>
                            </div>

                            {newQuiz.isTimed && (
                                <div className="space-y-2">
                                    <Label>Duration (Minutes) <span className="text-red-500">*</span></Label>
                                    <Input type="number" min="1" required value={newQuiz.durationMinutes} onChange={(e) => setNewQuiz({ ...newQuiz, durationMinutes: parseInt(e.target.value) })} />
                                </div>
                            )}

                            <div className="mt-8 border-t pt-6">
                                <div className="mb-4">
                                    <h4 className="font-bold">Questions ({newQuiz.questions.length})</h4>
                                </div>

                                {newQuiz.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="p-4 mb-4 border rounded-lg bg-white relative">
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveQuestion(qIndex)}>
                                            <Trash className="w-3 h-3" />
                                        </Button>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <Label>Question {qIndex + 1}</Label>
                                                <Input required value={q.question} onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)} />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-gray-200">
                                                {[0, 1, 2, 3].map((optIndex) => (
                                                    <div key={optIndex}>
                                                        <Label className="text-xs text-gray-500">Option {optIndex + 1}</Label>
                                                        <Input required value={q.options[optIndex]} onChange={(e) => handleQuestionChange(qIndex, `option${optIndex}`, e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <Label>Correct Answer (Must exactly match one option)</Label>
                                                <select className="w-full border rounded-md px-3 py-2 text-sm" value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}>
                                                    <option value="">Select Correct Option...</option>
                                                    {q.options.map((opt: string, i: number) => (
                                                        opt ? <option key={i} value={opt}>{opt}</option> : null
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button type="button" variant="outline" className="w-full mt-2" onClick={handleAddQuestion}>
                                    <Plus className="w-4 h-4 mr-1" /> Add Question
                                </Button>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button type="submit" className="flex-1">
                                    <Save className="w-4 h-4 mr-2" />
                                    {editingQuizId ? "Update Quiz" : "Create Quiz"}
                                </Button>
                                {editingQuizId && (
                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Existing Quizzes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading...</p>
                        ) : quizzes.length === 0 ? (
                            <p className="text-sm text-gray-500">No quizzes found.</p>
                        ) : (
                            <div className="space-y-4">
                                {quizzes.map(quiz => (
                                    <div key={quiz._id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                                        <div>
                                            <h4 className="font-bold">{quiz.name}</h4>
                                            <p className="text-xs text-gray-500">{quiz.companyName} • {quiz.questions.length} Questions • {quiz.isTimed ? `${quiz.durationMinutes} mins` : 'Untimed'}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">ID: {quiz._id}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" onClick={() => handleEditClick(quiz)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDeleteQuiz(quiz._id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Subsection: Users Interacted */}
            <Card>
                <CardHeader>
                    <CardTitle>Users Interacted with Quiz</CardTitle>
                    <CardDescription>View and download data of users who took a specific quiz.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-md mb-6">
                        <Label>Select Quiz</Label>
                        <select 
                            className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                            value={selectedQuizIdForAttempts}
                            onChange={(e) => setSelectedQuizIdForAttempts(e.target.value)}
                        >
                            <option value="">-- Select a Quiz --</option>
                            {quizzes.map(q => (
                                <option key={q._id} value={q._id}>{q.name} ({q.companyName})</option>
                            ))}
                        </select>
                    </div>

                    {selectedQuizIdForAttempts && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold">{attempts.length} Attempts</h4>
                                <Button onClick={handleDownloadCSV} variant="outline" className="text-green-600 border-green-200">
                                    <Download className="w-4 h-4 mr-2" /> Download Excel/CSV
                                </Button>
                            </div>
                            
                            {attempts.length === 0 ? (
                                <p className="text-sm text-gray-500">No attempts yet for this quiz.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Mobile/Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Correct</TableHead>
                                                <TableHead>Wrong</TableHead>
                                                <TableHead>Total Time</TableHead>
                                                <TableHead>Avg Time/Q</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {attempts.map(att => (
                                                <TableRow key={att._id}>
                                                    <TableCell className="text-xs">{new Date(att.submittedAt).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-xs">{att.mobile}</TableCell>
                                                    <TableCell className="text-xs">{att.email}</TableCell>
                                                    <TableCell className="text-xs font-bold text-green-600">{att.correctCount}</TableCell>
                                                    <TableCell className="text-xs font-bold text-red-600">{att.wrongCount}</TableCell>
                                                    <TableCell className="text-xs">{att.totalTimeSeconds}s</TableCell>
                                                    <TableCell className="text-xs">{att.avgTimePerQuestion}s</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            </div>
        </IKContext>
    );
};

export default QuizManager;
