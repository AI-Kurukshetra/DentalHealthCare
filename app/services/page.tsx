import { services } from '../../lib/content';
import { SectionHeading } from '../../components/SectionHeading';

export default function ServicesPage() {
  return (
    <main>
      <section className="section section-alt">
        <SectionHeading
          eyebrow="Services"
          title="Premium services for every stage of your practice"
          subtitle="Implementation, training, and optimization services designed for high-performance teams."
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
      </section>
    </main>
  );
}
