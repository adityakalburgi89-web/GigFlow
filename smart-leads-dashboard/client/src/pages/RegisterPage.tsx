import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth as authApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { ArrowRight } from 'lucide-react';
import type { ApiResponse, AuthResponse } from '../types';
import type { AxiosResponse } from 'axios';

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary shadow-accent" />
          <span className="font-serif text-xl font-bold text-foreground">GigFlow</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif text-foreground">Create an account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Get started with GigFlow</p>
          </div>

          {apiError && <Alert variant="error" className="mb-4">{apiError}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} error={errors.name} />
            <Input label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Password" name="password" type="password" placeholder="At least 8 characters" value={form.password} onChange={handleChange} error={errors.password} />
            <Button type="submit" className="w-full group" isLoading={isLoading}>
              Create account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:text-accent-secondary transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
