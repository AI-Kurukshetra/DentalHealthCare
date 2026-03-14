import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { supabaseServerClient } from '../../lib/supabaseServerClient';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return children;
}
