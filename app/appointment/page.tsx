import { SectionHeading } from '../../components/SectionHeading';
import { AppointmentForm } from '../../components/AppointmentForm';

export default function AppointmentPage() {
  return (
    <main>
      <section className="section">
        <div className="appointment">
          <div>
            <SectionHeading
              eyebrow="Appointment Booking"
              title="Schedule a demo or patient consultation"
              subtitle="Connect your Supabase database to start capturing real appointments instantly."
            />
            <div className="appointment-benefits">
              <div>
                <h4>Realtime availability</h4>
                <p>Sync provider schedules and chair availability across locations.</p>
              </div>
              <div>
                <h4>Smart patient intake</h4>
                <p>Securely collect medical history, insurance, and consent forms.</p>
              </div>
              <div>
                <h4>Automated confirmations</h4>
                <p>Send SMS and email confirmations with no extra tools.</p>
              </div>
            </div>
          </div>
          <AppointmentForm />
        </div>
      </section>
    </main>
  );
}
