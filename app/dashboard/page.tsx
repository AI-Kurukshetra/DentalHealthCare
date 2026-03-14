import { redirect } from 'next/navigation';
import { DashboardClient } from '../../components/DashboardClient';
import { supabaseServerClient } from '../../lib/supabaseServerClient';

export default async function DashboardPage() {
  const supabase = await supabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <DashboardClient />;
}
