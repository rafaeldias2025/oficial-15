import React from 'react';
import { CollapsibleSidebar } from './CollapsibleSidebar';

interface ResponsiveLayoutProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  activeSection,
  onSectionChange,
  children
}) => {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <CollapsibleSidebar 
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
      
      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
