import { motion } from "framer-motion";
import { ArrowRight, Zap, BarChart3, Users, Star, Quote, Menu, X, TrendingUp, CheckCircle2, Globe, Mail, Sparkles, Inbox, Bell, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardDescription, CardHeader, CardFooter } from "../components/ui/Card";
import { SectionLabel } from "../components/ui/SectionLabel";

import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/85 backdrop-blur-md border-b border-border/80 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="GigFlow Logo" className="h-8 w-8 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" />
          <span className="font-serif text-xl font-normal text-foreground tracking-tight">GigFlow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Testimonials
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground hover:bg-muted rounded-xl transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 border-b border-border bg-card shadow-lg px-6 py-6 flex flex-col gap-4 md:hidden"
        >
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-muted-foreground hover:text-foreground py-1"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-muted-foreground hover:text-foreground py-1"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-muted-foreground hover:text-foreground py-1"
          >
            Testimonials
          </a>
          <hr className="border-border my-1" />
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button className="w-full shadow-accent" asChild onClick={() => setMobileMenuOpen(false)}>
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:py-36 lg:py-44 min-h-[90vh] flex items-center">
      {/* Dynamic ambient background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,82,255,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-10 left-[-100px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(77,124,255,0.04)_0%,transparent_75%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-8 items-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeInUp}>
              <SectionLabel pulsing>GIGFLOW DASHBOARD</SectionLabel>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="mt-6 text-[2.75rem] md:text-6xl lg:text-[5rem] font-serif leading-[1.05] tracking-[-0.02em] text-foreground"
            >
              Turn Data Into <br className="hidden md:block" />
              <span className="relative inline-block mt-2">
                <span className="gradient-text">Revenue</span>
                <span className="gradient-underline" />
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mt-8 text-lg md:text-xl text-muted-foreground leading-[1.75] max-w-xl"
            >
              The most powerful, AI-driven platform for managing leads, tracking key growth metrics, and scaling your revenue pipeline with minimal effort.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" asChild className="group">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* High-Fidelity Animated Mock-Up */}
          <div className="hidden lg:block relative h-[600px] w-full">
            {/* Spinning decorative orbit ring */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-dashed border-accent/15 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 65, ease: "linear", repeat: Infinity }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-accent/5 pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 50, ease: "linear", repeat: Infinity }}
            />

            {/* Decorative dot grid background */}
            <div className="absolute top-[20%] left-[25%] opacity-15 grid grid-cols-4 gap-4 pointer-events-none">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-accent" />
              ))}
            </div>

            {/* CARD 1: Main Analytics Graph Card */}
            <motion.div 
              className="absolute top-[12%] left-[5%] w-[380px] rounded-2xl border border-border/80 bg-card/90 shadow-2xl p-6 backdrop-blur"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Total Revenue</p>
                  <h3 className="text-2xl font-sans font-bold tracking-tight text-foreground mt-0.5">$48,250.00</h3>
                </div>
                <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  <TrendingUp size={12} />
                  +14.2%
                </div>
              </div>
              
              {/* Mini visual SVG line graph */}
              <div className="h-28 w-full mt-4">
                <svg className="w-full h-full" viewBox="0 0 100 35" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0052FF" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0052FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0 30 Q15 28 30 18 T60 10 T90 5 L100 2 L100 35 L0 35 Z" 
                    fill="url(#chartGrad)" 
                  />
                  <path 
                    d="M0 30 Q15 28 30 18 T60 10 T90 5 L100 2" 
                    fill="none" 
                    stroke="url(#accentGrad)" 
                    strokeWidth="2.2" 
                    strokeLinecap="round"
                  />
                  <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0052FF" />
                    <stop offset="100%" stopColor="#4D7CFF" />
                  </linearGradient>
                  {/* Pulsing indicator node */}
                  <motion.circle 
                    cx="90" 
                    cy="5" 
                    r="3" 
                    fill="#0052FF"
                    animate={{ r: [3, 5, 3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <circle cx="90" cy="5" r="1.5" fill="#FFFFFF" />
                </svg>
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-2 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Active Analytics</span>
                <span>Updated just now</span>
              </div>
            </motion.div>

            {/* CARD 2: Floating Activity Feed Card */}
            <motion.div 
              className="absolute bottom-[10%] right-[2%] w-[290px] rounded-2xl border border-border/80 bg-white shadow-xl p-5"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Live Activity</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-b border-muted pb-2.5">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center font-bold text-xs text-accent">SC</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">Sarah Connor</p>
                    <p className="text-[10px] text-muted-foreground">Source: LinkedIn</p>
                  </div>
                  <span className="text-[9px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded font-mono uppercase">Hot</span>
                </div>
                <div className="flex items-center gap-3 border-b border-muted pb-2.5">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-xs text-emerald-600">JB</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">James Bond</p>
                    <p className="text-[10px] text-muted-foreground">Source: Google</p>
                  </div>
                  <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono uppercase">New</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-xs text-amber-600">BW</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">Bruce Wayne</p>
                    <p className="text-[10px] text-muted-foreground">Source: Referral</p>
                  </div>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-600 px-1.5 py-0.5 rounded font-mono uppercase">Demo</span>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: Performance Score Badge */}
            <motion.div 
              className="absolute top-[52%] left-[-4%] w-[160px] rounded-2xl bg-gradient-to-br from-accent to-accent-secondary p-[1px] shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.0, ease: "easeInOut", repeat: Infinity, delay: 0.3 }}
            >
              <div className="bg-slate-900 rounded-[15px] p-4 text-center">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Conversion Rate</p>
                <h4 className="text-2xl font-sans font-bold tracking-tight text-white mt-1">82.4%</h4>
                <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                  <div className="h-full w-[82%] bg-gradient-to-r from-accent to-accent-secondary rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative bg-slate-950 border-y border-white/5 py-24 md:py-28 overflow-hidden">
      {/* dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern" />
      
      {/* Accent corner ambient glows */}
      <div className="absolute -top-[200px] -left-[200px] w-[450px] h-[450px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-[200px] -right-[200px] w-[450px] h-[450px] bg-accent-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {[
            { value: "99%", label: "Accuracy Rate" },
            { value: "2.4x", label: "Revenue Growth" },
            { value: "10k+", label: "Active Users" },
            { value: "< 1s", label: "Response Time" },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="flex flex-col items-center text-center lg:px-6 relative group"
            >
              {/* Vertical divider line for desktop */}
              {idx > 0 && (
                <div className="hidden lg:block absolute left-[-1.5rem] top-1/2 -translate-y-1/2 h-12 w-[1px] bg-white/10" />
              )}
              {/* Stat number in modern high-tech sans-serif/monospace instead of serif */}
              <span className="text-4xl md:text-5.5xl font-sans font-extrabold text-white tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent group-hover:to-accent transition-colors duration-300">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-slate-400 mt-3 font-mono uppercase tracking-[0.18em]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const [loadTime, setLoadTime] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadTime(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 15 ? 16 : next > 21 ? 20 : next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-28 md:py-32 lg:py-40 relative scroll-mt-20 bg-background">
      {/* Decorative ambient lighting circle */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(0,82,255,0.03)_0%,transparent_70%)] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <SectionLabel pulsing>Powerful Features</SectionLabel>
          <h2 className="mt-6 text-3.5xl md:text-5xl font-serif text-foreground max-w-2xl">
            Everything you need to <span className="gradient-text">scale</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-md">
            Streamlined revenue infrastructure designed to automate leads tracking and intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {[
            {
              title: "Lightning Fast Analytics",
              desc: "Built on high-performance edge infrastructure to ensure dashboard metrics load in milliseconds. Real-time updates keep your data perfectly synchronized.",
              icon: Zap,
              featured: true,
              spans: "lg:col-span-2 md:col-span-2",
              visualType: "analytics"
            },
            {
              title: "AI Predictive Insights",
              desc: "Let our advanced intelligence engine discover hidden pipeline revenue and recommend optimal next actions automatically.",
              icon: BarChart3,
              spans: "lg:col-span-1 md:col-span-1"
            },
            {
              title: "Seamless Team Sync",
              desc: "Enable real-time collaboration with your team in a sleek workspace featuring status updates, shared views, and instant lead alerts.",
              icon: Users,
              spans: "lg:col-span-1 md:col-span-1"
            },
            {
              title: "Automated Lead Workflows",
              desc: "Ditch manual tracking. Design sophisticated lead capture pipelines, automated status transitions, and real-time updates with zero coding required.",
              icon: TrendingUp,
              featured: true,
              spans: "lg:col-span-2 md:col-span-2",
              visualType: "workflows"
            }
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className={`flex ${feat.spans || ""}`}
            >
              {/* Every card has premium design. Highlighted card has gradient border, other cards have glass hover lifting */}
              <Card 
                featured={feat.featured} 
                className={`${feat.spans || "lg:col-span-1 md:col-span-1"} group relative overflow-hidden flex flex-col w-full border-border/80 hover:-translate-y-1.5 hover:shadow-accent transition-all duration-300`}
              >
                {/* Background overlay glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className={`${feat.featured ? "" : "p-8 sm:p-10"} flex flex-col sm:flex-row items-stretch justify-between gap-6 h-full w-full relative z-10`}>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white mb-6 shadow-accent transition-transform duration-300 group-hover:scale-105">
                        <feat.icon size={26} />
                      </div>
                      <h3 className="font-sans text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent duration-200">
                        {feat.title}
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                    <div className="pt-6">
                      <span className="text-xs font-semibold text-accent inline-flex items-center gap-1 hover:underline cursor-pointer">
                        Learn more <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {feat.visualType === "analytics" && (
                    <div className="hidden sm:flex flex-col justify-center items-center h-full w-[220px] shrink-0 border-l border-border/50 pl-6 my-auto select-none pointer-events-none">
                      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-xl relative overflow-hidden group/chart text-left">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Response</span>
                          <span className="text-[10px] text-accent-secondary font-semibold flex items-center gap-0.5">
                            <Zap size={10} className="fill-accent-secondary animate-pulse" /> Live
                          </span>
                        </div>
                        
                        {/* Live Load Time Counter */}
                        <div className="my-1.5 flex items-baseline gap-1">
                          <motion.span 
                            key={loadTime}
                            initial={{ opacity: 0.7, y: -2 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold font-sans tracking-tight text-white"
                          >
                            {loadTime}
                          </motion.span>
                          <span className="text-[10px] font-mono text-slate-500 font-medium">ms</span>
                        </div>

                        <div className="h-14 w-full mt-2 relative">
                          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <path 
                              d="M0 35 C 10 32, 20 15, 30 18 C 40 22, 50 8, 60 12 C 70 16, 80 4, 100 2 L 100 40 L 0 40 Z" 
                              fill="url(#featureChartGrad)" 
                            />
                            <motion.path 
                              d="M0 35 C 10 32, 20 15, 30 18 C 40 22, 50 8, 60 12 C 70 16, 80 4, 100 2" 
                              fill="none" 
                              stroke="url(#featureChartLineGrad)" 
                              strokeWidth="2" 
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            <defs>
                              <linearGradient id="featureChartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0052FF" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#0052FF" stopOpacity="0" />
                              </linearGradient>
                              <linearGradient id="featureChartLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#0052FF" />
                                <stop offset="100%" stopColor="#4D7CFF" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <motion.circle 
                            cx="100" 
                            cy="2" 
                            r="3.5" 
                            fill="#4D7CFF"
                            animate={{ r: [3.5, 5, 3.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <circle cx="100" cy="2" r="1.5" fill="#FFFFFF" />
                        </div>
                      </div>
                    </div>
                  )}

                  {feat.visualType === "workflows" && (
                    <div className="hidden sm:flex flex-col justify-center items-center h-full w-[220px] shrink-0 border-l border-border/50 pl-6 my-auto select-none pointer-events-none">
                      <div className="relative flex flex-col gap-2 w-full items-center text-left">
                        
                        {/* Node 1: Capture */}
                        <div className="w-[180px] bg-card border border-border/60 rounded-xl p-2 flex items-center gap-2 shadow-sm relative overflow-hidden">
                          <div className="h-6.5 w-6.5 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <Globe size={13} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-bold text-foreground truncate">Lead Captured</p>
                            <p className="text-[7px] text-muted-foreground font-mono">LinkedIn API • Just Now</p>
                          </div>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping absolute right-2 top-2" />
                        </div>
                        
                        {/* Path 1 -> 2 */}
                        <div className="h-4 w-[2px] bg-dashed border-l border-dashed border-accent/25 relative">
                          <motion.div 
                            className="absolute -left-[3px] h-1.5 w-1.5 rounded-full bg-accent"
                            animate={{ y: [0, 16, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>

                        {/* Node 2: AI Scoring */}
                        <div className="w-[180px] bg-card border border-border/60 rounded-xl p-2 flex items-center gap-2 shadow-sm relative overflow-hidden">
                          <div className="h-6.5 w-6.5 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                            <Sparkles size={13} className="animate-pulse" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-bold text-foreground truncate">AI Lead Scoring</p>
                            <p className="text-[7px] text-amber-600 font-semibold font-mono">Match Score: 98%</p>
                          </div>
                        </div>

                        {/* Path 2 -> 3 */}
                        <div className="h-4 w-[2px] bg-dashed border-l border-dashed border-accent/25 relative">
                          <motion.div 
                            className="absolute -left-[3px] h-1.5 w-1.5 rounded-full bg-accent-secondary"
                            animate={{ y: [0, 16, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 1.1 }}
                          />
                        </div>

                        {/* Node 3: Slack Alert */}
                        <div className="w-[180px] bg-card border border-border/60 rounded-xl p-2 flex items-center gap-2 shadow-sm relative overflow-hidden">
                          <div className="h-6.5 w-6.5 rounded bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <Bell size={13} className="animate-bounce" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-bold text-foreground truncate">Slack Alert Sent</p>
                            <p className="text-[7px] text-muted-foreground font-mono">Instant Notification</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 md:py-32 lg:py-40 bg-muted/40 border-y border-border/50 scroll-mt-20 relative">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-24">
          <SectionLabel pulsing={false}>How It Works</SectionLabel>
          <h2 className="mt-6 text-3.5xl md:text-5xl font-serif text-foreground">
            Three steps to <span className="gradient-text">success</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-md mx-auto">
            From setup to analytical breakthroughs in just a few minutes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
          {/* Dashboard Timeline step connectors with sleek gradient line */}
          <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-accent/20 via-accent-secondary/30 to-accent/20 z-0 pointer-events-none" />
          
          {/* Desktop Arrow Connectors */}
          <div className="hidden md:block absolute top-[68px] left-[33%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
            <div className="h-8 w-8 rounded-full bg-card border border-accent/25 text-accent flex items-center justify-center shadow-sm">
              <ArrowRight size={14} />
            </div>
          </div>
          <div className="hidden md:block absolute top-[68px] left-[66%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
            <div className="h-8 w-8 rounded-full bg-card border border-accent/25 text-accent flex items-center justify-center shadow-sm">
              <ArrowRight size={14} />
            </div>
          </div>
          
          {[
            { step: "01", title: "Connect Channels", desc: "Integrate your existing leads channels, email forms, or ads in a single click." },
            { step: "02", title: "AI Pipeline Analysis", desc: "Our engine automatically deduplicates, validates, and ranks your pipeline." },
            { step: "03", title: "Close Strategic Deals", desc: "Take action on smart suggestions and watch your conversion metrics surge." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="relative z-10 flex flex-col items-center group w-full"
            >
              {/* Step card component */}
              <div className="w-full bg-card border border-border/80 rounded-2xl p-8 shadow-md hover:shadow-accent hover:-translate-y-1.5 transition-all duration-300 relative group flex flex-col items-center text-center overflow-hidden">
                {/* Large translucent number inside card */}
                <span className="font-serif text-8xl absolute right-4 bottom-2 text-foreground/5 group-hover:text-accent/10 transition-colors duration-300 select-none pointer-events-none">
                  {item.step}
                </span>

                {/* Step indicator circle with hover pulse */}
                <div className="w-14 h-14 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center text-lg font-mono text-accent mb-6 group-hover:bg-gradient-to-br group-hover:from-accent group-hover:to-accent-secondary group-hover:text-white transition-all duration-300 shadow-sm relative">
                  <span className="relative z-10">{item.step}</span>
                  {/* Subtle pulsing animation ring behind the circle */}
                  <span className="absolute inset-0 rounded-full bg-accent/10 scale-100 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                
                <h3 className="text-lg font-bold font-sans tracking-tight mb-3 text-foreground group-hover:text-accent transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed px-2 relative z-10 mb-6">
                  {item.desc}
                </p>

                {/* Step Mini Visual */}
                <div className="w-full mt-auto pt-4 border-t border-border/40 flex justify-center items-center h-24 relative overflow-hidden select-none pointer-events-none">
                  {idx === 0 && (
                    <div className="flex items-center justify-center relative">
                      {/* Central Inbox Icon with gentle pulsing scale animation */}
                      <motion.div 
                        className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent relative z-10"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3.0, ease: "easeInOut", repeat: Infinity }}
                      >
                        <Inbox size={22} />
                      </motion.div>
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="w-full max-w-[180px] bg-muted/40 rounded-xl p-2.5 border border-border/40 text-left relative overflow-hidden">
                      {/* AI Scan Line Animation */}
                      <motion.div 
                        className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent to-transparent z-10"
                        animate={{ top: ["4px", "88px", "4px"] }}
                        transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
                      />
                      
                      <div className="space-y-1.5 relative z-0">
                        <div className="flex items-center justify-between text-[8px] font-semibold text-foreground border-b border-border/30 pb-1">
                          <span>Google Lead</span>
                          <span className="text-emerald-600 bg-emerald-500/10 px-1 rounded font-mono font-bold">98% Match</span>
                        </div>
                        <div className="flex items-center justify-between text-[8px] font-semibold text-foreground border-b border-border/30 pb-1">
                          <span>Referral Lead</span>
                          <span className="text-accent bg-accent/10 px-1 rounded font-mono font-bold">89% Match</span>
                        </div>
                        <div className="flex items-center justify-between text-[8px] font-semibold text-foreground/50">
                          <span>Duplicate Sync</span>
                          <span className="text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 rounded font-mono">Removed</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="flex flex-col items-center justify-center relative w-full px-4">
                      {/* Dynamic win counter */}
                      <motion.div 
                        className="bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm text-emerald-600 font-semibold text-[10px]"
                        whileHover={{ scale: 1.05 }}
                      >
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        <span>+$4,500 Win Secured</span>
                        <motion.span 
                          className="text-[9px]"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          🎉
                        </motion.span>
                      </motion.div>
                      
                      {/* Growth metrics indicator */}
                      <div className="flex items-center justify-between gap-1 w-full mt-3 px-4">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">Pipeline</span>
                        <span className="text-[10px] text-emerald-600 font-bold font-sans tracking-tight flex items-center">
                          <TrendingUp size={10} className="mr-0.5" /> +28.4%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 md:py-32 lg:py-40 relative scroll-mt-20 bg-background overflow-hidden">
      {/* Atmospheric lighting glow at bottom */}
      <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,82,255,0.04)_0%,transparent_75%)] rounded-full pointer-events-none blur-[100px]" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <SectionLabel pulsing>Testimonials</SectionLabel>
          <h2 className="mt-6 text-3.5xl md:text-5xl font-serif text-foreground">
            Loved by <span className="gradient-text">founders</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-md">
            Here is what modern businesses say about the GigFlow dashboard experience.
          </p>
        </div>
        
        {/* Testimonial cards grid. CENTER card is vertically offset on desktop. Card has "relative" to lock the absolute Quote mark! */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch pb-12">
          {[
            { 
              quote: "It completely transformed how we view our sales pipeline. Absolute game changer.", 
              name: "Sarah J.", 
              role: "VP Sales at Hyperion", 
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80" 
            },
            { 
              quote: "The AI insights found revenue we didn't even know we were missing. Easy to setup too.", 
              name: "Mike T.", 
              role: "Founder at SparkFlow", 
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80", 
              offset: true 
            },
            { 
              quote: "Finally, a dashboard that is both beautiful and actually useful for the whole team.", 
              name: "Elena R.", 
              role: "CRO at CloudPulse", 
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
            }
          ].map((test, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className={`flex ${test.offset ? "md:translate-y-8" : ""}`}
            >
              {/* NOTE: Card must have relative style to prevent the absolute Quote icon from escaping! */}
              <Card className="relative overflow-hidden flex flex-col justify-between w-full border-border/80 p-8 shadow-md hover:shadow-accent hover:-translate-y-1.5 transition-all duration-300 group">
                {/* testimonial accent bar at the top */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-accent to-accent-secondary opacity-80" />
                
                <CardHeader className="p-0 pb-6 relative z-10 text-left">
                  {/* Premium gold stars instead of flat blue stars */}
                  <div className="flex text-amber-400 gap-0.5 mb-5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor" />)}
                  </div>
                  {/* Absolute quote icon pinned perfectly inside the relative card */}
                  <Quote className="text-accent/[0.04] group-hover:text-accent/[0.09] h-[120px] w-[120px] absolute -top-8 -right-8 pointer-events-none rotate-180 transition-all duration-500 scale-100 group-hover:scale-105" />
                  
                  <CardDescription className="text-base text-foreground/90 font-medium italic leading-relaxed pt-2">
                    "{test.quote}"
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-0 pt-6 border-t border-border/55 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      className="h-10 w-10 rounded-full object-cover border border-accent/20 shadow-sm"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <p className="font-sans font-bold text-sm text-foreground">{test.name}</p>
                        {/* Verified Customer Badge */}
                        <div className="h-3.5 w-3.5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0" title="Verified Customer">
                          <Check size={9} strokeWidth={3} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{test.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you! Free trial details sent to: ${email}`);
      setEmail("");
    }
  };

  return (
    <section className="py-24 md:py-28 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="bg-slate-950 rounded-[2.5rem] p-10 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl border border-white/5"
        >
          {/* Interactive texture layers */}
          <div className="absolute inset-0 dot-pattern pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,82,255,0.25)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <SectionLabel className="border-white/20 bg-white/5 text-white/90 mb-6">Elevate Your Workflow</SectionLabel>
            <h2 className="text-3.5xl md:text-5xl font-serif text-white mb-6 leading-tight max-w-2xl">
              Ready to upgrade your revenue pipeline?
            </h2>
            <p className="text-base md:text-lg text-slate-300 mb-10 max-w-lg leading-relaxed">
              Join thousands of teams who are already building intelligence, tracking leads, and closing deals with GigFlow Dashboard.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full max-w-md gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <input 
                type="email" 
                placeholder="Enter your work email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0" 
              />
              <Button type="submit" size="lg" className="w-full sm:w-auto shrink-0 shadow-accent rounded-xl text-sm font-semibold h-11 px-5">
                Start Free Trial
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-card border-t border-border/80 pt-16 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 pb-12 border-b border-border/60">
          
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <img src={logo} alt="GigFlow Logo" className="h-8 w-8 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" />
              <span className="font-serif text-xl font-normal text-foreground tracking-tight">GigFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The AI-powered revenue infrastructure built to automate leads management, streamline analytical insights, and unlock business potential.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-200" aria-label="Twitter">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-200" aria-label="GitHub">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-200" aria-label="LinkedIn">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product links */}
          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">Product</span>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <Link to="/register" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/register" className="hover:text-foreground transition-colors">Integrations</Link>
              <Link to="/register" className="hover:text-foreground transition-colors">Changelog</Link>
            </div>
          </div>

          {/* Company links */}
          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">Company</span>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">About Us</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Careers</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Press Kit</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Trust Center</Link>
            </div>
          </div>

          {/* Resources links */}
          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">Resources</span>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Help Center</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Developer API</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Status Dashboard</Link>
              <Link to="/" className="hover:text-foreground transition-colors">Community</Link>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GigFlow Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Security Details</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
