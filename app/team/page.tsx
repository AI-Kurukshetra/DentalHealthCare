import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const teamProfiles = [
  {
    name: 'Alex Turner',
    role: 'Clinical Director',
    seed: 'alex-turner',
    bio: 'Leads complex treatment planning and keeps clinical standards consistent across every patient visit.'
  },
  {
    name: 'Andrea Hayes',
    role: 'Orthodontist',
    seed: 'andrea-hayes',
    bio: 'Designs alignment journeys with a calm, detail-first approach focused on long-term smile health.'
  },
  {
    name: 'Brandon Fuller',
    role: 'Hygienist',
    seed: 'brandon-fuller',
    bio: 'Works with patients on preventive care, hygiene routines, and comfortable in-chair education.'
  },
  {
    name: 'Elizabeth Welsh',
    role: 'Dentist',
    seed: 'elizabeth-welsh',
    bio: 'Blends restorative precision with friendly communication so each appointment feels clear and reassuring.'
  }
] as const;

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

const buildSeedAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

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
                  <Image
                    src={buildSeedAvatar(member.seed)}
                    alt={member.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 25vw"
                  />
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
