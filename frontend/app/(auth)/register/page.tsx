'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Brain, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard 🚀');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(245,197,24,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'var(--gradient-primary)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 0 30px rgba(245,197,24,0.3)',
          }}>
            <Brain size={28} color="#0d0f14" />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--color-text)', marginBottom: 6 }}>
            Start your journey
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
            Create a free account to learn AI/ML interactively
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Input id="name" label="Full name" placeholder="Jane Doe" value={form.name}
              onChange={set('name')} error={errors.name} icon={<User size={16} />} />
            <Input id="email" type="email" label="Email address" placeholder="you@example.com"
              value={form.email} onChange={set('email')} error={errors.email} icon={<Mail size={16} />} />
            <Input id="password" type="password" label="Password" placeholder="Min 6 characters"
              value={form.password} onChange={set('password')} error={errors.password} icon={<Lock size={16} />} />
            <Input id="confirm" type="password" label="Confirm password" placeholder="Repeat password"
              value={form.confirm} onChange={set('confirm')} error={errors.confirm} icon={<Lock size={16} />} />
            <Button type="submit" loading={isLoading} size="lg" className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
