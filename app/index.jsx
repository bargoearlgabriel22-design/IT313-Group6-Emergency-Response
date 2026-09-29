import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Root Index Route (app/index.jsx)
 * 
 * Automatically redirects the user to the Home / Dashboard tab.
 */
export default function Index() {
  return <Redirect href="/dashboard" />;
}
