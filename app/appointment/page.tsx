import { SectionHeading } from "../../components/SectionHeading";
import Link from "next/link";
import { AppointmentForm } from "../../components/AppointmentForm";

export default async function AppointmentPage() {
  return (
    <main className="appointment-page">
      <section className="appointment-banner">
        <div className="appointment-banner-inner">
          <h1>Appointment</h1>
          <div className="appointment-banner-breadcrumbs">
            <Link href="/">Home</Link>
            <span aria-hidden="true">|</span>
            <span>Appointment</span>
          </div>
        </div>
      </section>

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
