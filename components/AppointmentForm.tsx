'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { CalendarDays, Clock3, FileText, ShieldCheck, Stethoscope } from 'lucide-react';
import { gsap } from 'gsap';
import { supabaseBrowser } from '../lib/supabaseClient';
import { Button } from './Button';

const slotOptions = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM'
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const defaultDoctorId = 'doctor-general';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UpcomingAppointment = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  status: string;
  notes: string;
};

const guestAppointmentsStorageKey = 'guest-appointments';

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatLongDate = (value: string) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function Calendar({
  selectedDate,
  onSelect
}: {
  selectedDate: string;
  onSelect: (value: string) => void;
}) {
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate);
    }
    return new Date();
  });

  useEffect(() => {
    if (selectedDate) {
      setViewDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const monthEnd = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const leading = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const selected = selectedDate ? new Date(selectedDate) : null;

  const cells = Array.from({ length: leading + daysInMonth }, (_, index) => {
    if (index < leading) return null;
    const day = index - leading + 1;
    return new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
  });

  return (
    <div className="booking-calendar appointment-section" aria-label="Appointment calendar">
      <div className="booking-calendar-header">
        <div>
          <p className="section-kicker">Calendar</p>
          <h3>{viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
        </div>
        <div className="booking-calendar-nav">
          <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
            {'<'}
          </button>
          <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
            {'>'}
          </button>
        </div>
      </div>
      <div className="booking-weekdays">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="booking-days-grid">
        {cells.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="booking-empty-day" />;
          }

          const isPast = date < today;
          const isSelected = selected ? isSameDay(date, selected) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              className={`booking-day${isSelected ? ' is-selected' : ''}${isPast ? ' is-disabled' : ''}${
                isToday ? ' is-today' : ''
              }`}
              disabled={isPast}
              onClick={() => onSelect(toIsoDate(date))}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AppointmentForm() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [selectedDate, setSelectedDate] = useState(() => toIsoDate(new Date()));
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [guestAppointments, setGuestAppointments] = useState<UpcomingAppointment[]>([]);
  const [patientId, setPatientId] = useState('');
  const [doctorId] = useState(defaultDoctorId);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const bookingQueriesUnavailable = useRef(false);
  const upcomingQueriesUnavailable = useRef(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  const visibleAppointments = isAuthenticated ? upcomingAppointments : guestAppointments;

  const syncSlotState = (nextBookedSlots: string[]) => {
    setBookedSlots(nextBookedSlots);
    setSelectedTime((current) => {
      if (current && !nextBookedSlots.includes(current)) {
        return current;
      }

      return slotOptions.find((slot) => !nextBookedSlots.includes(slot)) || '';
    });
  };

  const loadBookedSlots = async (date: string) => {
    setLoadingSlots(true);
    setError('');

    if (!isAuthenticated || bookingQueriesUnavailable.current) {
      syncSlotState([]);
      setLoadingSlots(false);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from('appointments')
        .select('appointment_time,status')
        .eq('appointment_date', date)
        .neq('status', 'cancelled');

      if (queryError) {
        throw queryError;
      }

      syncSlotState((data ?? []).map((item) => item.appointment_time).filter(Boolean));
    } catch {
      try {
        const { data: legacyData, error: legacyError } = await supabase.from('appointments').select('time').eq('date', date);

        if (legacyError) {
          throw legacyError;
        }

        syncSlotState((legacyData ?? []).map((item) => item.time).filter(Boolean));
      } catch {
        bookingQueriesUnavailable.current = true;
        syncSlotState([]);
      }
    } finally {
      setLoadingSlots(false);
    }
  };

  const persistGuestAppointments = (items: UpcomingAppointment[]) => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(guestAppointmentsStorageKey, JSON.stringify(items));
  };

  const loadGuestAppointments = () => {
    if (typeof window === 'undefined') return;

    const stored = window.sessionStorage.getItem(guestAppointmentsStorageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as UpcomingAppointment[];
      if (Array.isArray(parsed)) {
        setGuestAppointments(parsed);
      }
    } catch {
      window.sessionStorage.removeItem(guestAppointmentsStorageKey);
    }
  };

  const addGuestAppointment = (item: UpcomingAppointment) => {
    setGuestAppointments((current) => {
      const nextAppointments = [item, ...current].slice(0, 4);
      persistGuestAppointments(nextAppointments);
      return nextAppointments;
    });
  };

  const loadUpcomingAppointments = async (userId: string) => {
    if (upcomingQueriesUnavailable.current) {
      setUpcomingAppointments([]);
      return;
    }

    try {
      const today = toIsoDate(new Date());
      const { data, error: queryError } = await supabase
        .from('appointments')
        .select('id,appointment_date,appointment_time,doctor_id,status,notes')
        .eq('user_id', userId)
        .gte('appointment_date', today)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(4);

      if (queryError) {
        throw queryError;
      }

      setUpcomingAppointments(
        (data ?? []).map((item) => ({
          id: item.id,
          date: item.appointment_date,
          time: item.appointment_time,
          doctor: item.doctor_id || 'General dentist',
          status: item.status || 'scheduled',
          notes: item.notes || ''
        }))
      );
    } catch {
      try {
        const today = toIsoDate(new Date());
        const { data: legacyData, error: legacyError } = await supabase
          .from('appointments')
          .select('id,date,time,provider')
          .eq('user_id', userId)
          .gte('date', today)
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .limit(4);

        if (legacyError) {
          throw legacyError;
        }

        setUpcomingAppointments(
          (legacyData ?? []).map((item) => ({
            id: item.id,
            date: item.date,
            time: item.time,
            doctor: item.provider || 'General dentist',
            status: 'scheduled',
            notes: ''
          }))
        );
      } catch {
        upcomingQueriesUnavailable.current = true;
        setUpcomingAppointments([]);
      }
    }
  };

  useEffect(() => {
    loadGuestAppointments();

    const bootstrap = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setPatientId('');
        setUpcomingAppointments([]);
        return;
      }

      setIsAuthenticated(true);
      setEmail(user.email ?? '');

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('patient_id,full_name,email,phone')
          .eq('user_id', user.id)
          .maybeSingle();

        setPatientId(profile?.patient_id || user.id);
        setFullName(profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '');
        setEmail(profile?.email || user.email || '');
        setPhone(profile?.phone || '');
      } catch {
        setPatientId(user.id);
        setFullName((user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || '');
      }

      await loadUpcomingAppointments(user.id);
    };

    bootstrap();
  }, [supabase]);

  useEffect(() => {
    if (!formRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.appointment-section',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    loadBookedSlots(selectedDate);
  }, [isAuthenticated, selectedDate]);

  useEffect(() => {
    if (!selectedDate || selectedTime) return;
    setSelectedTime(slotOptions.find((slot) => !bookedSlots.includes(slot)) || '');
  }, [bookedSlots, selectedDate, selectedTime]);

  const validateBooking = () => {
    if (!selectedDate || !selectedTime) {
      return 'Please select a date and an available time slot.';
    }

    if (!fullName.trim()) {
      return 'Please enter your full name.';
    }

    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (!phone.trim()) {
      return 'Please enter your phone number.';
    }

    return '';
  };

  const handleBooking = async () => {
    setError('');
    setSuccess('');

    const validationError = validateBooking();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      setIsAuthenticated(true);
    }

    const authPayload = {
      user_id: user?.id,
      patient_id: patientId || user?.id || null,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      doctor_id: doctorId,
      status: 'scheduled',
      notes,
      date: selectedDate,
      time: selectedTime,
      type: 'Dental consultation',
      provider: 'General dentist'
    };

    const publicPayload = {
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      preferred_date: selectedDate,
      location: 'Main clinic',
      notes: [selectedTime, notes.trim()].filter(Boolean).join(' | ')
    };

    let bookingSaved = false;

    if (user) {
      const { error: insertError } = await supabase.from('appointments').insert(authPayload);
      bookingSaved = !insertError;

      if (!bookingSaved) {
        const { error: fallbackAuthError } = await supabase.from('appointments').insert({
          user_id: user.id,
          date: selectedDate,
          time: selectedTime,
          type: 'Dental consultation',
          provider: 'General dentist'
        });

        bookingSaved = !fallbackAuthError;
      }
    }

    if (!bookingSaved) {
      const { error: publicInsertError } = await supabase.from('appointments').insert(publicPayload);
      bookingSaved = !publicInsertError;
    }

    if (!bookingSaved) {
      setError('Unable to book the appointment. Please check your details and try again.');
      setSubmitting(false);
      return;
    }

    setSuccess(`Appointment booked for ${formatLongDate(selectedDate)} at ${selectedTime}.`);

    const bookedAppointment: UpcomingAppointment = {
      id: `local-${Date.now()}`,
      date: selectedDate,
      time: selectedTime,
      doctor: 'General dentist',
      status: 'scheduled',
      notes: notes.trim() || 'No notes added'
    };

    setNotes('');
    syncSlotState([...bookedSlots, selectedTime]);

    if (user) {
      await loadBookedSlots(selectedDate);
      await loadUpcomingAppointments(user.id);
    } else {
      addGuestAppointment(bookedAppointment);
    }

    setSubmitting(false);
  };

  return (
    <div ref={formRef} className="appointment-booking-shell">
      <section className="appointment-hero-card appointment-section">
        <div>
          <p className="section-kicker">Secure booking</p>
          <h3>Reserve a confirmed dental slot</h3>
          <p>
            Choose a slot, add your contact details, and save the appointment instantly from this booking page.
          </p>
        </div>
        <div className="appointment-hero-grid">
          <article>
            <CalendarDays size={18} />
            <strong>Interactive calendar</strong>
            <span>Choose an exact appointment day.</span>
          </article>
          <article>
            <Clock3 size={18} />
            <strong>Live slot status</strong>
            <span>Booked times are automatically disabled when live data is available.</span>
          </article>
          <article>
            <ShieldCheck size={18} />
            <strong>Fast confirmation</strong>
            <span>Save the booking directly with your contact information.</span>
          </article>
          <article>
            <FileText size={18} />
            <strong>Notes included</strong>
            <span>Add booking context for the care team.</span>
          </article>
        </div>
      </section>



      <section className="appointment-layout appointment-section">
        <div className="appointment-calendar-panel">
          <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
        </div>

        <div className="appointment-slots-panel">
          <div className="slots-panel-head">
            <div>
              <p className="section-kicker">Available times</p>
              <h3>{selectedDate ? formatLongDate(selectedDate) : 'Select a date'}</h3>
            </div>
            <div className="doctor-chip">
              <Stethoscope size={16} />
              General dentist
            </div>
          </div>

          <div className="slot-grid-panel">
            {selectedDate ? (
              slotOptions.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-card${isSelected ? ' is-selected' : ''}${isBooked ? ' is-disabled' : ''}`}
                    disabled={isBooked || loadingSlots}
                    onClick={() => setSelectedTime(slot)}
                  >
                    <span>{slot}</span>
                    <small>{isBooked ? 'Booked' : 'Available'}</small>
                  </button>
                );
              })
            ) : (
              <div className="slot-empty-state">
                <Clock3 size={22} />
                <p>Select a date from the calendar to see available booking slots.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="appointment-confirmation appointment-section">
        <div className="appointment-confirm-card">
          <div className="confirm-copy">
            <p className="section-kicker">Confirmation</p>
            <h3>Review and confirm your appointment</h3>
            <div className="confirm-grid">
              <div>
                <strong>Date</strong>
                <span>{selectedDate ? formatLongDate(selectedDate) : 'Not selected'}</span>
              </div>
              <div>
                <strong>Time</strong>
                <span>{selectedTime || 'Not selected'}</span>
              </div>
              <div>
                <strong>Doctor</strong>
                <span>General dentist</span>
              </div>
              <div>
                <strong>Status</strong>
                <span>Will be saved as scheduled</span>
              </div>
            </div>
          </div>
          <div className="confirm-actions">
            <div className="appointment-contact-grid">
              <label className="field" htmlFor="appointment-name">
                <span>Full name</span>
                <input
                  id="appointment-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                />
              </label>
              <label className="field" htmlFor="appointment-email">
                <span>Email</span>
                <input
                  id="appointment-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@clinic.com"
                />
              </label>
              <label className="field" htmlFor="appointment-phone">
                <span>Phone</span>
                <input
                  id="appointment-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your phone number"
                />
              </label>
            </div>
            <label className="field appointment-notes-field" htmlFor="appointment-notes">
              <span>Notes</span>
              <textarea
                id="appointment-notes"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add treatment concerns or booking notes for the dentist."
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            {success ? <p className="form-success">{success}</p> : null}
            <Button type="button" onClick={handleBooking} disabled={submitting || !selectedDate || !selectedTime}>
              {submitting ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </div>
      </section>

      <section className="appointment-upcoming appointment-section">
        <div className="card appointment-upcoming-card">
          <div className="card-head">
            <div>
              <p className="section-kicker">Upcoming</p>
              <h3>Your booked appointments</h3>
            </div>
          </div>
          {visibleAppointments.length ? (
            <div className="appointment-upcoming-list">
              {visibleAppointments.map((item) => (
                <article key={item.id} className="appointment-upcoming-item">
                  <div>
                    <strong>{formatLongDate(item.date)}</strong>
                    <span>{item.time}</span>
                  </div>
                  <div>
                    <strong>{item.doctor}</strong>
                    <span>{item.status}</span>
                  </div>
                  <div>
                    <strong>Notes</strong>
                    <span>{item.notes || 'No notes added'}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="appointment-empty-upcoming">
              {isAuthenticated ? 'No upcoming appointments booked yet.' : 'Book an appointment above to see it listed here.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}









