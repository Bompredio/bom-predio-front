'use client';

import { useAuth } from '@/hooks/useAuth';
import DashboardMorador from './components/DashboardMorador';
import DashboardSindico from './components/DashboardSindico';
import DashboardPrestador from './components/DashboardPrestador';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    const fetchUserType = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
        setUserType(data?.user_type || 'morador');
      }
    };
    fetchUserType();
  }, [user]);

  const renderDashboard = () => {
    switch (userType) {
      case 'sindico':
        return <DashboardSindico />;
      case 'prestador':
        return <DashboardPrestador />;
      default:
        return <DashboardMorador />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {renderDashboard()}
    </div>
  );
}
