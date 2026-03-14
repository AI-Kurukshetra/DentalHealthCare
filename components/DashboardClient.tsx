'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Stethoscope,
  User,
} from "lucide-react";
import { gsap } from "gsap";
import { supabaseBrowser } from "../lib/supabaseClient";

const fallbackProfile = {
  name: "Ariana Patel",
  patientId: "PT-48291",
  age: 32,
  status: "Active",
  photo: "/images/doctor-placeholder.svg",
  phone: "(555) 210-4821",
  email: "ariana.patel@example.com",
  address: "742 Evergreen Terrace, Springfield, IL",
  emergencyContact: "Ravi Patel ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ (555) 210-1198",
  allergies: "Penicillin, Latex",
  conditions: "Mild asthma",
  medications: "Albuterol inhaler",
  pastTreatments: "Root canal (2023), Whitening (2024)",
  insuranceProvider: "Delta Dental",
  policyNumber: "DD-9283-221",
  coverageStatus: "Active - 80% coverage",
};

const fallbackAppointments = [
  {
    date: "Apr 08, 2026",
    time: "09:30 AM",
    type: "Routine Cleaning",
    provider: "Dr. Kim",
  },
  {
    date: "Apr 22, 2026",
    time: "02:00 PM",
    type: "Follow-up",
    provider: "Dr. Lee",
  },
];

const fallbackTreatments = [
  {
    date: "Mar 12, 2026",
    procedure: "Composite Filling",
    tooth: "14",
    provider: "Dr. Kim",
  },
  {
    date: "Feb 03, 2026",
    procedure: "Crown Placement",
    tooth: "19",
    provider: "Dr. Lee",
  },
  {
    date: "Jan 14, 2026",
    procedure: "X-Ray Exam",
    tooth: "Full",
    provider: "Dr. Kim",
  },
];

const fallbackBilling = {
  balance: "$245.00",
  lastPayment: "$120.00 on Mar 05, 2026",
  nextInvoice: "Apr 15, 2026",
};

const fallbackNotifications = [
  "Insurance eligibility verified for next appointment.",
  "Pre-visit forms completed by patient.",
  "Reminder sent for April 08 appointment.",
];

export function DashboardClient() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [profile, setProfile] = useState(fallbackProfile);
  const [appointments, setAppointments] = useState(fallbackAppointments);
  const [treatments, setTreatments] = useState(fallbackTreatments);
  const [billing, setBilling] = useState(fallbackBilling);
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [menuOpen, setMenuOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const { data: profileRow } = await supabase
        .from("profiles")
        .select(
          "full_name,patient_id,age,status,avatar_url,phone,email,address,emergency_contact,allergies,conditions,medications,past_treatments,insurance_provider,policy_number,coverage_status",
        )
        .eq("user_id", sessionData.session.user.id)
        .maybeSingle();

      if (profileRow) {
        setProfile({
          name: profileRow.full_name || fallbackProfile.name,
          patientId: profileRow.patient_id || fallbackProfile.patientId,
          age: profileRow.age || fallbackProfile.age,
          status: profileRow.status || fallbackProfile.status,
          photo: profileRow.avatar_url || fallbackProfile.photo,
          phone: profileRow.phone || fallbackProfile.phone,
          email: profileRow.email || fallbackProfile.email,
          address: profileRow.address || fallbackProfile.address,
          emergencyContact:
            profileRow.emergency_contact || fallbackProfile.emergencyContact,
          allergies: profileRow.allergies || fallbackProfile.allergies,
          conditions: profileRow.conditions || fallbackProfile.conditions,
          medications: profileRow.medications || fallbackProfile.medications,
          pastTreatments:
            profileRow.past_treatments || fallbackProfile.pastTreatments,
          insuranceProvider:
            profileRow.insurance_provider || fallbackProfile.insuranceProvider,
          policyNumber:
            profileRow.policy_number || fallbackProfile.policyNumber,
          coverageStatus:
            profileRow.coverage_status || fallbackProfile.coverageStatus,
        });
      }

      const { data: upcoming } = await supabase
        .from("appointments")
        .select("date,time,type,provider")
        .eq("user_id", sessionData.session.user.id)
        .order("date", { ascending: true })
        .limit(3);

      if (upcoming && upcoming.length) {
        setAppointments(
          upcoming.map((item) => ({
            date: item.date,
            time: item.time,
            type: item.type,
            provider: item.provider,
          })),
        );
      }

      const { data: recentTreatments } = await supabase
        .from("treatments")
        .select("date,procedure,tooth,provider")
        .eq("user_id", sessionData.session.user.id)
        .order("date", { ascending: false })
        .limit(5);

      if (recentTreatments && recentTreatments.length) {
        setTreatments(recentTreatments);
      }

      const { data: billingData } = await supabase
        .from("billing_summary")
        .select("balance,last_payment,next_invoice")
        .eq("user_id", sessionData.session.user.id)
        .maybeSingle();

      if (billingData) {
        setBilling({
          balance: billingData.balance || fallbackBilling.balance,
          lastPayment: billingData.last_payment || fallbackBilling.lastPayment,
          nextInvoice: billingData.next_invoice || fallbackBilling.nextInvoice,
        });
      }

      const { data: alerts } = await supabase
        .from("notifications")
        .select("message")
        .eq("user_id", sessionData.session.user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (alerts && alerts.length) {
        setNotifications(alerts.map((alert) => alert.message));
      }
    };

    loadDashboard();
  }, [router, supabase]);

  useEffect(() => {
    if (!dashboardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dash-section',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform'
        }
      );
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div ref={dashboardRef} className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-dot" />
          Dentora
        </div>
        <div className="sidebar-panel">
          <p className="section-kicker">Patient Workspace</p>
          <strong>{profile.name}</strong>
          <span>{profile.patientId}</span>
        </div>
        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a className="nav-item" href="#">
            <CalendarDays size={18} />
            Appointments
          </a>
          <a className="nav-item" href="#">
            <Stethoscope size={18} />
            Treatments
          </a>
          <a className="nav-item" href="#">
            <CreditCard size={18} />
            Billing
          </a>
          <a className="nav-item" href="#">
            <FileText size={18} />
            Documents
          </a>
          <a className="nav-item" href="#">
            <Settings size={18} />
            Settings
          </a>
        </nav>
        <div className="sidebar-support">
          <p className="section-kicker">Security</p>
          <strong>Protected health records</strong>
          <span>Access visits, insurance, and treatment history from one secure view.</span>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar dash-section">
          <div className="dashboard-heading">
            <p className="section-kicker">Patient dashboard</p>
            <h1>{profile.name}</h1>
          </div>
          <div className="dashboard-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search patients, appointments, or records"
            />
          </div>
          <div className="dashboard-actions">
            <button
              className="dashboard-icon-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            <div className="avatar-menu">
              <button
                className="dashboard-avatar"
                type="button"
                aria-label="Open user menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {profile.photo ? (
                  <Image
                    src={profile.photo}
                    alt={profile.name}
                    fill
                    sizes="40px"
                  />
                ) : (
                  <User size={18} />
                )}
              </button>
              {menuOpen ? (
                <div className="avatar-dropdown">
                  <div className="avatar-meta">
                    <span>{profile.name}</span>
                    <small>{profile.email}</small>
                  </div>
                  <button type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <section className="profile-card dash-section">
          <div className="profile-overview">
            <div className="profile-photo profile-photo-large">
              <Image src={profile.photo} alt={profile.name} fill sizes="112px" />
            </div>
            <div className="profile-details">
              <p className="section-kicker">Profile overview</p>
              <h2>{profile.name}</h2>
              <p>Patient ID: {profile.patientId}</p>
              <div className="profile-meta">
                <span>Age: {profile.age}</span>
                <span className="status-pill">{profile.status}</span>
              </div>
            </div>
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <span>Next Appointment</span>
              <strong>{appointments[0]?.date || "None scheduled"}</strong>
            </div>
            <div className="profile-stat">
              <span>Coverage</span>
              <strong>{profile.coverageStatus}</strong>
            </div>
            <div className="profile-stat">
              <span>Primary Provider</span>
              <strong>{appointments[0]?.provider || "Unassigned"}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-grid dash-section">
          <div className="card metric-card">
            <div className="card-head">
              <div>
                <p className="section-kicker">Schedule</p>
                <h3>Upcoming Appointments</h3>
              </div>
              <CalendarDays size={18} />
            </div>
            <ul className="metric-list">
              {appointments.map((item) => (
                <li key={`${item.date}-${item.time}`} className="metric-row">
                  <div>
                    <strong>{item.type}</strong>
                    <span>{item.provider}</span>
                  </div>
                  <div>
                    <strong>{item.date}</strong>
                    <span>{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card metric-card">
            <div className="card-head">
              <div>
                <p className="section-kicker">Clinical</p>
                <h3>Recent Treatments</h3>
              </div>
              <Stethoscope size={18} />
            </div>
            <ul className="metric-list">
              {treatments.slice(0, 3).map((item) => (
                <li key={`${item.date}-${item.procedure}`} className="metric-row">
                  <div>
                    <strong>{item.procedure}</strong>
                    <span>Tooth {item.tooth}</span>
                  </div>
                  <div>
                    <strong>{item.date}</strong>
                    <span>{item.provider}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card metric-card">
            <div className="card-head">
              <div>
                <p className="section-kicker">Finance</p>
                <h3>Billing Summary</h3>
              </div>
              <CreditCard size={18} />
            </div>
            <div className="billing-stack">
              <div className="billing-amount">{billing.balance}</div>
              <p>Current balance due</p>
              <div className="billing-meta">
                <span>Last payment</span>
                <strong>{billing.lastPayment}</strong>
              </div>
              <div className="billing-meta">
                <span>Next invoice</span>
                <strong>{billing.nextInvoice}</strong>
              </div>
            </div>
          </div>
          <div className="card metric-card">
            <div className="card-head">
              <div>
                <p className="section-kicker">Updates</p>
                <h3>Notifications</h3>
              </div>
              <Bell size={18} />
            </div>
            <ul className="notice-list">
              {notifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="detail-grid">
          <div className="card section-card dash-section">
            <div className="card-head">
              <div>
                <p className="section-kicker">Identity</p>
                <h3>Personal Information</h3>
              </div>
            </div>
            <div className="info-grid">
              <div>
                <strong>Phone</strong>
                <span>{profile.phone}</span>
              </div>
              <div>
                <strong>Email</strong>
                <span>{profile.email}</span>
              </div>
              <div>
                <strong>Address</strong>
                <span>{profile.address}</span>
              </div>
              <div>
                <strong>Emergency Contact</strong>
                <span>{profile.emergencyContact}</span>
              </div>
            </div>
          </div>

          <div className="card section-card dash-section">
            <div className="card-head">
              <div>
                <p className="section-kicker">History</p>
                <h3>Medical History</h3>
              </div>
            </div>
            <div className="info-grid">
              <div>
                <strong>Allergies</strong>
                <span>{profile.allergies}</span>
              </div>
              <div>
                <strong>Conditions</strong>
                <span>{profile.conditions}</span>
              </div>
              <div>
                <strong>Medications</strong>
                <span>{profile.medications}</span>
              </div>
              <div>
                <strong>Past Treatments</strong>
                <span>{profile.pastTreatments}</span>
              </div>
            </div>
          </div>

          <div className="card section-card dash-section">
            <div className="card-head">
              <div>
                <p className="section-kicker">Coverage</p>
                <h3>Insurance Details</h3>
              </div>
            </div>
            <div className="info-grid">
              <div>
                <strong>Provider</strong>
                <span>{profile.insuranceProvider}</span>
              </div>
              <div>
                <strong>Policy Number</strong>
                <span>{profile.policyNumber}</span>
              </div>
              <div>
                <strong>Coverage Status</strong>
                <span>{profile.coverageStatus}</span>
              </div>
            </div>
          </div>

          <div className="card records-card dash-section">
            <div className="card-head">
              <div>
                <p className="section-kicker">Clinical log</p>
                <h3>Treatment Records</h3>
              </div>
            </div>
            <div className="table-wrap">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Procedure</th>
                    <th>Tooth</th>
                    <th>Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((item) => (
                    <tr key={`${item.date}-${item.procedure}`}>
                      <td>{item.date}</td>
                      <td>{item.procedure}</td>
                      <td>{item.tooth}</td>
                      <td>{item.provider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}