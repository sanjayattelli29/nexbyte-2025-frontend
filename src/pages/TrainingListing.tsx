import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Monitor, ExternalLink, ArrowLeft, BookOpen, MapPin, Phone, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "@/config";
import TrainingRegistrationModal from "@/components/TrainingRegistrationModal";

const TrainingListing = () => {
    const { topic } = useParams<{ topic: string }>();
    const decodedTopic = decodeURIComponent(topic || "");
    const [trainings, setTrainings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTraining, setSelectedTraining] = useState<any | null>(null);
    const [expandedDesc, setExpandedDesc] = useState<string | null>(null); // Track which training has expanded description

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/trainings?category=${encodeURIComponent(decodedTopic)}&status=Active`);
                const data = await response.json();
                if (data.success) {
                    setTrainings(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch trainings", error);
            } finally {
                setLoading(false);
            }
        };

        if (decodedTopic) {
            fetchTrainings();
        }
    }, [decodedTopic]);

    // Format date helper
    const formatDate = (dateString: string) => {
        if (!dateString) return "TBA";
        return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-24 overflow-hidden bg-background">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-indigo-600/5" />
                    <div className="container mx-auto px-4 relative z-10">
                        <Link to="/training-discovery" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors group text-sm font-medium">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Topics
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
                                {decodedTopic}
                            </h1>
                            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                                Curated professional training programs designed to launch your career in {decodedTopic}.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Listings */}
                <section className="py-16 container mx-auto px-4 max-w-7xl">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : trainings.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
                            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
                                <BookOpen className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-900">No Active Trainings Found</h3>
                            <p className="text-slate-500 mb-8">We are currently curating new high-impact courses for {decodedTopic}.</p>
                            <Link to="/training-discovery">
                                <Button variant="outline" className="rounded-full">Explore Other Topics</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {trainings.map((training, index) => (
                                <motion.div
                                    key={training._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:shadow-indigo-500/10 h-full"
                                >
                                    {/* Content Area - Expanded for readability */}
                                    <div className="flex-1 p-8 flex flex-col relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 px-4 py-1.5 text-xs font-bold tracking-wide uppercase rounded-full shadow-lg shadow-indigo-500/20">
                                                {training.mode || "Online"}
                                            </Badge>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
                                            {training.name}
                                        </h3>

                                        <div className={`prose prose-slate text-slate-600 mb-4 leading-relaxed text-sm ${expandedDesc === training._id ? '' : 'line-clamp-3'}`}>
                                            {training.description}
                                        </div>

                                        <button
                                            onClick={() => setExpandedDesc(expandedDesc === training._id ? null : training._id)}
                                            className="text-indigo-600 font-semibold text-xs flex items-center hover:text-indigo-700 transition-colors mb-6 w-fit"
                                        >
                                            {expandedDesc === training._id ? "Read Less" : "Read More"} <ChevronRight className="w-3 h-3 ml-1" />
                                        </button>

                                        <div className="flex flex-wrap gap-3 mt-auto">
                                            {training.duration && (
                                                <div className="flex items-center text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
                                                    {training.duration}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Date Section - Originally Sidebar */}
                                    <div className="bg-indigo-50/50 border-t border-indigo-100 p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                            {/* Start Date */}
                                            <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm flex flex-col justify-center">
                                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Start Date</p>
                                                <p className="font-bold text-slate-900 text-sm whitespace-nowrap">{formatDate(training.startDate)}</p>
                                            </div>

                                            {/* End Date */}
                                            <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm flex flex-col justify-center">
                                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">End Date</p>
                                                <p className="font-bold text-slate-900 text-sm whitespace-nowrap">{formatDate(training.endDate)}</p>
                                            </div>

                                            {/* Apply Before */}
                                            <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm flex flex-col justify-center ring-1 ring-red-50/50">
                                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">Apply By</p>
                                                <p className="font-bold text-red-600 text-sm whitespace-nowrap">{formatDate(training.applyBy)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {training.syllabusLink && (
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 h-12 rounded-xl border-indigo-200 text-indigo-700 hover:bg-white hover:text-indigo-800 font-bold"
                                                    onClick={() => window.open(training.syllabusLink, '_blank')}
                                                >
                                                    <BookOpen className="w-4 h-4 mr-2" /> Syllabus
                                                </Button>
                                            )}

                                            <Button
                                                className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 font-bold"
                                                onClick={() => setSelectedTraining(training)}
                                            >
                                                Apply Now
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />

            <TrainingRegistrationModal
                isOpen={!!selectedTraining}
                onClose={() => setSelectedTraining(null)}
                training={selectedTraining}
            />
        </div>
    );
};

export default TrainingListing;
