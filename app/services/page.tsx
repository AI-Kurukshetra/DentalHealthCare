import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Users2,
  Workflow
} from 'lucide-react';
import { services } from '../../lib/content';
import { LinkButton } from '../../components/Button';

const serviceMeta = [
  {
    icon: Users2,
    badge: 'Patient Flow',
    bullets: ['Automated recalls', 'Chair utilization visibility', 'Care-team reminders']
  },
  {
    icon: BadgeDollarSign,
    badge: 'Revenue Cycle',
    bullets: ['Eligibility verification', 'Claim status tracking', 'Collections clarity']
  },
  {
    icon: ScanLine,
    badge: 'Clinical Ops',
    bullets: ['Unified imaging access', 'Perio and chart sync', 'Secure cloud records']
  }
] as const;

const supportHighlights = [
  {
    title: 'Built for front-desk speed',
    description: 'Reduce clicks, shorten handoff time, and keep patients moving without losing context.',
    icon: Workflow
  },
  {
    title: 'Reliable compliance posture',
    description: 'Audit-friendly workflows, role-aware access, and cleaner operational traceability.',
    icon: ShieldCheck
  },
  {
    title: 'Visible practice health',
    description: 'Track schedules, billing throughput, and care operations from a single working view.',
    icon: Activity
  }
] as const;

const serviceCards = services.map((service, index) => ({
  ...service,
  ...serviceMeta[index]
}));

export default function ServicesPage() {
  return (
    <main className="services-page">
      <section className="services-hero">
        <div className="services-hero-shell">
          <div className="services-hero-copy">
            <p className="services-kicker">Services</p>
            <h1>Clean operational systems for modern dental teams.</h1>
            <p className="services-lead">
              We package scheduling, billing, and clinical workflow support into clearer service layers so practices can
              scale without adding front-desk friction.
            </p>
            <div className="services-hero-actions">
              <LinkButton href="/appointment">Book a Consultation</LinkButton>
              <Link href="/contact" className="services-secondary-link">
                Contact the Team
              </Link>
            </div>
          </div>

          <div className="services-hero-panel">
            <div className="services-hero-panel-head">
              <Sparkles size={18} />
              <span>Healthcare-ready workflows</span>
            </div>
            <div className="services-hero-metrics">
              <article>
                <strong>3 Core Services</strong>
                <span>Designed around scheduling, finance, and clinical operations.</span>
              </article>
              <article>
                <strong>1 Unified Stack</strong>
                <span>Connected data across patient flow, treatment history, and billing visibility.</span>
              </article>
              <article>
                <strong>Fast Adoption</strong>
                <span>Simple service packaging that makes change easier for staff and providers.</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="services-highlight-strip">
        <div className="services-highlight-shell">
          {supportHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="services-highlight-card">
                <div className="services-highlight-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="services-catalog-section">
        <div className="services-catalog-shell">
          <div className="services-section-heading">
            <p className="services-kicker">What We Cover</p>
            <h2>Core service layers that keep the practice stable and scalable.</h2>
            <p>
              Each service card uses your existing seeded content, but the structure is cleaned up so it reads like a
              real healthcare platform offering rather than a generic card grid.
            </p>
          </div>

          <div className="services-catalog-grid">
            {serviceCards.map((service) => {
              const Icon = service.icon;

              return (
                <article key={service.title} className="services-catalog-card">
                  <div className="services-card-topline">
                    <span>{service.badge}</span>
                    <ArrowRight size={16} />
                  </div>
                  <div className="services-catalog-icon">
                    <Icon size={26} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="services-bullet-list">
                    {service.bullets.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="services-workflow-section">
        <div className="services-workflow-shell">
          <div className="services-workflow-copy">
            <p className="services-kicker">How It Lands</p>
            <h2>Structured enough for administrators, simple enough for daily clinical use.</h2>
            <p>
              The page now emphasizes clarity: what each service does, how it helps the team, and where a practice can
              start without overcomplicating the rollout.
            </p>
            <div className="services-workflow-points">
              <article>
                <strong>Front-office clarity</strong>
                <span>Less context switching between calls, bookings, and billing follow-ups.</span>
              </article>
              <article>
                <strong>Provider visibility</strong>
                <span>Schedules, treatment context, and imaging stay connected during active care.</span>
              </article>
              <article>
                <strong>Operational confidence</strong>
                <span>Managers get a clearer pulse on throughput, gaps, and service-level performance.</span>
              </article>
            </div>
          </div>

          <aside className="services-workflow-card">
            <div className="services-workflow-card-head">
              <ShieldCheck size={18} />
              <span>Practice Support</span>
            </div>
            <h3>Need help choosing the right starting point?</h3>
            <p>
              Start with one service area and expand once your team is comfortable. The goal is a cleaner operational
              surface, not a disruptive rebuild.
            </p>
            <div className="services-workflow-actions">
              <LinkButton href="/appointment">Schedule Appointment</LinkButton>
              <Link href="/contact">Ask a Question</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
