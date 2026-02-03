import React from 'react';
import AntLayout from './AntLayout';

/**
 * =============================================================================
 * MAIN APP LAYOUT COMPONENT
 * =============================================================================
 */

/**
 * AppLayout - Main layout wrapper component
 * 
 * This component now uses the new Ant Design layout system
 * while maintaining backward compatibility with existing pages
 */
export default function AppLayout({ children, ...props }) {
  return (
    <AntLayout {...props}>
      {children}
    </AntLayout>
  );
}

