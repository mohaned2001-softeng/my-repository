
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { LabProvider } from '@/contexts/LabContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <LabProvider>
        <AppLayout />
      </LabProvider>

    </AppProvider>
  );
};

export default Index;
