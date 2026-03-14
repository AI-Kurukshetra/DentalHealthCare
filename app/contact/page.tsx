import { SectionHeading } from '../../components/SectionHeading';
import { LinkButton } from '../../components/Button';

export default function ContactPage() {
  return (
    <main>
      <section className="section section-alt">
        <div className="contact">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Ready to modernize your dental operations?"
              subtitle="Let us know how we can help. We'll respond within one business day."
            />
            <div className="contact-info">
              <div>
                <h4>Call us</h4>
                <p>+1 (800) 555-1234</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>hello@dentoracloud.com</p>
              </div>
              <div>
                <h4>Visit</h4>
                <p>335 Ocean Ave, Suite 12, San Diego, CA</p>
              </div>
            </div>
          </div>
          <div className="contact-card">
            <h3>Request a platform walkthrough</h3>
            <p>We tailor onboarding, data migration, and training for your practice size.</p>
            <LinkButton href="/appointment">Schedule a Call</LinkButton>
          </div>
        </div>
      </section>
    </main>
  );
}
