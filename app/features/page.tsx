import Link from 'next/link';
import {
  CalendarClock,
  CheckCircle2,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { featureList } from '../../lib/content';
import { LinkButton } from '../../components/Button';

const featureIconMap = {
  patients: UsersRound,
  schedule: CalendarClock,
  billing: ReceiptText,
} as const;

const supportPoints = [
  'Designed for front-desk coordination, provider visibility, and faster patient flow.',
  'Structured with a calm healthcare UI and clearer visual grouping across every workflow.',
  'Flexible enough to support growth without turning the system into an overloaded admin surface.',
];

export default function FeaturesPage() {
  return (
    <main className="features-page">
      <section className="features-hero">
        <div className="features-hero-shell">
          <div className="features-hero-copy">
            <p className="features-kicker">Features</p>
            <h1>Everything your dental office needs, organized into one cleaner system.</h1>
            <p className="features-lead">
              From patient records to appointment coordination and billing visibility, the feature page now presents the
              platform as a polished healthcare workspace instead of a plain card list.
            </p>
            <div className="features-hero-actions">
              <LinkButton href="/appointment">Book a Demo</LinkButton>
              <Link href="/contact" className="features-secondary-link">
                Talk to the Team
              </Link>
            </div>
          </div>

          <aside className="features-hero-panel">
            <div className="features-panel-badge">
              <Sparkles size={18} />
              <span>Modern dental operations</span>
            </div>
            <h2>Built to keep operations calm, visible, and scalable.</h2>
            <ul className="features-panel-list">
              {supportPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="features-catalog-section">
        <div className="features-catalog-shell">
          <div className="features-section-heading">
            <p className="features-kicker">Core Modules</p>
            <h2>Cleaner presentation for the platform features already seeded in the project.</h2>
            <p>
              Each card now uses the seeded image and icon data, stronger spacing, and a more balanced dashboard-style
              layout that fits the rest of the dental product design.
            </p>
          </div>

          <div className="features-catalog-grid">
            {featureList.map((feature, index) => {
              const Icon = featureIconMap[feature.iconKey as keyof typeof featureIconMap] ?? ShieldCheck;

              return (
                <article
                  key={feature.title}
                  className="features-catalog-card"
                  style={{ '--feature-page-image': `url(${feature.image})` } as React.CSSProperties}
                >
                  <div className="features-card-topline">
                    <span>Module 0{index + 1}</span>
                    <Icon size={18} />
                  </div>
                  <div className="features-card-copy">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                  <div className="features-card-foot">
                    <div className="features-card-pill">
                      <CheckCircle2 size={16} />
                      <span>Included in platform</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="features-summary-section">
        <div className="features-summary-shell">
          <div className="features-summary-copy">
            <p className="features-kicker">Why It Works</p>
            <h2>Three essential layers without the clutter.</h2>
            <p>
              The page now reads as a professional feature overview: clearer hierarchy, better card balance, and a more
              refined white, light-blue, soft-teal healthcare presentation across desktop and mobile.
            </p>
          </div>
          <div className="features-summary-grid">
            <article>
              <strong>Patients</strong>
              <span>Profiles, history, and records stay connected to daily workflow.</span>
            </article>
            <article>
              <strong>Scheduling</strong>
              <span>Appointments are easier to understand and manage at a glance.</span>
            </article>
            <article>
              <strong>Revenue</strong>
              <span>Billing and insurance details stay visible without overwhelming the screen.</span>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
