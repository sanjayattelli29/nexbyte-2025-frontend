import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Video, ExternalLink, Filter, Download as DownloadIcon, Loader2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const Webinars = () => {
    const [webinars, setWebinars] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [filterType, setFilterType] = useState("upcoming"); // upcoming, past

    useEffect(() => {
        fetchCategories();
        fetchWebinars();
    }, [category, filterType]); // Refetch when filters change

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/webinars/categories`);
            const data = await response.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchWebinars = async () => {
        setLoading(true);
        try {
            // Build Query
            let url = `${API_BASE_URL}/api/webinars?sortBy=${filterType === "past" ? "latest" : "oldest"}`;
            if (category && category !== "All") url += `&category=${encodeURIComponent(category)}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                let fetchedWebinars = data.data;
                const now = new Date();

                // Client-side filtering for Upcoming/Past (since API returns all usually, or we could add backend filter)
                // Assuming backend returns all, we filter here for precise control
                if (filterType === "upcoming") {
                    fetchedWebinars = fetchedWebinars.filter((w: any) => new Date(w.date) >= now);
                } else {
                    fetchedWebinars = fetchedWebinars.filter((w: any) => new Date(w.date) < now);
                }

                // Client-side search (for smoother experience without frequent API calls if list is small)
                if (search) {
                    fetchedWebinars = fetchedWebinars.filter((w: any) =>
                        w.title.toLowerCase().includes(search.toLowerCase()) ||
                        w.category.toLowerCase().includes(search.toLowerCase())
                    );
                }

                setWebinars(fetchedWebinars);
            }
        } catch (error) {
            console.error("Error fetching webinars:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Search on Enter or Button Click (Optional if we want real-time)
    useEffect(() => {
        // Debounce search or just filter locally if data is already fetched
        // For now, let's just refetch or filter the local state if we had all data.
        // But to be consistent with fetchWebinars logic which calls API:
        const delayDebounceFn = setTimeout(() => {
            fetchWebinars();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            {/* HERO BANNER - Premium Design similar to AI Posts */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-[#0f172a] text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]"></div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="mb-4 text-blue-400 border-blue-400/30 px-4 py-1.5 text-sm rounded-full backdrop-blur-sm bg-blue-500/10">
                            Knowledge Hub
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Training Sessions & Webinars
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Access our centralized archive of technical learning initiatives.
                            Watch past sessions, join upcoming ones, and download exclusive resources.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* FILTERS & CONTENT */}
            <div className="container mx-auto px-4 -mt-10 relative z-20 mb-20">
                <Card className="shadow-xl border-0 ring-1 ring-gray-900/5 bg-white/80 backdrop-blur-xl">
                    <CardHeader className="pb-0 border-b border-gray-100/50 p-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

                            {/* Type Toggle */}
                            <div className="flex bg-gray-100/80 p-1 rounded-lg">
                                <button
                                    onClick={() => setFilterType("upcoming")}
                                    className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${filterType === "upcoming" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() => setFilterType("past")}
                                    className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${filterType === "past" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    Past Sessions
                                </button>
                            </div>

                            {/* Search & Category */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search topics..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9 w-full sm:w-64 bg-white/50 focus:bg-white transition-all border-gray-200"
                                    />
                                </div>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="w-full sm:w-48 bg-white/50 border-gray-200">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        {categories.map(cat => (
                                            <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center items-center py-20 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                                <span>Loading sessions...</span>
                            </div>
                        ) : webinars.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Video className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">No sessions found</h3>
                                <p className="text-gray-500 mt-1">Try adjusting your filters or check back later.</p>
                            </div>
                        ) : (
                            <>
                                {/* DESKTOP TABLE VIEW */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow>
                                                <TableHead className="w-[180px]">Date</TableHead>
                                                <TableHead className="w-[150px]">Category</TableHead>
                                                <TableHead>Session Details</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {webinars.map((webinar) => (
                                                <TableRow key={webinar._id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <TableCell className="font-medium text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-blue-500" />
                                                            {new Date(webinar.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </div>
                                                        <div className="text-xs text-gray-400 ml-6 pl-0.5">
                                                            {new Date(webinar.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                                            {webinar.category}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="py-2">
                                                            <div className="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                                                                {webinar.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 line-clamp-1 max-w-lg">
                                                                {webinar.description}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {webinar.resourceLink ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-9 gap-2 text-gray-600 hover:text-blue-600 hover:border-blue-200"
                                                                    asChild
                                                                >
                                                                    <a href={webinar.resourceLink} target="_blank" rel="noreferrer">
                                                                        <DownloadIcon className="w-4 h-4" /> Resources
                                                                    </a>
                                                                </Button>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic px-3">Coming Soon</span>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                className="h-9 gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200"
                                                                asChild
                                                            >
                                                                <a href={webinar.youtubeLink} target="_blank" rel="noreferrer">
                                                                    <PlayCircle className="w-4 h-4" /> Watch
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* MOBILE LIST VIEW */}
                                <div className="md:hidden divide-y divide-gray-100">
                                    {webinars.map((webinar) => (
                                        <div key={webinar._id} className="p-5 flex flex-col gap-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline" className="text-xs">{webinar.category}</Badge>
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {new Date(webinar.date).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-1">{webinar.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">{webinar.description}</p>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2">
                                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" size="sm" asChild>
                                                    <a href={webinar.youtubeLink} target="_blank" rel="noreferrer">
                                                        <PlayCircle className="w-4 h-4 mr-2" /> Watch
                                                    </a>
                                                </Button>
                                                {webinar.resourceLink ? (
                                                    <Button variant="outline" className="flex-1" size="sm" asChild>
                                                        <a href={webinar.resourceLink} target="_blank" rel="noreferrer">
                                                            <DownloadIcon className="w-4 h-4 mr-2" /> Notes
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <div className="flex-1 text-center text-xs text-gray-400 italic py-2">
                                                        Notes Soon
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default Webinars;
