import React from 'react';
import { Redirect } from 'expo-router';

/**
 * ============================================================================
 * ROOT ROUTE ENTRY (app/index.jsx)
 * ============================================================================
 * 
 * Layer: Presentation Layer / Main Navigation (Member 1)
 * Purpose: Entry point that automatically redirects the user to the
 *          Dashboard (Home) screen within the 3-tab navigation hierarchy.
 */
export default function Index() {
  return <Redirect href="/dashboard" />;
}
