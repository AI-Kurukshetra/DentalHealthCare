import type { Metadata } from 'next';
import { Hind } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const hind = Hind({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind'
});

export const metadata: Metadata = {
  title: 'Dentora Cloud | Dental Practice Management System',
  description:
    'Modern dental practice management software with patient records, scheduling, billing, treatment planning, and compliance.',
  keywords: ['Dental PMS', 'Dental Practice Management', 'Supabase', 'Scheduling', 'Billing'],
  openGraph: {
    title: 'Dentora Cloud',
    description: 'Unify dental operations with a cloud-native practice management system.',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hind.variable}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
