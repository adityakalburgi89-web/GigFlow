import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth as authApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { ApiResponse, AuthResponse } from '../types';
import type { AxiosResponse } from 'axios';
import { motion } from 'framer-motion';
import logo from '../assets/logo.svg';

const easeOut = [0.16, 1, 0.3, 1] as const;

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

function validate(form: RegisterForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 8) errors.password = 'Must be at least 8 characters';
  return errors;
}

export default function RegisterPage() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const res: AxiosResponse<ApiResponse<AuthResponse>> = await authApi.register(form);
      const { token: jwt, user } = res.data.data!;
      login(jwt, user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background selection:bg-accent/20">
      
      {/* Side A: Registration Form Panel */}
      <div className="flex items-center justify-center px-6 sm:px-10 lg:px-16 py-12 relative overflow-hidden">
        
        {/* Ambient decorative glowing blobs */}
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-accent-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Logo brand */}
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <img src={logo} alt="GigFlow Logo" className="h-8 w-8 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" />
            <span className="font-serif text-xl font-normal text-foreground">GigFlow</span>
          </Link>

          <div>
            <h1 className="text-3xl font-serif tracking-tight text-foreground">Get started free</h1>
            <p className="mt-2 text-sm text-muted-foreground">Build your personalized analytics dashboard in seconds</p>
          </div>

          {apiError && <Alert variant="error">{apiError}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Full Name" 
              name="name" 
              type="text" 
              placeholder="Sarah Connor" 
              value={form.name} 
              onChange={handleChange} 
              error={errors.name} 
            />

            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              placeholder="you@example.com" 
              value={form.email} 
              onChange={handleChange} 
              error={errors.email} 
            />

            <Input 
              label="Password" 
              name="password" 
              type="password" 
              placeholder="Create a secure password" 
              value={form.password} 
              onChange={handleChange} 
              error={errors.password} 
            />

            <div className="flex items-start gap-2 pt-1 text-xs text-muted-foreground select-none">
              <input type="checkbox" required className="rounded border-border text-accent focus:ring-accent h-4 w-4 bg-background mt-0.5 cursor-pointer" />
              <span>
                I agree to the{' '}
                <a href="#" className="font-medium text-accent hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="font-medium text-accent hover:underline">Privacy Policy</a>.
              </span>
            </div>

            <Button type="submit" className="w-full group py-6 shadow-accent mt-3" isLoading={isLoading}>
              Create My Free Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent hover:text-accent-secondary transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Side B: Premium Slate Showcase Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 border-l border-white/5 p-16 relative overflow-hidden">
        
        {/* dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-60" />
        
        {/* Ambient gradient lighting */}
        <div className="absolute top-1/4 right-[-100px] w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-[-100px] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Top tag */}
        <div className="relative z-10 flex items-center gap-2 text-white/50 text-xs font-mono tracking-widest uppercase">
          <Sparkles size={14} className="text-accent-secondary" />
          Award-Winning UX Infrastructure
        </div>

        {/* Center content & animated showcase widget */}
        <div className="relative z-10 my-auto py-12 flex flex-col items-center">
          
          {/* Dashboard Activity list widget */}
          <div className="relative w-[360px] h-[320px] flex items-center justify-center">
            
            {/* Background rotating rings */}
            <motion.div 
              className="absolute inset-0 rounded-full border border-dashed border-white/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            />
            <motion.div 
              className="absolute w-[260px] h-[260px] rounded-full border border-white/5"
              animate={{ rotate: 360 }}
              transition={{ duration: 45, ease: "linear", repeat: Infinity }}
            />

            {/* Pipeline list card */}
            <motion.div 
              className="w-[280px] rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl p-5 backdrop-blur-md relative"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut }}
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">Pipeline activity</span>
                <span className="flex items-center gap-1 text-[9px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-mono">
                  Live
                </span>
              </div>
              
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/15 flex items-center justify-center font-mono font-bold text-xs text-accent">L</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">LinkedIn Ad Campaign</p>
                      <span className="text-[9px] text-green-400 font-mono font-bold">+$12.4K</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full w-[70%] bg-gradient-to-r from-accent to-accent-secondary rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center font-mono font-bold text-xs text-emerald-500">G</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">Google Organic Search</p>
                      <span className="text-[9px] text-green-400 font-mono font-bold">+$8.2K</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full w-[45%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center font-mono font-bold text-xs text-amber-500">R</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">Partner Referrals</p>
                      <span className="text-[9px] text-green-400 font-mono font-bold">+$15.0K</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full w-[90%] bg-amber-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12 max-w-sm">
            <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
              Scale with <span className="gradient-text">precision</span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Create an account to build responsive grids, track customized metrics, and connect lead channels with high-fidelity analytics.
            </p>
          </div>
        </div>

        {/* Bottom footer text */}
        <div className="relative z-10 flex justify-between items-center text-xs text-slate-500">
          <span>© GigFlow Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}
