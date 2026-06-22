//layout
import React from 'react';
import Header from './Header';

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export default function NavigationLayout({ children }: NavigationLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Your exact-match navigation bar */}
      <Header />

      {/* The main content of whatever page is currently active */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Your footer component */}
      
    </div>
  );
}