import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { team } from '../../lib/content';

const teamProfiles = team.map((member, index) => ({
  ...member,
  bio:
    [
      'Leads treatment planning and keeps every patient journey clinically consistent from first consult to follow-up.',
      'Designs alignment and restorative plans with a calm, detail-first approach focused on long-term smile health.',
      'Coordinates operations, scheduling, and patient communication so every visit feels clear and well supported.'
    ][index] || 'Supports the clinic with modern care coordination and patient-first communication.'
}));

const socialLinks = [
  {
    label: 'Twitter',
    href: 'https://x.com',
    icon: Twitter
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: Facebook
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram
  }
] as const;

export default function TeamPage() {
  return (
    <main className="team-page">
      <section className="team-page-hero">
        <div className="team-page-hero-inner">
          <p className="team-page-hero-kicker">Meet the people behind our care</p>
          <h1>Our Team</h1>
          <div className="team-page-breadcrumbs">
            <Link href="/">Home</Link>
            <span aria-hidden="true">|</span>
            <span>Our Team</span>
          </div>
        </div>
      </section>

      <section className="team-page-shell">
        <div className="team-page-intro">
          <div className="team-page-badge">
            <span className="team-page-badge-mark" aria-hidden="true">
              <Image src="/images/teethicon.png" alt="" width={18} height={18} />
            </span>
            <span>Our Staff</span>
          </div>
          <h2>Highly Qualified Doctors</h2>
          <p>
            Our care team combines clinical experience, modern treatment planning, and patient-first communication to
            deliver a reassuring visit from consultation to follow-up.
          </p>
        </div>

        <div className="team-page-grid">
          {teamProfiles.map((member) => (
            <article key={member.name} className="team-profile-card">
              <div className="team-profile-photo-shell">
                <div className="team-profile-photo">
                  <Image src={member.image} alt={member.name} fill sizes="(max-width: 900px) 100vw, 25vw" />
                </div>
              </div>
              <div className="team-profile-copy">
                <h3>{member.name}</h3>
                <p className="team-profile-role">{member.role}</p>
                <div className="team-profile-socials">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <a key={item.label} href={item.href} aria-label={item.label}>
                        <Icon size={14} />
                      </a>
                    );
                  })}
                </div>
                <p className="team-profile-bio">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
