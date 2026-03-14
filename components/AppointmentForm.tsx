'use client';

import { useMemo, useState } from 'react';
import { supabaseBrowser } from '../lib/supabaseClient';
import { Button } from './Button';

const defaultFormState = {
  name: '',
  email: '',
  phone: '',
  date: '',
  location: 'Downtown Clinic',
  message: ''
};

export function AppointmentForm() {
  const [formState, setFormState] = useState(defaultFormState);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const supabase = useMemo(() => supabaseBrowser(), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!formState.name || !formState.email || !formState.phone || !formState.date) {
      setFormStatus('error');
      setFormError('Please complete all required fields.');
      return;
    }

    setFormStatus('loading');

    const { error } = await supabase.from('appointments').insert({
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      preferred_date: formState.date,
      location: formState.location,
      notes: formState.message
    });

    if (error) {
      setFormStatus('error');
      setFormError('Unable to submit. Please check Supabase settings or try again.');
      return;
    }

    setFormStatus('success');
    setFormState(defaultFormState);
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Full Name *</label>
        <input id="name" name="name" value={formState.name} onChange={handleChange} placeholder="Jane Cooper" />
      </div>
      <div className="field">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          placeholder="jane@clinic.com"
        />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone *</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formState.phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
        />
      </div>
      <div className="field">
        <label htmlFor="date">Preferred Date *</label>
        <input id="date" name="date" type="date" value={formState.date} onChange={handleChange} />
      </div>
      <div className="field">
        <label htmlFor="location">Location</label>
        <select id="location" name="location" value={formState.location} onChange={handleChange}>
          <option>Downtown Clinic</option>
          <option>Waterfront Clinic</option>
          <option>Northside Clinic</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Notes</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formState.message}
          onChange={handleChange}
          placeholder="Tell us about your practice or patient needs."
        />
      </div>
      {formStatus === 'error' ? <p className="form-error">{formError}</p> : null}
      {formStatus === 'success' ? <p className="form-success">Thanks! Your request is confirmed.</p> : null}
      <Button type="submit" disabled={formStatus === 'loading'}>
        {formStatus === 'loading' ? 'Submitting...' : 'Submit Appointment'}
      </Button>
    </form>
  );
}
