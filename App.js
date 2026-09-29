// App.js – Home Screen (minimal wiring for Member 2's LocationCard)
import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LocationCard from './components/LocationCard';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>🚨 Community Emergency Response Assistant</Text>

        {/* Member 2 – GPS / Location Feature */}
        <LocationCard title="Emergency Location" theme="light" />
        <LocationCard title="Responder Location" theme="dark" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#e74c3c',
  },
});
