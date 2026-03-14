'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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

type UpcomingAppointment = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  status: string;
  notes: string;
};

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
    <div className="booking-calendar dash-section" aria-label="Appointment calendar">
      <div className="booking-calendar-header">
        <div>
          <p className="section-kicker">Calendar</p>
          <h3>{viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
        </div>
        <div className="booking-calendar-nav">
          <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
            ‹
          </button>
          <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
            ›
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
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [patientId, setPatientId] = useState('');
  const [doctorId] = useState(defaultDoctorId);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadBookedSlots = async (date: string) => {
    setLoadingSlots(true);
    setError('');

    try {
      const { data, error: queryError } = await supabase
        .from('appointments')
        .select('appointment_time,status')
        .eq('appointment_date', date)
        .neq('status', 'cancelled');

      if (queryError) {
        throw queryError;
      }

      setBookedSlots((data ?? []).map((item) => item.appointment_time).filter(Boolean));
    } catch {
      const { data: legacyData, error: legacyError } = await supabase.from('appointments').select('time').eq('date', date);

      if (legacyError) {
        setError('Unable to load available time slots right now.');
        setBookedSlots([]);
      } else {
        setBookedSlots((legacyData ?? []).map((item) => item.time).filter(Boolean));
      }
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadUpcomingAppointments = async (userId: string) => {
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
      const today = toIsoDate(new Date());
      const { data: legacyData } = await supabase
        .from('appointments')
        .select('id,date,time,provider')
        .eq('user_id', userId)
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .limit(4);

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
    }
  };

  useEffect(() => {
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

      const { data: profile } = await supabase.from('profiles').select('patient_id').eq('user_id', user.id).maybeSingle();

      setPatientId(profile?.patient_id || user.id);
      await loadUpcomingAppointments(user.id);
    };

    bootstrap();
  }, [supabase]);

  useEffect(() => {
    gsap.from('.appointment-hero-card, .appointment-layout, .appointment-upcoming', {
      opacity: 0,
      y: 22,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedTime('');
    loadBookedSlots(selectedDate);
  }, [selectedDate]);

  const handleBooking = async () => {
    setError('');
    setSuccess('');

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and an available time slot.');
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setIsAuthenticated(false);
      setError('Please log in to confirm this appointment.');
      router.replace('/login?redirectedFrom=/appointment');
      return;
    }

    setIsAuthenticated(true);
    setSubmitting(true);

    const bookingPayload = {
      user_id: user.id,
      patient_id: patientId || user.id,
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

    try {
      const { error: insertError } = await supabase.from('appointments').insert(bookingPayload);
      if (insertError) {
        throw insertError;
      }
    } catch {
      const { error: fallbackError } = await supabase.from('appointments').insert({
        user_id: user.id,
        date: selectedDate,
        time: selectedTime,
        type: 'Dental consultation',
        provider: 'General dentist'
      });

      if (fallbackError) {
        setError('Unable to book the appointment. Please try again.');
        setSubmitting(false);
        return;
      }
    }

    setSuccess(`Appointment booked for ${formatLongDate(selectedDate)} at ${selectedTime}.`);
    setNotes('');
    await loadBookedSlots(selectedDate);
    await loadUpcomingAppointments(user.id);
    setSubmitting(false);
  };

  return (
    <div className="appointment-booking-shell">
      <section className="appointment-hero-card dash-section">
        <div>
          <p className="section-kicker">Secure booking</p>
          <h3>Reserve a confirmed dental slot</h3>
          <p>
            Live availability updates instantly. Browse available chair time first, then sign in only when you are ready
            to confirm the visit.
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
            <span>Booked times are automatically disabled.</span>
          </article>
          <article>
            <ShieldCheck size={18} />
            <strong>Login on confirmation</strong>
            <span>Anyone can explore availability. Sign in is required only to save the booking.</span>
          </article>
          <article>
            <FileText size={18} />
            <strong>Notes included</strong>
            <span>Add booking context for the care team.</span>
          </article>
        </div>
      </section>

      <section className="appointment-layout dash-section">
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

      <section className="appointment-confirmation dash-section">
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
            {!isAuthenticated ? (
              <p className="section-kicker">
                You can view dates and time slots without logging in. Login is required only when you confirm the
                appointment.
              </p>
            ) : null}
            {error ? <p className="form-error">{error}</p> : null}
            {success ? <p className="form-success">{success}</p> : null}
            <Button type="button" onClick={handleBooking} disabled={submitting || !selectedDate || !selectedTime}>
              {submitting ? 'Booking...' : isAuthenticated ? 'Book Appointment' : 'Login to Book Appointment'}
            </Button>
          </div>
        </div>
      </section>

      <section className="appointment-upcoming dash-section">
        <div className="card appointment-upcoming-card">
          <div className="card-head">
            <div>
              <p className="section-kicker">Upcoming</p>
              <h3>Your booked appointments</h3>
            </div>
          </div>
          {!isAuthenticated ? (
            <p className="appointment-empty-upcoming">Log in after choosing a slot to view your booked appointments.</p>
          ) : upcomingAppointments.length ? (
            <div className="appointment-upcoming-list">
              {upcomingAppointments.map((item) => (
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
            <p className="appointment-empty-upcoming">No upcoming appointments booked yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
