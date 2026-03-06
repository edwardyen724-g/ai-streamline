import React from 'react';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Streamline',
  description: 'Effortlessly automate AI workflows for small teams.',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <main className={inter.className}>
        <header>
          <h1>Automate and Manage Your AI Workflows with Ease</h1>
        </header>
        {children}
      </main>
    </AuthProvider>
  );
};

export default Layout;