import { featureList } from '../../lib/content';
import { SectionHeading } from '../../components/SectionHeading';

export default function FeaturesPage() {
  return (
    <main>
      <section className="section">
        <SectionHeading
          eyebrow="Features"
          title="Everything your dental office needs, connected in one intelligent system"
          subtitle="From treatment plans to compliance, every workflow is streamlined with clarity and speed."
        />
        <div className="feature-grid">
          {featureList.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
