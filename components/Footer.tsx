export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Dentora Cloud</h3>
          <p>
            A modern dental practice management system for clinics that demand speed, clarity, and patient-first
            experiences.
          </p>
        </div>
        <div>
          <h4>Platform</h4>
          <a href="/features">Features</a>
          <a href="/services">Services</a>
          <a href="/blog">Blog</a>
          <a href="/appointment">Appointments</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="/team">Team</a>
          <a href="/contact">Contact</a>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:hello@dentoracloud.com">hello@dentoracloud.com</a>
          <a href="tel:+18005551234">+1 (800) 555-1234</a>
          <p>335 Ocean Ave, Suite 12, San Diego, CA</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Dentora Cloud. All rights reserved.</span>
        <span>HIPAA-ready • SOC2-minded • Supabase powered</span>
      </div>
    </footer>
  );
}
