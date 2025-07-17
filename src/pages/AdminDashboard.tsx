import React from 'react';
import { EnhancedAdminDashboard } from '@/components/admin/EnhancedAdminDashboard';
import { HealthLayout } from '@/components/layout/HealthLayout';

export const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard component rendering - using enhanced dashboard');
  
  return (
    <HealthLayout 
      showHealthStats={true} 
      enableQuickAccess={true}
      className="admin-dashboard"
    >
      <EnhancedAdminDashboard />
    </HealthLayout>
  );
};
