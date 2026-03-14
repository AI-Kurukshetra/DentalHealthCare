'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { CalendarClock, CalendarDays, FileText, Image as ImageIcon, ReceiptText, UsersRound } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LinkButton } from './Button';
import { SectionHeading } from './SectionHeading';
import { featureList, services, team, testimonials, blogFallback } from '../lib/content';

const processSteps = [
  {
    title: 'Discovery & Audit',
    description: 'We map your current workflows, pain points, and goals to set success metrics.'
  },
  {
    title: 'Implementation Sprint',
    description: 'Config, data migration, and integrations happen in a guided, two-week rollout.'
  },
  {
    title: 'Training & Optimization',
    description: 'Live team training, follow-up optimization, and continuous performance tuning.'
  }
];

const trustMarks = ['HIPAA-Aligned', 'SOC 2 Minded', '99.99% Uptime', '24/7 Support', 'US Data Residency'];
const featureIconMap = {
  patients: UsersRound,
  schedule: CalendarClock,
  billing: ReceiptText
} as const;
const spotlightServices = [
  {
    title: 'Dental Implants',
    description: 'Dental implants are the closest you can get to healthy, beautiful and natural teeth.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M22 10c-6 0-10 4.8-10 11.2 0 3.6 1.1 7.1 2.9 10l5 8.1c1.2 1.9 2 4 2.2 6.3L23.3 54c.1 1 .9 1.8 1.9 1.8h13.6c1 0 1.8-.8 1.9-1.8l1.2-8.4c.3-2.2 1-4.4 2.2-6.3l5-8.1c1.8-2.9 2.9-6.4 2.9-10C52 14.8 48 10 42 10c-3 0-5.3 1-7 2.9-1.7-1.9-4-2.9-7-2.9Z" />
        <path d="M25 32h14" />
        <path d="M27 37h10" />
        <path d="M29 42h6" />
        <path d="M32 27v23" />
      </svg>
    )
  },
  {
    title: 'Parodontosis Care',
    description: 'Timely diagnosed and treated parodontosis disease can save you from tooth loss.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M22 10c-6 0-10 4.8-10 11.2 0 3.6 1.1 7.1 2.9 10l4.5 7.2c1.4 2.1 2.3 4.5 2.6 7l.8 6c.1 1 .9 1.7 1.9 1.7h3.8c1 0 1.8-.8 1.9-1.8l1.4-10.7h1.6L35 51.3c.1 1 .9 1.8 1.9 1.8h3.4c1 0 1.8-.7 1.9-1.7l.8-6c.3-2.5 1.2-4.9 2.6-7l4.5-7.2c1.8-2.9 2.9-6.4 2.9-10C53 14.8 49 10 43 10c-3 0-5.3 1-7 2.9-1.7-1.9-4-2.9-7-2.9Z" />
        <path d="M21 25c4-2 8-2 12 0" />
        <path d="M31 24c4-2 8-2 12 0" />
        <circle cx="24" cy="31" r="1.5" />
        <circle cx="31" cy="34" r="1.5" />
        <circle cx="39" cy="30" r="1.5" />
      </svg>
    )
  },
  {
    title: 'Teeth Whitening',
    description: 'Teeth Whitening improve how your teeth look by removing stains and discoloration.',
    icon: (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M22 10c-6 0-10 4.8-10 11.2 0 3.6 1.1 7.1 2.9 10l4.8 7.8c1.3 2 2.1 4.3 2.4 6.7l.9 6.5c.1 1 .9 1.8 1.9 1.8h3.6c1 0 1.8-.8 1.9-1.8L32 42h0l1.6 11.1c.1 1 .9 1.8 1.9 1.8h3.6c1 0 1.8-.8 1.9-1.8l.9-6.5c.3-2.4 1.1-4.7 2.4-6.7l4.8-7.8c1.8-2.9 2.9-6.4 2.9-10C52 14.8 48 10 42 10c-3 0-5.3 1-7 2.9-1.7-1.9-4-2.9-7-2.9Z" />
        <path d="m47 12 1.3 4.2L53 17.5l-4.7 1.3L47 23l-1.3-4.2L41 17.5l4.7-1.3L47 12Z" />
        <path d="m18 18 .8 2.5L22 21.3l-3.2.8L18 24.5l-.8-2.4-3.2-.8 3.2-.8L18 18Z" />
      </svg>
    )
  }
];

export function HomeClient() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out' });
      gsap.from('.hero-title', { y: 26, opacity: 0, duration: 0.7, delay: 0.1, ease: 'power3.out' });
      gsap.from('.hero-subtitle', { y: 18, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
      gsap.from('.hero-actions', { y: 18, opacity: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' });
      gsap.from('.hero-photo', { x: -24, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.from('.feature-showcase-card', {
        y: 36,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.feature-showcase-grid',
          start: 'top 82%'
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main id="top">
      <section className="hero hero-split">
        <div className="hero-photo">
          <Image
            src="https://www.outsourcestrategies.com/wp-content/uploads/2026/01/boosting-efficiency-through-dental-practice-management.webp"
            alt="Dental practice management team"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="hero-content">
          <span className="hero-eyebrow">Dental Software</span>
          <h1 className="hero-title">Dental Practice Management Systems</h1>
          <p className="hero-subtitle">
            Dental Practice Management systems streamline operations for dental offices by integrating patient records, scheduling, billing, treatment planning, and compliance management into unified cloud-based platforms.
          </p>
          <div className="hero-actions">
            <LinkButton href="/appointment">Make an Appointment</LinkButton>
          </div>
        </div>
      </section>

      <div className="hero-quick">
        <Link className="quick-action" href="/appointment" aria-label="Appointments">
          <CalendarDays size={22} />
        </Link>
        <button className="quick-action" type="button" aria-label="Gallery">
          <ImageIcon size={22} />
        </button>
        <button className="quick-action" type="button" aria-label="Billing">
          <FileText size={22} />
        </button>
      </div>

      <section className="service-highlight-strip">
        <div className="service-highlight-shell">
          {spotlightServices.map((service) => (
            <article key={service.title} className="service-highlight-card">
              <div className="service-highlight-icon">{service.icon}</div>
              <div className="service-highlight-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="welcome-showcase">
        <div className="welcome-showcase-head">
          <div className="welcome-showcase-badge">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M22 10c-6 0-10 4.8-10 11.2 0 3.6 1.1 7.1 2.9 10l4.8 7.8c1.3 2 2.1 4.3 2.4 6.7l.9 6.5c.1 1 .9 1.8 1.9 1.8h3.6c1 0 1.8-.8 1.9-1.8L32 42h0l1.6 11.1c.1 1 .9 1.8 1.9 1.8h3.6c1 0 1.8-.8 1.9-1.8l.9-6.5c.3-2.4 1.1-4.7 2.4-6.7l4.8-7.8c1.8-2.9 2.9-6.4 2.9-10C52 14.8 48 10 42 10c-3 0-5.3 1-7 2.9-1.7-1.9-4-2.9-7-2.9Z" />
              <path d="M24 24c2-1.2 4.6-1.8 8-1.8s6 .6 8 1.8" />
            </svg>
            <span>NEW SMILES</span>
          </div>
          <h2>Welcome!</h2>
        </div>
        <div className="welcome-showcase-stage">
          <article className="welcome-showcase-card">
            <h3>We use advanced proven technology to keep your smile looking the best!</h3>
            <p>
              We are passionate about smiles and having the latest technology is one step we can take to help save yours!
            </p>
            <a className="welcome-showcase-button" href="/services">
              Learn More
            </a>
          </article>
          <div className="welcome-showcase-image">
            <Image
              src="/images/img.jpeg"
              alt="Dental patient receiving treatment"
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            <div className="welcome-showcase-play" aria-hidden="true">
              <span />
            </div>
          </div>
          <div className="welcome-showcase-accent" aria-hidden="true" />
        </div>
      </section>

      <section className="trust-strip">
        <p>Trusted by high-growth dental groups across 12 states</p>
        <div className="trust-grid">
          {trustMarks.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section feature-showcase">
        <div className="feature-showcase-shell">
          <SectionHeading
            eyebrow="Core Features"
            title="Connected tools for every patient touchpoint"
            subtitle="The platform unifies front-desk coordination, clinical records, and revenue workflows into one clear operating system for modern dental teams."
          />
          <div className="feature-showcase-grid">
            {featureList.slice(0, 4).map((feature, index) => {
              const Icon = featureIconMap[feature.iconKey as keyof typeof featureIconMap] ?? FileText;

              return (
                <article key={feature.title} className="feature-showcase-card">
                  <div className="feature-showcase-card-top">
                    <span className="feature-showcase-icon" aria-hidden="true">
                      <Icon size={24} />
                    </span>
                    <span className="feature-showcase-index">0{index + 1}</span>
                  </div>
                  <div className="feature-showcase-copy">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="section-cta feature-showcase-cta">
          <LinkButton href="/features">See all features</LinkButton>
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeading
          eyebrow="Services"
          title="White-glove rollout services, delivered with zero disruption"
          subtitle="Implementation, training, and optimization tailored to your clinical operations."
        />
        <div className="service-grid">
          {services.map((service) => (
            <article key={service.title} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
        <div className="section-cta">
          <LinkButton href="/services">Explore services</LinkButton>
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Process"
          title="A focused rollout that respects your calendar"
          subtitle="We handle change management so your team stays confident and productive."
        />
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <article key={step.title} className="process-card">
              <span className="process-step">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeading
          eyebrow="Team"
          title="A care-obsessed team at your side"
          subtitle="Dental experts, technologists, and onboarding leads working as an extension of your practice."
        />
        <div className="team-grid">
          {team.map((member) => (
            <article key={member.name} className="team-card">
              <div className="team-image">
                <Image src={member.image} alt={member.name} fill sizes="(max-width: 900px) 100vw, 33vw" />
              </div>
              <div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="section-cta">
          <LinkButton href="/team">Meet the team</LinkButton>
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Testimonials"
          title="Teams see immediate operational lift"
          subtitle="Real results from practices that upgraded to Dentora Cloud."
          align="center"
        />
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="testimonial-card">
              <p>"{testimonial.quote}"</p>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.title}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <SectionHeading
          eyebrow="Blog"
          title="Latest playbooks for growth-minded practices"
          subtitle="Curated clinical, financial, and operations insights."
        />
        <div className="blog-grid">
          {blogFallback.map((post) => (
            <article key={post.id} className="blog-card">
              <span className="tag">{post.tag}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
        <div className="section-cta">
          <LinkButton href="/blog">Read the blog</LinkButton>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Ready to modernize your front office?</h2>
          <p>We will map your workflows, connect your data, and launch in weeks, not months.</p>
        </div>
        <div className="cta-actions">
          <LinkButton href="/appointment">Book a consultation</LinkButton>
          <a className="btn-ghost" href="/contact">
            Contact sales
          </a>
        </div>
      </section>
    </main>
  );
}