import Image from 'next/image';
import { team } from '../../lib/content';
import { SectionHeading } from '../../components/SectionHeading';

export default function TeamPage() {
  return (
    <main>
      <section className="section">
        <SectionHeading
          eyebrow="Team"
          title="Dental experts and technologists shaping the future of care"
          subtitle="A multidisciplinary team focused on patient-first operations."
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
      </section>
    </main>
  );
}
