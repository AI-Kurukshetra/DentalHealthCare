import { redirect } from 'next/navigation';
import { SectionHeading } from '../../components/SectionHeading';
import { AppointmentForm } from '../../components/AppointmentForm';
import { supabaseServerClient } from '../../lib/supabaseServerClient';

export default async function AppointmentPage() {
  const supabase = await supabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectedFrom=/appointment');
  }

  return (
    <main>
      <section className="section appointment-page-shell">
        <SectionHeading
          eyebrow="Appointment Booking"
          title="Schedule your next dental visit"
          subtitle="Choose a date, review live availability, and confirm your appointment in one secure booking flow."
        />
        <AppointmentForm />
      </section>
    </main>
  );
}
