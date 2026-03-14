'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Building2, Lock, Mail, Phone, User } from 'lucide-react';
import { supabaseBrowser } from '../../lib/supabaseClient';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (!clinicName.trim()) {
      setError('Please enter your clinic name.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          clinicName
        }
      }
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess('Account created. Please check your email to verify.');
    }

    setLoading(false);
  };

  return (
    <main>
      <section className="auth-shell signup-theme">
        <div className="auth-card">
          <div className="auth-media">
            <div className="auth-media-overlay">
              <p className="auth-brand">Dentora Cloud</p>
              <h1>Create Your Account</h1>
              <p>Bring your practice online with a secure, modern patient experience.</p>
            </div>
          </div>
          <div className="auth-content">
            <div className="auth-header">
              <p className="auth-title">Register</p>
              <p className="auth-subtitle">Start with your work email</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Work email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
              <label className="input-group">
                <span className="input-icon" aria-hidden>
                  <Building2 size={18} />
                </span>
                <input
                  type="text"
                  name="clinicName"
                  placeholder="Clinic name"
                  value={clinicName}
                  onChange={(event) => setClinicName(event.target.value)}
                />
              </label>
              {error ? <p className="auth-error">{error}</p> : null}
              {success ? <p className="auth-success">{success}</p> : null}
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? 'Please wait...' : 'Create account'}
              </button>
            </form>
            <div className="auth-footer">
              <span>Already have an account?</span>
              <Link href="/login">Login</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

