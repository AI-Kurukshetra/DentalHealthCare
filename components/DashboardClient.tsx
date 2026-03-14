'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  User,
  UserRound,
} from 'lucide-react';
import { gsap } from 'gsap';
import { supabaseBrowser } from '../lib/supabaseClient';

type DashboardSection =
  | 'overview'
  | 'appointments'
  | 'treatments'
  | 'billing'
  | 'documents'
  | 'settings';

type AppointmentItem = {
  date: string;
  time: string;
  type: string;
  provider: string;
};

type TreatmentItem = {
  date: string;
  procedure: string;
  tooth: string;
  provider: string;
};

type BillingSummary = {
  balance: string;
  lastPayment: string;
  nextInvoice: string;
};

type ProfileState = {
  name: string;
  patientId: string;
  age: number;
  status: string;
  photo: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  allergies: string;
  conditions: string;
  medications: string;
  pastTreatments: string;
  insuranceProvider: string;
  policyNumber: string;
  coverageStatus: string;
};

const fallbackProfile: ProfileState = {
  name: 'Ariana Patel',
  patientId: 'PT-48291',
  age: 32,
  status: 'Active',
  photo: '/images/doctor-placeholder.svg',
  phone: '(555) 210-4821',
  email: 'ariana.patel@example.com',
  address: '742 Evergreen Terrace, Springfield, IL',
  emergencyContact: 'Ravi Patel | (555) 210-1198',
  allergies: 'Penicillin, Latex',
  conditions: 'Mild asthma',
  medications: 'Albuterol inhaler',
  pastTreatments: 'Root canal (2023), Whitening (2024)',
  insuranceProvider: 'Delta Dental',
  policyNumber: 'DD-9283-221',
  coverageStatus: 'Active - 80% coverage',
};

const fallbackAppointments: AppointmentItem[] = [
  {
    date: 'Apr 08, 2026',
    time: '09:30 AM',
    type: 'Routine Cleaning',
    provider: 'Dr. Kim',
  },
  {
    date: 'Apr 22, 2026',
    time: '02:00 PM',
    type: 'Follow-up',
    provider: 'Dr. Lee',
  },
  {
    date: 'May 06, 2026',
    time: '11:15 AM',
    type: 'Whitening Consultation',
    provider: 'Dr. Shah',
  },
];

const fallbackTreatments: TreatmentItem[] = [
  {
    date: 'Mar 12, 2026',
    procedure: 'Composite Filling',
    tooth: '14',
    provider: 'Dr. Kim',
  },
  {
    date: 'Feb 03, 2026',
    procedure: 'Crown Placement',
    tooth: '19',
    provider: 'Dr. Lee',
  },
  {
    date: 'Jan 14, 2026',
    procedure: 'X-Ray Exam',
    tooth: 'Full',
    provider: 'Dr. Kim',
  },
];

const fallbackBilling: BillingSummary = {
  balance: '$245.00',
  lastPayment: '$120.00 on Mar 05, 2026',
  nextInvoice: 'Apr 15, 2026',
};

const fallbackNotifications = [
  'Insurance eligibility verified for next appointment.',
  'Pre-visit forms completed by patient.',
  'Reminder sent for April 08 appointment.',
];

const dashboardNav = [
  { key: 'overview', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'appointments', label: 'Appointments', href: '/dashboard/appointments', icon: CalendarDays },
  { key: 'treatments', label: 'Treatments', href: '/dashboard/treatments', icon: Stethoscope },
  { key: 'billing', label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { key: 'documents', label: 'Documents', href: '/dashboard/documents', icon: FileText },
  { key: 'settings', label: 'Settings', href: '/dashboard/settings', icon: Settings },
] as const;

const sectionMeta: Record<DashboardSection, { kicker: string; title: string; description: string }> = {
  overview: {
    kicker: 'Patient dashboard',
    title: 'Overview',
    description: 'A quick view of appointments, coverage, billing, and recent treatment activity.',
  },
  appointments: {
    kicker: 'Schedule',
    title: 'Appointments',
    description: 'Manage upcoming visits, provider details, and booking actions from one place.',
  },
  treatments: {
    kicker: 'Clinical',
    title: 'Treatments',
    description: 'Review completed procedures, medical history, and treatment records.',
  },
  billing: {
    kicker: 'Finance',
    title: 'Billing',
    description: 'Track balances, invoices, payment status, and insurance coverage details.',
  },
  documents: {
    kicker: 'Records',
    title: 'Documents',
    description: 'Access key forms, visit summaries, insurance files, and downloadable records.',
  },
  settings: {
    kicker: 'Account',
    title: 'Settings',
    description: 'Update profile details, contact preferences, and account security controls.',
  },
};

export function DashboardClient() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [profile, setProfile] = useState(fallbackProfile);
  const [appointments, setAppointments] = useState(fallbackAppointments);
  const [treatments, setTreatments] = useState(fallbackTreatments);
  const [billing, setBilling] = useState(fallbackBilling);
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [menuOpen, setMenuOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  const currentSection = useMemo<DashboardSection>(() => {
    const section = pathname?.split('/')[2];

    if (
      section === 'appointments' ||
      section === 'treatments' ||
      section === 'billing' ||
      section === 'documents' ||
      section === 'settings'
    ) {
      return section;
    }

    return 'overview';
  }, [pathname]);

  useEffect(() => {
    const loadDashboard = async () => {
      const client = supabase;
      if (!client) {
        router.push('/login');
        return;
      }

      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData.session) {
        router.push('/login');
        return;
      }

      const { data: profileRow } = await client
        .from('profiles')
        .select(
          'full_name,patient_id,age,status,avatar_url,phone,email,address,emergency_contact,allergies,conditions,medications,past_treatments,insurance_provider,policy_number,coverage_status',
        )
        .eq('user_id', sessionData.session.user.id)
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
          emergencyContact: profileRow.emergency_contact || fallbackProfile.emergencyContact,
          allergies: profileRow.allergies || fallbackProfile.allergies,
          conditions: profileRow.conditions || fallbackProfile.conditions,
          medications: profileRow.medications || fallbackProfile.medications,
          pastTreatments: profileRow.past_treatments || fallbackProfile.pastTreatments,
          insuranceProvider: profileRow.insurance_provider || fallbackProfile.insuranceProvider,
          policyNumber: profileRow.policy_number || fallbackProfile.policyNumber,
          coverageStatus: profileRow.coverage_status || fallbackProfile.coverageStatus,
        });
      }

      const { data: upcoming } = await client
        .from('appointments')
        .select('date,time,type,provider')
        .eq('user_id', sessionData.session.user.id)
        .order('date', { ascending: true })
        .limit(4);

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

      const { data: recentTreatments } = await client
        .from('treatments')
        .select('date,procedure,tooth,provider')
        .eq('user_id', sessionData.session.user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (recentTreatments && recentTreatments.length) {
        setTreatments(recentTreatments as TreatmentItem[]);
      }

      const { data: billingData } = await client
        .from('billing_summary')
        .select('balance,last_payment,next_invoice')
        .eq('user_id', sessionData.session.user.id)
        .maybeSingle();

      if (billingData) {
        setBilling({
          balance: billingData.balance || fallbackBilling.balance,
          lastPayment: billingData.last_payment || fallbackBilling.lastPayment,
          nextInvoice: billingData.next_invoice || fallbackBilling.nextInvoice,
        });
      }

      const { data: alerts } = await client
        .from('notifications')
        .select('message')
        .eq('user_id', sessionData.session.user.id)
        .order('created_at', { ascending: false })
        .limit(4);

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
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        },
      );
    }, dashboardRef);

    return () => ctx.revert();
  }, [currentSection]);

  const handleLogout = async () => {
    const client = supabase;
    if (!client) {
      router.push('/login');
      return;
    }

    await client.auth.signOut();
    router.push('/login');
  };

  const currentMeta = sectionMeta[currentSection];
  const documentItems = [
    {
      title: 'Insurance Verification Summary',
      detail: `${profile.insuranceProvider} | Updated for ${appointments[0]?.date || 'next visit'}`,
      status: 'Ready',
    },
    {
      title: 'Latest Treatment Record',
      detail: `${treatments[0]?.procedure || 'Treatment note'} | ${treatments[0]?.date || 'Recent'}`,
      status: 'Synced',
    },
    {
      title: 'Pre-visit Form Packet',
      detail: 'Medical history and consent documents',
      status: 'Completed',
    },
  ];
  const renderOverview = () => (
    <>
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
            <strong>{appointments[0]?.date || 'None scheduled'}</strong>
          </div>
          <div className="profile-stat">
            <span>Coverage</span>
            <strong>{profile.coverageStatus}</strong>
          </div>
          <div className="profile-stat">
            <span>Primary Provider</span>
            <strong>{appointments[0]?.provider || 'Unassigned'}</strong>
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
    </>
  );

  const renderAppointments = () => (
    <section className="dashboard-split-grid dash-section">
      <div className="card stack-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Visits</p>
            <h3>Upcoming appointment timeline</h3>
          </div>
          <CalendarDays size={18} />
        </div>
        <ul className="appointment-timeline">
          {appointments.map((item) => (
            <li key={`${item.date}-${item.time}`} className="appointment-timeline-item">
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

      <div className="dashboard-stack-col">
        <div className="card stack-card">
          <div className="card-head">
            <div>
              <p className="section-kicker">Next visit</p>
              <h3>Visit preparation</h3>
            </div>
            <ShieldCheck size={18} />
          </div>
          <div className="info-grid info-grid-single">
            <div>
              <strong>Provider</strong>
              <span>{appointments[0]?.provider || 'Not assigned yet'}</span>
            </div>
            <div>
              <strong>Service</strong>
              <span>{appointments[0]?.type || 'No upcoming appointment'}</span>
            </div>
            <div>
              <strong>Time</strong>
              <span>{appointments[0] ? `${appointments[0].date} at ${appointments[0].time}` : 'No slot booked'}</span>
            </div>
          </div>
        </div>

        <div className="card stack-card">
          <div className="card-head">
            <div>
              <p className="section-kicker">Quick actions</p>
              <h3>Manage booking</h3>
            </div>
          </div>
          <div className="dashboard-action-list">
            <Link href="/appointment" className="dashboard-link-button">
              Book a new appointment
            </Link>
            <Link href="/contact" className="dashboard-link-button dashboard-link-button-secondary">
              Contact the care team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
  const renderTreatments = () => (
    <section className="detail-grid">
      <div className="card records-card dash-section">
        <div className="card-head">
          <div>
            <p className="section-kicker">Clinical log</p>
            <h3>Completed treatments</h3>
          </div>
          <Stethoscope size={18} />
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

      <div className="card section-card dash-section">
        <div className="card-head">
          <div>
            <p className="section-kicker">History</p>
            <h3>Medical notes</h3>
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
    </section>
  );

  const renderBilling = () => (
    <section className="dashboard-split-grid dash-section">
      <div className="card stack-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Billing summary</p>
            <h3>Account balance</h3>
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

      <div className="dashboard-stack-col">
        <div className="card stack-card">
          <div className="card-head">
            <div>
              <p className="section-kicker">Insurance</p>
              <h3>Coverage details</h3>
            </div>
          </div>
          <div className="info-grid info-grid-single">
            <div>
              <strong>Provider</strong>
              <span>{profile.insuranceProvider}</span>
            </div>
            <div>
              <strong>Policy Number</strong>
              <span>{profile.policyNumber}</span>
            </div>
            <div>
              <strong>Status</strong>
              <span>{profile.coverageStatus}</span>
            </div>
          </div>
        </div>

        <div className="card stack-card">
          <div className="card-head">
            <div>
              <p className="section-kicker">Payment support</p>
              <h3>Need help with an invoice?</h3>
            </div>
          </div>
          <div className="dashboard-action-list">
            <Link href="/contact" className="dashboard-link-button">
              Contact billing support
            </Link>
            <Link href="/appointment" className="dashboard-link-button dashboard-link-button-secondary">
              Schedule a support call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  const renderDocuments = () => (
    <section className="dashboard-split-grid dash-section">
      <div className="card stack-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Records</p>
            <h3>Available documents</h3>
          </div>
          <FileText size={18} />
        </div>
        <div className="document-list">
          {documentItems.map((item) => (
            <article key={item.title} className="document-row">
              <div>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </div>
              <span className="document-status">{item.status}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="card stack-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Sharing</p>
            <h3>Document access</h3>
          </div>
          <ShieldCheck size={18} />
        </div>
        <div className="info-grid info-grid-single">
          <div>
            <strong>Patient access</strong>
            <span>Enabled for summaries, billing statements, and visit forms.</span>
          </div>
          <div>
            <strong>Care team review</strong>
            <span>Shared internally with providers and front-desk coordination staff.</span>
          </div>
          <div>
            <strong>Export route</strong>
            <span>Contact the clinic if you need records sent to another provider.</span>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="dashboard-split-grid dash-section">
      <div className="card stack-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Profile settings</p>
            <h3>Contact details</h3>
          </div>
          <UserRound size={18} />
        </div>
        <div className="settings-list">
          <div className="settings-row">
            <div>
              <strong>Email</strong>
              <span>{profile.email}</span>
            </div>
            <span>Primary</span>
          </div>
          <div className="settings-row">
            <div>
              <strong>Phone</strong>
              <span>{profile.phone}</span>
            </div>
            <span>SMS enabled</span>
          </div>
          <div className="settings-row">
            <div>
              <strong>Address</strong>
              <span>{profile.address}</span>
            </div>
            <span>Saved</span>
          </div>
        </div>
      </div>

      <div className="dashboard-stack-col">
        <div className="card stack-card">
          <div className="card-head">
            <div>
              <p className="section-kicker">Preferences</p>
              <h3>Communication settings</h3>
            </div>
          </div>
          <div className="settings-list">
            <div className="settings-row">
              <div>
                <strong>Appointment reminders</strong>
                <span>Text and email reminders before visits.</span>
              </div>
              <span>On</span>
            </div>
            <div className="settings-row">
              <div>
                <strong>Billing alerts</strong>
                <span>Invoice and payment updates.</span>
              </div>
              <span>On</span>
            </div>
            <div className="settings-row">
              <div>
                <strong>Records notifications</strong>
                <span>Secure updates when new documents are ready.</span>
              </div>
              <span>On</span>
            </div>
          </div>
        </div>

        <div className="card stack-card">
          <div className="card-head">
            <div>
              <p className="section-kicker">Security</p>
              <h3>Account controls</h3>
            </div>
          </div>
          <div className="dashboard-action-list">
            <button type="button" className="dashboard-link-button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'appointments':
        return renderAppointments();
      case 'treatments':
        return renderTreatments();
      case 'billing':
        return renderBilling();
      case 'documents':
        return renderDocuments();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
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
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {dashboardNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.key;

            return (
              <Link key={item.href} className={`nav-item${isActive ? ' active' : ''}`} href={item.href}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
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
            <p className="section-kicker">{currentMeta.kicker}</p>
            <h1>{currentMeta.title}</h1>
          </div>
          <div className="dashboard-search">
            <Search size={18} />
            <input type="search" placeholder={`Search ${currentMeta.title.toLowerCase()} details`} />
          </div>
          <div className="dashboard-actions">
            <button className="dashboard-icon-button" type="button" aria-label="Notifications">
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
                  <Image src={profile.photo} alt={profile.name} fill sizes="40px" />
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

        <section className="card dashboard-page-intro dash-section">
          <div>
            <p className="section-kicker">Current view</p>
            <h2>{currentMeta.title}</h2>
            <p>{currentMeta.description}</p>
          </div>
          <div className="dashboard-page-badges">
            <span>{profile.status}</span>
            <span>{appointments[0]?.provider || 'Provider pending'}</span>
            <span>{profile.insuranceProvider}</span>
          </div>
        </section>

        {renderSectionContent()}
      </div>
    </div>
  );
}




