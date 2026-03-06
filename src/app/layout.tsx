import React from 'react';
import { Provider } from 'next-auth/client';
import '@/styles/globals.css'; // Assuming globals.css is the global stylesheet
import { Navbar } from '@/components/Navbar'; // Assuming you have a Navbar component
import { Footer } from '@/components/Footer'; // Assuming you have a Footer component

export const metadata = {
  title: 'AI Streamline',
  description: 'Effortlessly automate AI workflows for small teams.',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider session={null}>
      <div className="container">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </Provider>
  );
};

export default Layout;