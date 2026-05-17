import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronRight,
  X,
  Home,
  Bell,
  ThumbsUp,
  CheckCircle2,
  Zap,
  Search,
  Mail,
  Clock,
  ArrowRight
} from "lucide-react";

// Support agents data
const AGENTS = [
  {
    name: "Aditya K.",
    role: "Co-Founder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
  }
];

// Predefined FAQs for home tab search & click
const FAQ_ITEMS = [
  {
    q: "How does AI lead generation work?",
    a: "GigFlow searches multiple high-value channels like LinkedIn, Google, and Twitter based on your target keywords. Our AI then automatically qualifies their intent, enriches their profiles with validated emails/phones, and ranks them in your dashboard.",
    category: "leads"
  },
  {
    q: "How accurate is the Phone/Email finder?",
    a: "Our contact scraping models boast a 99% accuracy rate. We run every email through SMTP ping tests and validate phone numbers against global telecom databases before listing them in your dashboard.",
    category: "accuracy"
  },
  {
    q: "Is there a free trial available?",
    a: "Yes! We offer a 14-day free trial on all plans. You get full access to automated lead search, predictive insights, and CRM exports. No credit card required.",
    category: "pricing"
  },
  {
    q: "Can I export leads to my CRM?",
    a: "Absolutely! You can export your leads as a standard CSV or sync them directly to your HubSpot, Salesforce, or Zoho CRM in a single click with our direct dashboard integrations.",
    category: "integration"
  }
];

// Mock release updates
const RELEASE_UPDATES = [
  {
    id: 1,
    tag: "New Feature",
    title: "AI Lead Qualification",
    date: "2 days ago",
    desc: "Qualify leads automatically using customizable prompts. Our AI analyzes their landing page copy and social media presence to rate their fit.",
    likes: 18
  },
  {
    id: 2,
    tag: "Integration",
    title: "HubSpot One-Click Sync",
    date: "1 week ago",
    desc: "Connect your HubSpot account and sync qualified leads, match scores, and custom notes automatically when status changes to 'Hot'.",
    likes: 24
  },
  {
    id: 3,
    tag: "Improvement",
    title: "99% Faster Lead Exports",
    date: "2 weeks ago",
    desc: "We upgraded our database infrastructure. Exporting large lead lists containing over 5,000 items now takes less than a single second.",
    likes: 12
  }
];

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "messages" | "updates">("home");
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [unreadBadge, setUnreadBadge] = useState(true);

  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      text: "Hi! I'm Giga, your automated support assistant. \n\nI can help you explore GigFlow, explain our lead scraping automation, or calculate your potential revenue boost. What's on your mind?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Booking Form States
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Updates Likes State
  const [updateLikes, setUpdateLikes] = useState<{ [key: number]: number }>({
    1: 18,
    2: 24,
    3: 12
  });
  const [likedUpdates, setLikedUpdates] = useState<{ [key: number]: boolean }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, activeTab]);

  // Remove badge when user first opens chatbot
  useEffect(() => {
    if (isOpen) {
      setUnreadBadge(false);
    }
  }, [isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text) return;

    // Append user message
    const userMsg: Message = {
      id: Math.random().toString(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    // Simulate realistic bot typing response
    setTimeout(() => {
      let botResponseText = "";
      const lower = text.toLowerCase();

      if (lower.includes("price") || lower.includes("cost") || lower.includes("pricing") || lower.includes("cheap") || lower.includes("plan")) {
        botResponseText = "GigFlow has three main pricing options to fit your scale:\n\n• **Starter ($29/mo)**: Search up to 500 leads/mo, basic filters, Slack alerts.\n• **Growth ($79/mo)**: Unlimited lead searches, HubSpot sync, and basic AI scoring.\n• **Pro ($149/mo)**: Advanced AI lead qualification templates, team seats, and API access.\n\nAll plans include a **14-day free trial**! No credit card is required to start. 🚀";
      } else if (lower.includes("lead") || lower.includes("scrape") || lower.includes("find") || lower.includes("get") || lower.includes("search")) {
        botResponseText = "GigFlow searches multiple high-value channels (LinkedIn, Google Maps, Twitter, and custom web crawlers) based on your target keywords. Our AI then automatically qualifies their intent, enriches their profiles with validated emails/phones, and list them in your dashboard. It saves founders over 20 hours of manual prospecting per week!";
      } else if (lower.includes("demo") || lower.includes("call") || lower.includes("book") || lower.includes("schedule")) {
        botResponseText = "I'd love to schedule a live demo with you! You can click the 'Book a call' button right on our Home tab to pick a convenient date and time in our booking calendar, or I can connect you with one of our humans! 🗓️";
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("anyone")) {
        botResponseText = "Hello! Hope you're having an awesome day. How can I assist you with your lead generation and dashboard metrics today? 😊";
      } else if (lower.includes("work") || lower.includes("how to") || lower.includes("steps")) {
        botResponseText = "GigFlow works in 3 simple steps:\n\n1. **Connect channels**: Integrate your existing lead sources or run a target search in our application.\n2. **AI Qualification**: Our models automatically check warmness and verify contact details.\n3. **Close Deals**: Trigger Slack alerts, export CSV lists, or sync straight to HubSpot CRM!";
      } else {
        botResponseText = "That's an excellent question! While I'm just an automated assistant, I want to make sure you get the best support. I've sent a priority alert to Aditya and Sarah from our team. They usually get back to you in under 5 minutes! ⚡\n\nIs there anything else I can help you with in the meantime?";
      }

      const botMsg: Message = {
        id: Math.random().toString(),
        text: botResponseText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !bookingEmail) return;

    setBookingSuccess(true);

    // Add success chat message
    setTimeout(() => {
      const confirmationMsg: Message = {
        id: Math.random().toString(),
        text: ` **Call Confirmed!**\n\nI've booked a 15-minute dashboard walkthrough for you on **${bookingDate}** at **${bookingTime}**.\n\nA calendar invite and Google Meet link have been sent to **${bookingEmail}**.\n\nWe look forward to speaking with you! 🎉`,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, confirmationMsg]);

      // Reset form states
      setBookingDate("");
      setBookingTime("");
      setBookingEmail("");
      setShowCalendar(false);
      setBookingSuccess(false);
      setActiveTab("messages");
    }, 1500);
  };

  const handleLikeUpdate = (id: number) => {
    if (likedUpdates[id]) {
      setUpdateLikes(prev => ({ ...prev, [id]: prev[id] - 1 }));
      setLikedUpdates(prev => ({ ...prev, [id]: false }));
    } else {
      setUpdateLikes(prev => ({ ...prev, [id]: prev[id] + 1 }));
      setLikedUpdates(prev => ({ ...prev, [id]: true }));
    }
  };

  const filteredFaqs = FAQ_ITEMS.filter(item =>
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-left">
      {/* CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="mb-4 w-[380px] h-[600px] max-h-[85vh] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* GRADIENT HEADER */}
            <div className="bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white p-6 relative shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close panel"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 group mb-5">
                <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-[#0052FF] font-bold shadow-md shadow-blue-600/10">
                  <Zap size={14} className="fill-[#0052FF]" />
                </div>
                <span className="font-serif text-lg font-bold tracking-tight text-white">GigFlow</span>
              </div>

              {/* OVERLAPPING AVATARS */}
              <div className="flex items-center gap-3.5 mb-2">
                <div className="flex -space-x-2">
                  {AGENTS.map((agent, i) => (
                    <img
                      key={i}
                      src={agent.avatar}
                      alt={agent.name}
                      className="h-9 w-9 rounded-full object-cover border-2 border-[#0052FF] shadow-sm"
                    />
                  ))}
                </div>
                <div className="text-xs text-white/95 font-medium flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                  Sarah & Aditya are active
                </div>
              </div>

              <h2 className="text-white text-2xl font-serif leading-tight mt-3">
                Hi <br />
                How can we help today?
              </h2>
            </div>

            {/* TAB CONTAINER AREA */}
            <div className="flex-1 overflow-y-auto min-h-0 relative">
              {/* TAB 1: HOME */}
              {activeTab === "home" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 space-y-4"
                >
                  {/* SEARCH FAQ INPUT */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search help articles..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  {searchQuery ? (
                    /* FILTERED FAQ SEARCH RESULTS */
                    <div className="bg-white dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm space-y-3">
                      <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Search Results</div>
                      {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, i) => (
                          <div key={i} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 pb-3 last:pb-0">
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{faq.q}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-2">No matching FAQs found. Click 'Ask a question' to chat with us!</p>
                      )}
                    </div>
                  ) : (
                    /* MAIN HOME WIDGET CARDS */
                    <div className="space-y-3">
                      {/* CARD 1: ASK A QUESTION */}
                      <div
                        onClick={() => setActiveTab("messages")}
                        className="bg-white dark:bg-slate-950/80 hover:bg-slate-50 dark:hover:bg-slate-950 border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#0052FF] flex items-center justify-center shadow-sm">
                            <MessageSquare size={18} />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Ask a question</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">We are here to help you live.</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                      {/* CARD 2: BOOK A CALL */}
                      <div
                        onClick={() => setShowCalendar(true)}
                        className="bg-white dark:bg-slate-950/80 hover:bg-slate-50 dark:hover:bg-slate-950 border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center shadow-sm">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Book a call</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Walkthrough custom features.</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                      {/* CARD 3: HIGHEST COVERAGE INTEL */}
                      <div className="bg-white dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/80 shadow-sm rounded-2xl p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                          <Sparkles size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Highest Search Coverage</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified mail/phone scraping infrastructure.</p>
                        </div>
                      </div>

                      {/* FAQ SECTION */}
                      <div className="pt-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 px-1">Common Questions</h4>
                        <div className="space-y-2">
                          {FAQ_ITEMS.map((faq, i) => (
                            <div
                              key={i}
                              className="bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-sm"
                            >
                              <button
                                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
                              >
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{faq.q}</span>
                                <ChevronDown
                                  size={14}
                                  className={`text-slate-400 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}
                                />
                              </button>
                              <AnimatePresence initial={false}>
                                {expandedFaq === i && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-900 pt-2 bg-slate-50/50 dark:bg-slate-950/20">
                                      {faq.a}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: ACTIVE CHAT SCREEN */}
              {activeTab === "messages" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col bg-white dark:bg-slate-950"
                >
                  {/* MESSAGE HISTORY */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          {msg.sender === "bot" ? (
                            <>
                              <div className="h-4 w-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                                G
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">Giga Bot</span>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">You</span>
                          )}
                          <span className="text-[9px] text-slate-400">• {msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm whitespace-pre-line ${msg.sender === "user"
                            ? "bg-[#0052FF] text-white rounded-tr-sm"
                            : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/30 dark:border-slate-800 rounded-tl-sm"
                            }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {/* BOT TYPING INDICATOR */}
                    {isTyping && (
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <div className="h-4 w-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                            G
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">Giga Bot is typing</span>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1">
                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* QUICK REPLIES */}
                  {messages.length === 1 && !isTyping && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-900 shrink-0 flex flex-wrap gap-1.5 justify-center">
                      <button
                        onClick={() => handleSendMessage("Tell me about GigFlow ⚡")}
                        className="text-[11px] font-medium bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 hover:border-[#0052FF] hover:text-[#0052FF] transition-all cursor-pointer shadow-sm"
                      >
                        Tell me about GigFlow ⚡
                      </button>
                      <button
                        onClick={() => handleSendMessage("How does AI lead scoring work? 🧠")}
                        className="text-[11px] font-medium bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 hover:border-[#0052FF] hover:text-[#0052FF] transition-all cursor-pointer shadow-sm"
                      >
                        AI Lead Scoring 🧠
                      </button>
                      <button
                        onClick={() => handleSendMessage("What are the pricing plans? 💰")}
                        className="text-[11px] font-medium bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 hover:border-[#0052FF] hover:text-[#0052FF] transition-all cursor-pointer shadow-sm"
                      >
                        Pricing Plans 💰
                      </button>
                    </div>
                  )}

                  {/* CHAT INPUT FORM */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="p-3 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2 shrink-0 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      disabled={isTyping}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0052FF] focus:border-[#0052FF] transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      className="h-8 w-8 rounded-xl bg-[#0052FF] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* TAB 3: UPDATES / RELEASE NOTES */}
              {activeTab === "updates" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 space-y-4"
                >
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 px-1">Product Changelog</div>

                  {RELEASE_UPDATES.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm relative overflow-hidden"
                    >
                      {/* Brand indicator tag */}
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-[#0052FF] rounded-full border border-blue-100/50 dark:border-blue-900/50">
                        {item.tag}
                      </span>

                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2.5">{item.title}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 mb-2">
                        <Clock size={11} />
                        <span>Released {item.date}</span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-900/50 pt-2">
                        {item.desc}
                      </p>

                      {/* LIKES & FEEDBACK */}
                      <div className="mt-3.5 pt-2 border-t border-slate-50 dark:border-slate-900/50 flex items-center justify-between">
                        <button
                          onClick={() => handleLikeUpdate(item.id)}
                          className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all border ${likedUpdates[item.id]
                            ? "bg-blue-500 text-white border-blue-600"
                            : "bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-slate-800"
                            }`}
                        >
                          <ThumbsUp size={11} className={likedUpdates[item.id] ? "fill-white" : ""} />
                          <span>{likedUpdates[item.id] ? "Liked!" : "Love this"} ({updateLikes[item.id]})</span>
                        </button>

                        <span className="text-[10px] text-slate-400">By Sarah Connor</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* BOTTOM NAV BAR */}
            <div className="bg-white/95 dark:bg-slate-950/95 border-t border-slate-200/60 dark:border-slate-800/80 backdrop-blur px-6 py-2.5 flex justify-around items-center shrink-0">
              <button
                onClick={() => {
                  setActiveTab("home");
                  setShowCalendar(false);
                }}
                className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${activeTab === "home" && !showCalendar
                  ? "text-[#0052FF]"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
              >
                <Home size={18} className={activeTab === "home" && !showCalendar ? "stroke-[2.5px]" : ""} />
                Home
              </button>

              <button
                onClick={() => {
                  setActiveTab("messages");
                  setShowCalendar(false);
                }}
                className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${activeTab === "messages" && !showCalendar
                  ? "text-[#0052FF]"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
              >
                <MessageSquare size={18} className={activeTab === "messages" && !showCalendar ? "stroke-[2.5px]" : ""} />
                Messages
              </button>

              <button
                onClick={() => {
                  setActiveTab("updates");
                  setShowCalendar(false);
                }}
                className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${activeTab === "updates" && !showCalendar
                  ? "text-[#0052FF]"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
              >
                <Bell size={18} className={activeTab === "updates" && !showCalendar ? "stroke-[2.5px]" : ""} />
                Updates
              </button>
            </div>

            {/* MODAL POPUP: CALENDAR/SCHEDULER OVERLAY */}
            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute inset-0 bg-white dark:bg-slate-950 z-30 flex flex-col p-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-indigo-500" size={18} />
                      <span className="font-serif text-sm font-bold text-slate-800 dark:text-slate-100">Schedule Quick Call</span>
                    </div>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {bookingSuccess ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-4 animate-bounce">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Processing Schedule...</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-[220px]">Saving your slot and sending calendar invitations...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="flex-1 flex flex-col min-h-0 space-y-4">
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {/* SELECT DATE */}
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">1. Pick a Date</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Mon, May 18", "Tue, May 19", "Wed, May 20"].map((date) => (
                              <button
                                key={date}
                                type="button"
                                onClick={() => setBookingDate(date)}
                                className={`text-[11px] font-medium py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${bookingDate === date
                                  ? "bg-[#0052FF] text-white border-blue-600 shadow-sm"
                                  : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                                  }`}
                              >
                                {date}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* SELECT TIME */}
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">2. Select Time (15-min walkthrough)</label>
                          <div className="grid grid-cols-2 gap-2">
                            {["10:00 AM", "1:30 PM", "3:00 PM", "4:30 PM"].map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setBookingTime(time)}
                                className={`text-[11px] font-medium py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${bookingTime === time
                                  ? "bg-indigo-600 text-white border-indigo-700 shadow-sm"
                                  : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                                  }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* EMAIL INPUT */}
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">3. Invite Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                              type="email"
                              required
                              placeholder="you@company.com"
                              value={bookingEmail}
                              onChange={e => setBookingEmail(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!bookingDate || !bookingTime || !bookingEmail}
                        className="w-full bg-[#0052FF] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/10 hover:scale-[1.01]"
                      >
                        Confirm Booking <ArrowRight size={13} />
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all ${isOpen
          ? "bg-[#0052FF] shadow-blue-500/25"
          : "bg-[#0052FF] shadow-accent-lg"
          }`}
        aria-label="Toggle support chatbot"
      >
        {isOpen ? (
          <ChevronDown size={24} className="animate-pulse" />
        ) : (
          <div className="relative">
            <MessageSquare size={22} className="stroke-[2.2]" />
            {unreadBadge && (
              <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-red-500 border-2 border-[#0052FF] rounded-full animate-pulse" />
            )}
          </div>
        )}
      </button>
    </div>
  );
}
