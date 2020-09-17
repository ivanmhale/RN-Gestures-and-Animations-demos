import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Basics from './pages/Values, Clocks and their Identities';
import Transitions from './pages/Transitions';
import UseTransition from './pages/useTransition';
import Timing from './pages/Timing';
import PanGesture from './pages/PanGesture';
import Decay from './pages/Decay';
import Spring from './pages/Spring';
import Swiping from './pages/Swiping';

export default function App() {
  return (
    <>
      <StatusBar hidden />
      <Swiping />
      {/* <Spring /> */}
      {/* <Decay /> */}
      {/* <PanGesture /> */}
      {/* <Timing /> */}
      {/* <UseTransition /> */}
      {/* <Transitions /> */}
      {/* <Basics /> */}
    </>
  );
}

const styles = StyleSheet.create({});
