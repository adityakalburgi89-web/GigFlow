import { motion } from "framer-motion";
import { ArrowRight, Zap, BarChart3, Users, Star, Quote, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/Card";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Input } from "../components/ui/Input";
import { Link } from "react-router-dom";

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
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary shadow-accent transition-transform duration-300 group-hover:scale-105" />
          <span className="font-serif text-xl font-bold text-foreground tracking-tight">GigFlow</span>
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
    <section className="relative overflow-hidden pt-28 pb-24 md:py-32 lg:py-44">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,82,255,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
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
              className="mt-6 text-[2.75rem] md:text-6xl lg:text-[5.25rem] font-serif leading-[1.05] tracking-[-0.02em] text-foreground"
            >
              Turn Data Into <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="gradient-text">Revenue</span>
                <span className="gradient-underline" />
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mt-8 text-lg md:text-xl text-muted-foreground leading-[1.75] max-w-2xl"
            >
              The most powerful, AI-driven platform for managing leads, tracking metrics, and scaling your business with minimal effort.
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
          
          <div className="hidden lg:block relative h-[600px] w-full">
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-2 border-dashed border-accent/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            />
            <motion.div 
              className="absolute top-[20%] left-[10%] w-[250px] h-[300px] rounded-2xl bg-gradient-to-br from-accent to-accent-secondary p-1 shadow-accent-lg"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            >
              <div className="w-full h-full rounded-[14px] bg-card opacity-90 backdrop-blur" />
            </motion.div>
            <motion.div 
              className="absolute bottom-[20%] right-[10%] w-[280px] h-[200px] rounded-2xl bg-white border border-border shadow-xl p-6"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 1 }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 mb-4 flex items-center justify-center">
                <BarChart3 className="text-accent" />
              </div>
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative bg-foreground text-background py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '32px 32px' }} />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 divide-x-0 lg:divide-x divide-white/10">
          {[
            { value: "99%", label: "Accuracy" },
            { value: "2.4x", label: "Revenue Growth" },
            { value: "10k+", label: "Active Users" },
            { value: "< 1s", label: "Query Time" },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="flex flex-col items-center text-center lg:px-6"
            >
              <span className="text-4xl md:text-5xl font-serif text-white">{stat.value}</span>
              <span className="text-sm md:text-base text-muted-foreground mt-2 font-mono uppercase tracking-widest">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-28 md:py-32 lg:py-44 relative scroll-mt-20">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <SectionLabel>Powerful Features</SectionLabel>
          <h2 className="mt-6 text-3xl md:text-5xl font-serif text-foreground max-w-2xl">
            Everything you need to <span className="gradient-text">scale</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              title: "Lightning Fast",
              desc: "Built on modern edge infrastructure to ensure your queries return in milliseconds.",
              icon: Zap,
              featured: true
            },
            {
              title: "AI Insights",
              desc: "Let our machine learning models uncover hidden patterns in your sales data.",
              icon: BarChart3
            },
            {
              title: "Team Collaboration",
              desc: "Work seamlessly with your entire revenue team in real-time.",
              icon: Users
            }
          ].map((feat, idx) => (
            <Card key={idx} featured={feat.featured} className="group">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white mb-4 shadow-accent">
                  <feat.icon size={28} />
                </div>
                <CardTitle>{feat.title}</CardTitle>
                <CardDescription className="mt-2">{feat.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 md:py-32 lg:py-44 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="mt-6 text-3xl md:text-5xl font-serif text-foreground">
            Three steps to <span className="gradient-text">success</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-border z-0" />
          
          {[
            { step: "01", title: "Connect Data", desc: "Integrate your existing CRMs and data sources in one click." },
            { step: "02", title: "AI Analysis", desc: "Our engine automatically cleans and analyzes your leads." },
            { step: "03", title: "Close Deals", desc: "Actionable insights delivered straight to your team." }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-card border-2 border-border shadow-md flex items-center justify-center text-3xl font-serif text-accent mb-6">
                {item.step}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 md:py-32 lg:py-44 relative scroll-mt-20">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="mt-6 text-3xl md:text-5xl font-serif text-foreground">
            Loved by <span className="gradient-text">founders</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {[
            { quote: "It completely transformed how we view our sales pipeline. Absolute game changer.", name: "Sarah J.", role: "VP Sales" },
            { quote: "The AI insights found revenue we didn't even know we were missing. Easy to setup too.", name: "Mike T.", role: "Founder", offset: true },
            { quote: "Finally, a dashboard that is both beautiful and actually useful for the whole team.", name: "Elena R.", role: "CRO" }
          ].map((test, idx) => (
            <Card key={idx} className={test.offset ? "md:translate-y-8" : ""}>
              <CardHeader>
                <div className="flex text-accent mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <Quote className="text-muted-foreground/20 h-12 w-12 absolute top-6 right-6" />
                <CardDescription className="text-lg text-foreground italic relative z-10">
                  "{test.quote}"
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div>
                  <p className="font-semibold">{test.name}</p>
                  <p className="text-sm text-muted-foreground">{test.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-foreground rounded-[3rem] p-10 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,82,255,0.2)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
              Ready to upgrade your workflow?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-xl">
              Join thousands of teams who are already closing more deals with GigFlow Dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row w-full max-w-md gap-4">
              <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white" />
              <Button size="lg" className="w-full sm:w-auto shrink-0 shadow-accent">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
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
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary shadow-accent transition-transform duration-300 group-hover:scale-105" />
              <span className="font-serif text-xl font-bold text-foreground tracking-tight">GigFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The AI-powered revenue infrastructure built to automate leads management, streamline analytical insights, and unlock business potential.
            </p>
            <div className="flex gap-4.5 mt-2">
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
