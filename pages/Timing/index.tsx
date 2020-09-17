import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import ChatBubble from '../components/ChatBubble';
import { useClock, useValue } from 'react-native-redash';
import {
  block,
  Clock,
  Easing,
  set,
  startClock,
  useCode,
  Value,
  timing,
  cond,
  eq,
  not,
  and,
  clockRunning,
  stopClock,
} from 'react-native-reanimated';

const runTiming = (clock: Clock) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
  };
  const config = {
    toValue: new Value(1),
    duration: 1000,
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config)
    ),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(config.toValue, not(state.position)),
    ]),
    state.position,
  ]);
};

export default () => {
  const [play, setPlay] = useState(false);
  const isPlaying = useValue(0);

  useCode(() => [set(isPlaying, play ? 1 : 0)], [play]);

  const progress = useValue(0);
  const clock = useClock();

  useCode(
    () => [
      cond(and(isPlaying, not(clockRunning(clock))), startClock(clock)),
      cond(and(not(isPlaying), clockRunning(clock)), stopClock(clock)),
      set(progress, runTiming(clock)),
    ],
    []
  );

  return (
    <View style={styles.container}>
      <ChatBubble {...{ progress }} />
      <Button onPress={() => setPlay(!play)} title={play ? 'Pause' : 'Play'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
