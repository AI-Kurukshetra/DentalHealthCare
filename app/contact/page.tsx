import Link from 'next/link';
import { CalendarDays, Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

const contactChannels = [
  {
    title: 'Call the care team',
    detail: '+1 (800) 555-1234',
    note: 'Mon to Sat, 8:00 AM to 6:00 PM',
    icon: Phone
  },
  {
    title: 'Email support',
    detail: 'hello@dentoracloud.com',
    note: 'Replies within one business day',
    icon: Mail
  },
  {
    title: 'Visit the clinic',
    detail: '335 Ocean Ave, Suite 12, San Diego, CA',
    note: 'Private parking and wheelchair access',
    icon: MapPin
  }
] as const;

const supportPoints = [
  'Implementation planning for single and multi-location practices',
  'Migration support for patients, schedules, and treatment history',
  'Front desk and provider training tailored to your workflows'
];

const officeHours = [
  { day: 'Monday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Tuesday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Wednesday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Thursday', hours: '8:00 AM - 6:00 PM' },
  { day: 'Friday', hours: '8:00 AM - 5:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 2:00 PM' },
  { day: 'Sunday', hours: 'Emergency support only' }
] as const;

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-shell">
          <div className="contact-hero-copy">
            <p className="contact-kicker">Contact Us</p>
            <h1>Modern support for every dental team touchpoint.</h1>
            <p className="contact-lead">
              Reach our care operations team for onboarding, platform walkthroughs, scheduling questions, and clinic
              support. The layout is designed to feel calm, clear, and clinical without losing warmth.
            </p>
            <div className="contact-hero-actions">
              <Link href="/appointment" className="btn-base btn-gradient">
                Book a Consultation
              </Link>
              <a href="tel:+18005551234" className="contact-secondary-action">
                Call Now
              </a>
            </div>
            <div className="contact-hero-strip" aria-label="Support highlights">
              <div>
                <strong>24h</strong>
                <span>Response window</span>
              </div>
              <div>
                <strong>12</strong>
                <span>States supported</span>
              </div>
              <div>
                <strong>HIPAA</strong>
                <span>Aligned workflows</span>
              </div>
            </div>
          </div>

          <aside className="contact-hero-panel">
            <div className="contact-panel-badge">
              <ShieldCheck size={18} />
              <span>Care Coordination Desk</span>
            </div>
            <h2>Tell us what your practice needs.</h2>
            <p>
              We help with implementation, patient communication setup, scheduling operations, and growth planning.
            </p>
            <ul className="contact-panel-list">
              {supportPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="contact-detail-section">
        <div className="contact-detail-shell">
          <div className="contact-card-grid">
            {contactChannels.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="contact-channel-card">
                  <div className="contact-channel-icon">
                    <Icon size={22} />
                  </div>
                  <div className="contact-channel-copy">
                    <p className="contact-channel-title">{item.title}</p>
                    <h3>{item.detail}</h3>
                    <span>{item.note}</span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="contact-main-grid">
            <section className="contact-form-card">
              <div className="contact-block-heading">
                <p className="contact-block-kicker">Send a Message</p>
                <h2>Start the conversation with a short inquiry.</h2>
                <p>
                  Share your clinic size, timeline, and the workflow you want to improve. This form is presented as a
                  polished inquiry layout and routes staff toward appointment booking.
                </p>
              </div>

              <form className="contact-form" action="/appointment">
                <div className="contact-form-grid">
                  <label>
                    <span>Full Name</span>
                    <input type="text" name="name" placeholder="Dr. Ava Morgan" />
                  </label>
                  <label>
                    <span>Email Address</span>
                    <input type="email" name="email" placeholder="ava@clinic.com" />
                  </label>
                  <label>
                    <span>Phone Number</span>
                    <input type="tel" name="phone" placeholder="(800) 555-1234" />
                  </label>
                  <label>
                    <span>Practice Size</span>
                    <select name="practiceSize" defaultValue="">
                      <option value="" disabled>
                        Select size
                      </option>
                      <option value="solo">Solo practice</option>
                      <option value="small-group">2-5 providers</option>
                      <option value="multi-location">Multi-location group</option>
                    </select>
                  </label>
                </div>

                <label className="contact-form-message">
                  <span>What do you need help with?</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="We want to improve scheduling, automate reminders, and simplify front-desk workflows."
                  />
                </label>

                <div className="contact-form-actions">
                  <button type="submit" className="btn-base btn-gradient">
                    Continue to Booking
                  </button>
                  <p>
                    Prefer a direct route? Use the appointment page to lock in a consultation time with the support
                    team.
                  </p>
                </div>
              </form>
            </section>

            <aside className="contact-side-stack">
              <section className="contact-hours-card">
                <div className="contact-side-heading">
                  <Clock3 size={18} />
                  <h3>Clinic Hours</h3>
                </div>
                <div className="contact-hours-list">
                  {officeHours.map((item) => (
                    <div key={item.day}>
                      <span>{item.day}</span>
                      <strong>{item.hours}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="contact-cta-card">
                <div className="contact-side-heading">
                  <CalendarDays size={18} />
                  <h3>Need a scheduled walkthrough?</h3>
                </div>
                <p>
                  Choose a time slot, add your contact details, and let the scheduling team prepare a focused demo for
                  your practice.
                </p>
                <Link href="/appointment" className="btn-base btn-gradient">
                  Open Appointment Page
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
