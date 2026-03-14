'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { CalendarDays, FileText, Image as ImageIcon } from 'lucide-react';
import { gsap } from 'gsap';
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

export function HomeClient() {
  useEffect(() => {
    gsap.from('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out' });
    gsap.from('.hero-title', { y: 26, opacity: 0, duration: 0.7, delay: 0.1, ease: 'power3.out' });
    gsap.from('.hero-subtitle', { y: 18, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    gsap.from('.hero-actions', { y: 18, opacity: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' });
    gsap.from('.hero-photo', { x: -24, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
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
        <button className="quick-action" type="button" aria-label="Appointments">
          <CalendarDays size={22} />
        </button>
        <button className="quick-action" type="button" aria-label="Gallery">
          <ImageIcon size={22} />
        </button>
        <button className="quick-action" type="button" aria-label="Billing">
          <FileText size={22} />
        </button>
      </div>

      <section className="trust-strip">
        <p>Trusted by high-growth dental groups across 12 states</p>
        <div className="trust-grid">
          {trustMarks.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="Highlights"
          title="Essential workflows, orchestrated in one connected command center"
          subtitle="Every module is designed to remove friction between teams and patients."
        />
        <div className="feature-grid">
          {featureList.slice(0, 3).map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
        <div className="section-cta">
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


