import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth as authApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { ArrowRight, Sparkles, TrendingUp, Key, Check, X, Lock } from 'lucide-react';
import type { ApiResponse, AuthResponse } from '../types';
import type { AxiosResponse } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.svg';

const easeOut = [0.16, 1, 0.3, 1] as const;

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function validate(form: LoginForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
  if (!form.password) errors.password = 'Password is required';
  return errors;
}

export default function LoginPage() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ─ Forgot password modal
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<'email' | 'password' | 'done'>('email');
  const [fpEmail, setFpEmail] = useState('');
  const [fpPassword, setFpPassword] = useState('');
  const [fpConfirm, setFpConfirm] = useState('');
  const [fpError, setFpError] = useState('');
  const [fpLoading, setFpLoading] = useState(false);

  const openModal = () => { setModalOpen(true); setStep('email'); setFpEmail(''); setFpPassword(''); setFpConfirm(''); setFpError(''); };
  const closeModal = () => { setModalOpen(false); };

  if (token) return <Navigate to="/dashboard" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsLoading(true);
    try {
      const res: AxiosResponse<ApiResponse<AuthResponse>> = await authApi.login(form);
      const { token: jwt, user } = res.data.data!;
      login(jwt, user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFpError('');
    if (!fpEmail) { setFpError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail)) { setFpError('Enter a valid email'); return; }
    setStep('password');
  };

  const handlePasswordStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpError('');
    if (!fpPassword) { setFpError('Password is required'); return; }
    if (fpPassword.length < 6) { setFpError('At least 6 characters'); return; }
    if (fpPassword !== fpConfirm) { setFpError('Passwords do not match'); return; }
    setFpLoading(true);
    try {
      await authApi.simpleResetPassword({ email: fpEmail, newPassword: fpPassword });
      setStep('done');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; code?: string; message?: string };
      let msg = 'Something went wrong. Please try again.';
      if (axiosErr.code === 'ERR_NETWORK' || axiosErr.code === 'ECONNREFUSED' || !axiosErr.response) {
        msg = 'Cannot connect to server. Please try again in a moment.';
      } else if (axiosErr.response?.data?.message) {
        msg = axiosErr.response.data.message;
      }
      setFpError(msg);
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background selection:bg-accent/20">

      {/* Side A: Form Panel */}
      <div className="flex items-center justify-center px-6 sm:px-10 lg:px-16 py-12 relative overflow-hidden lg:order-last">

        {/* Soft atmospheric background glows */}
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-accent-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">

          {/* Logo brand */}
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <img src={logo} alt="GigFlow Logo" className="h-8 w-8 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" />
            <span className="font-serif text-xl font-normal text-foreground">GigFlow</span>
          </Link>

          <div>
            <h1 className="text-3xl font-serif tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to unlock your custom leads dashboard</p>
          </div>

          {apiError && <Alert variant="error">{apiError}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground select-none">
                <input type="checkbox" className="rounded border-border text-accent focus:ring-accent h-4 w-4 bg-background" />
                Remember me
              </label>
              <button
                type="button"
                onClick={openModal}
                className="font-medium text-accent hover:text-accent-secondary transition-colors focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full group py-6 shadow-accent mt-2" isLoading={isLoading}>
              Sign In to GigFlow
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-accent hover:text-accent-secondary transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Side B: Dark Premium Showcase Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 border-r border-white/5 p-16 relative overflow-hidden lg:order-first">

        {/* dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-60" />

        {/* Luxurious ambient glows */}
        <div className="absolute top-1/4 right-[-100px] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-[-100px] w-[400px] h-[400px] bg-accent-secondary/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Top brand accent */}
        <div className="relative z-10 flex items-center gap-2 text-white/50 text-xs font-mono tracking-widest uppercase">
          <Sparkles size={14} className="text-accent" />
          High-Performance SaaS Platform
        </div>

        {/* Center graphics elements */}
        <div className="relative z-10 my-auto py-12 flex flex-col items-center">

          {/* Animated decorative spinning ring */}
          <div className="relative w-[360px] h-[360px] flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 50, ease: "linear", repeat: Infinity }}
            />
            <motion.div
              className="absolute w-[280px] h-[280px] rounded-full border border-white/5"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            />

            {/* Inner Dashboard Widget */}
            <motion.div
              className="w-[260px] rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl p-5 backdrop-blur-md relative"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">Conversion Rate</span>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-mono font-bold">+18.5%</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-white tracking-tight">85.4%</span>
                <span className="text-xs text-slate-400 font-mono">/ target 80%</span>
              </div>

              {/* Mini flexbar chart in absolute CSS */}
              <div className="flex items-end justify-between gap-1.5 h-16 mt-4 pb-1">
                {[45, 60, 52, 70, 64, 82, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-800 rounded-t overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-t ${i === 6 ? 'bg-gradient-to-t from-accent to-accent-secondary' : 'bg-slate-700'}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/5 text-[9px] text-slate-400 font-medium font-mono">
                <TrendingUp size={11} className="text-accent" />
                Live campaign performance analytics
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12 max-w-md">
            <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
              Turn leads into <span className="gradient-text">revenue</span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Login to experience the next generation of sales intelligence. Track conversion curves, analyze live data nodes, and scale effortlessly.
            </p>
          </div>
        </div>

        {/* Footer brand info */}
        <div className="relative z-10 flex justify-between items-center text-xs text-slate-500">
          <span>© GigFlow Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
      {/* ═══ FORGOT PASSWORD MODAL ═══ */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 360 }}
              className="w-full max-w-md bg-background border border-border rounded-3xl p-8 shadow-2xl relative z-10"
            >
              <button onClick={closeModal} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" aria-label="Close">
                <X size={18} />
              </button>

              {/* STEP 1: Email */}
              {step === 'email' && (
                <form onSubmit={handleEmailStep} className="space-y-6">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                      <Key size={22} />
                    </div>
                    <h2 className="text-2xl font-serif tracking-tight text-foreground">Forgot Password?</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Enter your registered email to continue.</p>
                  </div>
                  <Input label="Email Address" type="email" placeholder="you@example.com" value={fpEmail}
                    onChange={(e) => { setFpEmail(e.target.value); setFpError(''); }} error={fpError} required />
                  <div className="flex gap-3">
                    <button type="button" onClick={closeModal} className="w-1/3 py-3 border border-border hover:bg-muted text-sm font-semibold rounded-xl text-foreground transition-all focus:outline-none">Cancel</button>
                    <Button type="submit" className="w-2/3 py-3 shadow-accent text-sm">Continue</Button>
                  </div>
                </form>
              )}

              {/* STEP 2: New Password */}
              {step === 'password' && (
                <form onSubmit={handlePasswordStep} className="space-y-6">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                      <Lock size={22} />
                    </div>
                    <h2 className="text-2xl font-serif tracking-tight text-foreground">Set New Password</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Choose a new password for <strong className="text-foreground">{fpEmail}</strong></p>
                  </div>
                  {fpError && <p className="text-sm text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">{fpError}</p>}
                  <Input label="New Password" type="password" placeholder="••••••••" value={fpPassword}
                    onChange={(e) => { setFpPassword(e.target.value); setFpError(''); }} required />
                  <Input label="Confirm Password" type="password" placeholder="••••••••" value={fpConfirm}
                    onChange={(e) => { setFpConfirm(e.target.value); setFpError(''); }} required />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setStep('email'); setFpError(''); }} className="w-1/3 py-3 border border-border hover:bg-muted text-sm font-semibold rounded-xl text-foreground transition-all focus:outline-none">Back</button>
                    <Button type="submit" className="w-2/3 py-3 shadow-accent text-sm" isLoading={fpLoading}>Update Password</Button>
                  </div>
                </form>
              )}

              {/* STEP 3: Success */}
              {step === 'done' && (
                <div className="text-center space-y-5 py-2">
                  <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto">
                    <Check size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif tracking-tight text-foreground">Password Updated!</h2>
                    <p className="mt-2 text-sm text-muted-foreground">You can now sign in with your new password.</p>
                  </div>
                  <Button onClick={closeModal} className="w-full py-3 shadow-accent text-sm">Back to Sign In</Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
