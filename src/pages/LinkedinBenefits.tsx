import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Linkedin,
    Briefcase,
    TrendingUp,
    Users,
    Building2,
    CheckCircle2,
    Calendar,
    Award,
    Target,
    UserCircle,
    FileText,
    Image as ImageIcon,
    PenTool,
    GraduationCap,
    Globe,
    ShieldCheck,
    Lightbulb,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LinkedinBenefits = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const benefits = [
        {
            title: "Career Benefits",
            icon: Briefcase,
            color: "text-blue-600",
            bg: "bg-blue-50",
            items: [
                "Builds professional visibility",
                "Attracts recruiters & hiring managers",
                "Helps in internships, jobs & freelancing",
                "Acts as a living resume",
                "Builds personal brand"
            ]
        },
        {
            title: "Business & Founder Benefits",
            icon: Building2,
            color: "text-purple-600",
            bg: "bg-purple-50",
            items: [
                "Lead generation",
                "Trust building",
                "Hiring interns & staff",
                "Partnerships & collaborations",
                "Authority in your domain"
            ]
        }
    ];

    const dailyActions = [
        "Accept new relevant connection requests",
        "Send 5–10 personalized connection requests",
        "Like & comment on 5 relevant posts",
        "Reply to all DMs & comments",
        "Post 1 story or reshare (optional but powerful)"
    ];

    const weeklyActions = [
        { label: "Post 1 long-form value post", icon: PenTool },
        { label: "Add 10–20 new connections", icon: Users },
        { label: "Update headline or summary (once a month)", icon: FileText },
        { label: "Engage with industry leaders’ posts", icon: TrendingUp }
    ];

    const yearlyGoals = [
        {
            role: "Students / Interns",
            goals: [
                "1,000–3,000 quality connections",
                "1–2 internships listed",
                "5–10 certificates added",
                "Clear career direction on profile"
            ],
            color: "blue"
        },
        {
            role: "Professionals",
            goals: [
                "3,000–5,000 connections",
                "Domain authority posts",
                "Job switch / promotion",
                "Recruiter inbound messages"
            ],
            color: "purple"
        },
        {
            role: "Founders / Companies",
            goals: [
                "Strong company page",
                "Weekly hiring/internship posts",
                "Brand recognition",
                "Lead inquiries via LinkedIn"
            ],
            color: "orange"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="container px-4 text-center relative z-10">
                    <motion.div {...fadeIn}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                            <Linkedin className="w-4 h-4" />
                            <span>Ultimate LinkedIn Guide</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Growth Potential</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            It positions you as a career + growth enabler, not just a service company.
                            Master the art of LinkedIn to attract opportunities, build authority, and accelerate your career.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 1. WHY LINKEDIN IS IMPORTANT */}
            <section className="py-16 container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Why LinkedIn is Important</h2>
                    <p className="text-slate-600">More than just a job board—it's your professional identity.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="h-full border-t-4 border-t-current hover:shadow-lg transition-shadow duration-300" style={{ borderColor: benefit.color === 'text-blue-600' ? '#2563eb' : '#9333ea' }}>
                                <CardHeader className={`${benefit.bg} bg-opacity-30`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-lg bg-white shadow-sm ${benefit.color}`}>
                                            <benefit.icon className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ul className="space-y-3">
                                        {benefit.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-700">
                                                <CheckCircle2 className={`w-5 h-5 shrink-0 ${benefit.color}`} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 2. DAILY LINKEDIN THINGS TO DO */}
            <section className="py-16 bg-white">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Daily Habits (15–30 Min)</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                                    The Daily Checklist
                                </h3>
                                <div className="space-y-4">
                                    {dailyActions.map((action, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 hover:shadow-sm transition-all">
                                            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 shrink-0">
                                                <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                                            </div>
                                            <span className="text-slate-700 font-medium">{action}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-2xl text-white">
                                <h3 className="text-xl font-bold mb-6">Daily Posting Ideas</h3>
                                <p className="mb-4 opacity-90">Communicate value 3–4 days/week:</p>
                                <ul className="space-y-4">
                                    {[
                                        "Career tips & insights",
                                        "Learning updates (Today I learned...)",
                                        "Internship / Training experiences",
                                        "Company activities / Behind the scenes",
                                        "Motivational but professional thoughts"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                            <Lightbulb className="w-5 h-5 text-yellow-300" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. WEEKLY & MONTHLY CHECKS */}
            <section className="py-16 container px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-start h-full">
                    {/* Weekly */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                                <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Weekly Checks</h2>
                        </div>
                        <p className="text-slate-600 mb-6">Review your analytics and adjust your strategy.</p>

                        <Card className="border-l-4 border-l-orange-500">
                            <CardHeader className="bg-orange-50/50 pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-orange-600" />
                                    Analytics Review
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 grid grid-cols-2 gap-4">
                                {["Profile views", "Post impressions", "New followers", "Engagement rate"].map((metric, i) => (
                                    <div key={i} className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                                        <span className="block text-sm text-slate-500">{metric}</span>
                                        <span className="block text-lg font-bold text-slate-900">Track ↑↓</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 p-4 border-b border-slate-100 font-semibold text-slate-700">Weekly Actions</div>
                            <div className="p-4 space-y-3">
                                {weeklyActions.map((action, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-700">
                                        <action.icon className="w-5 h-5 text-blue-500" />
                                        <span>{action.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Monthly */}
                    <div className="space-y-6 h-full flex flex-col">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Monthly Reset</h2>
                        </div>
                        <p className="text-slate-600 mb-6">Update your profile to reflect new achievements.</p>
                        
                        <div className="bg-slate-900 text-white p-8 rounded-2xl flex-1 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                            
                            <h3 className="text-2xl font-bold mb-6 relative z-10">Monthly Checklist</h3>
                            <ul className="space-y-4 relative z-10">
                                {[
                                    { text: "Update Featured Section", sub: "Showcase your best work" },
                                    { text: "Add New Certificates", sub: "Validate your skills" },
                                    { text: "Update Experience", sub: "Internships or Projects" },
                                    { text: "Post Performance Review", sub: "Re-share best content" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">{item.text}</p>
                                            <p className="text-white/60 text-sm">{item.sub}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. YEARLY GOALS (SMART GOALS) */}
            <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">Long Term Vision</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">Annual LinkedIn Goals</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {yearlyGoals.map((persona, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className={`relative p-6 rounded-2xl h-full border hover:shadow-xl transition-all duration-300 bg-white group ${
                                    persona.color === 'blue' ? 'border-blue-200 hover:border-blue-300' : 
                                    persona.color === 'purple' ? 'border-purple-200 hover:border-purple-300' : 'border-orange-200 hover:border-orange-300'
                                }`}>
                                    <div className={`absolute top-0 left-0 w-full h-1.5 rounded-t-2xl ${
                                        persona.color === 'blue' ? 'bg-blue-500' : 
                                        persona.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                                    }`}></div>

                                    <h3 className="text-xl font-bold mb-4 mt-2 text-slate-900">{persona.role}</h3>
                                    
                                    <ul className="space-y-3">
                                        {persona.goals.map((goal, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                <Target className={`w-4 h-4 shrink-0 mt-0.5 ${
                                                    persona.color === 'blue' ? 'text-blue-500' : 
                                                    persona.color === 'purple' ? 'text-purple-500' : 'text-orange-500'
                                                }`} />
                                                <span>{goal}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. PROFILE BUILDING GUIDE */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Profile Optimization Guide</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto text-lg">Your profile is your landing page. Here is how to structure every section for maximum impact.</p>
                    </div>

                    <div className="max-w-5xl mx-auto space-y-12">
                        {/* Photo & Cover */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-400">
                                    <ImageIcon className="w-8 h-8" />
                                    Visual Identity
                                </h3>
                                <div className="space-y-6">
                                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <h4 className="font-semibold text-lg mb-3">Profile Photo</h4>
                                        <ul className="space-y-2 text-slate-300 text-sm">
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Clean background</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Professional dress</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> Clear face with a smile</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <h4 className="font-semibold text-lg mb-3">Cover Photo</h4>
                                        <p className="text-sm text-slate-300 mb-3">Must include: Your role, Skills, Tagline</p>
                                        <div className="bg-slate-800 p-3 rounded text-center text-xs text-slate-400 font-mono">
                                            Software | Marketing | Internships | Training
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                                <UserCircle className="w-16 h-16 text-blue-500 mb-4" />
                                <h4 className="text-xl font-bold mb-4">Headline Formula</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                                        <span className="text-red-400 font-bold block text-xs uppercase mb-1">Bad Example</span>
                                        <p className="text-slate-300">Student at XYZ College</p>
                                    </div>
                                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                                        <span className="text-green-400 font-bold block text-xs uppercase mb-1">Good Example</span>
                                        <p className="text-white font-medium">Aspiring Software Engineer | Internship @ NexByte | Web Development | Problem Solver</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About, Experience, Education */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "About / Summary",
                                    icon: FileText,
                                    content: "Structure: Who you are, What you do, Skills, What you're looking for.",
                                    tip: "Tell a story, don't just list facts."
                                },
                                {
                                    title: "Experience",
                                    icon: Briefcase,
                                    content: "Add Internships, Training, Freelance, Projects.",
                                    tip: "Use bullet points. Focus on impact."
                                },
                                {
                                    title: "Education & Skills",
                                    icon: GraduationCap,
                                    content: "Degree, College, Relevant Coursework. Add Technical & Soft skills.",
                                    tip: "Get endorsements for your top skills."
                                }
                            ].map((section, i) => (
                                <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <section.icon className="w-8 h-8 text-indigo-400 mb-4" />
                                    <h4 className="font-bold text-lg mb-3">{section.title}</h4>
                                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">{section.content}</p>
                                    <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wide">💡 {section.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. NEXBYTE OFFERINGS */}
            <section className="py-16 bg-blue-50">
                <div className="container px-4 mx-auto">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">NexByte Advantage</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How We Boost Your LinkedIn Game</h2>
                            <p className="text-slate-600 text-lg">We don't just teach technology; we build your professional presence.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                {[
                                    "LinkedIn profile optimization",
                                    "Career guidance",
                                    "Internship experience",
                                    "Training + certification",
                                    "Hackathons & events",
                                    "Personal branding support",
                                    "Recruiter-ready profile"
                                ].map((offer, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-800 font-medium">
                                        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                                        <span>{offer}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg shadow-blue-200">
                                Start Your Journey
                            </Button>
                        </div>
                        
                        <div className="flex-1 w-full relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-2xl transform rotate-3"></div>
                            <div className="relative bg-white border border-slate-100 p-8 rounded-2xl shadow-lg">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <PenTool className="w-6 h-6 text-purple-600" />
                                    Content Ideas for You
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "“Daily LinkedIn habit for students”",
                                        "“Why your LinkedIn profile is not getting views”",
                                        "“Internship vs training – what to add on LinkedIn”",
                                        "“How we help students build real profiles”",
                                        "“Weekly LinkedIn audit tips”"
                                    ].map((idea, i) => (
                                        <li key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
                                            <span className="text-slate-300 font-bold text-lg">0{i+1}</span>
                                            <p className="text-slate-700 font-medium italic">"{idea.replace(/“|”/g, '')}"</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default LinkedinBenefits;
