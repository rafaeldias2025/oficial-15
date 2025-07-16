import React from 'react';
import { EnhancedAdminDashboard } from '@/components/admin/EnhancedAdminDashboard';

export const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard component rendering - using enhanced dashboard');
  
  return <EnhancedAdminDashboard />;
};
