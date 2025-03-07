import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`pt-12 min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;
