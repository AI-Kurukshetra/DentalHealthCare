import { SectionHeading } from "../../components/SectionHeading";
import { AppointmentForm } from "../../components/AppointmentForm";

export default async function AppointmentPage() {
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
