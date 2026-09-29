// components/LocationCard.jsx
// Member 2 - GPS / Location & Permission Handling
// Reusable card component that displays location data from the location service.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { getCurrentLocation } from '../services/location';

/**
 * LocationCard – Reusable component that shows GPS coordinates.
 *
 * Props:
 *   title  (string) – Heading text displayed at the top of the card.
 *                     Default: "Current Location"
 *   theme  (string) – Color theme for the card: 'light' or 'dark'.
 *                     Default: "light"
 */
export default function LocationCard({ title = 'Current Location', theme = 'light' }) {
  const [location, setLocation] = useState(null);   // { latitude, longitude } or { error }
  const [loading, setLoading] = useState(false);

  // Called when the user presses "Get My Location"
  const handleGetLocation = async () => {
    setLoading(true);
    setLocation(null);

    const result = await getCurrentLocation();   // All logic is in the service
    setLocation(result);

    setLoading(false);
  };

  // Choose card background based on the theme prop
  const cardStyle = theme === 'dark' ? styles.cardDark : styles.cardLight;
  const textStyle = theme === 'dark' ? styles.textDark : styles.textLight;

  return (
    <View style={[styles.card, cardStyle]}>
      {/* Title – controlled by the `title` prop */}
      <Text style={[styles.title, textStyle]}>{title}</Text>

      {/* Fetch button */}
      <TouchableOpacity style={styles.button} onPress={handleGetLocation} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Fetching…' : 'Get My Location'}</Text>
      </TouchableOpacity>

      {/* Loading spinner */}
      {loading && <ActivityIndicator style={styles.spinner} color="#e74c3c" />}

      {/* Show coordinates if available */}
      {location && !location.error && (
        <View style={styles.result}>
          <Text style={[styles.coordLabel, textStyle]}>Latitude</Text>
          <Text style={[styles.coordValue, textStyle]}>{location.latitude.toFixed(6)}</Text>

          <Text style={[styles.coordLabel, textStyle]}>Longitude</Text>
          <Text style={[styles.coordValue, textStyle]}>{location.longitude.toFixed(6)}</Text>
        </View>
      )}

      {/* Show denial / error message gracefully */}
      {location && location.error && (
        <Text style={styles.errorText}>{location.error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLight: {
    backgroundColor: '#ffffff',
  },
  cardDark: {
    backgroundColor: '#2c3e50',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  textLight: {
    color: '#2c3e50',
  },
  textDark: {
    color: '#ecf0f1',
  },
  button: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  spinner: {
    marginBottom: 8,
  },
  result: {
    marginTop: 8,
  },
  coordLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    opacity: 0.6,
  },
  coordValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 8,
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
  },
});
