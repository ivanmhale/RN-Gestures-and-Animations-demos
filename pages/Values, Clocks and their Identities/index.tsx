import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import Animated, {
  add,
  Clock,
  cond,
  eq,
  Extrapolate,
  interpolate,
  not,
  set,
  startClock,
  useCode,
  Value,
  proc,
} from 'react-native-reanimated';
import { useClock, useValues } from 'react-native-redash';
import Card from '../components/Card';

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const duration = 1000;

const runAnimation = proc(
  (
    startAnimation: Animated.Value<number>,
    clock: Animated.Clock,
    startTime: Animated.Value<number>,
    from: Animated.Value<number>,
    opacity: Animated.Node<number>,
    to: Animated.Value<number>
  ) =>
    cond(eq(startAnimation, 1), [
      startClock(clock),
      set(startTime, clock),
      set(from, opacity),
      set(to, not(to)),
      set(startAnimation, 0),
    ])
);

export default () => {
  const [show, setShow] = useState(true);

  const startAnimation = new Value<number>(1);
  //   const clock = new Clock();
  const clock = useClock();
  const [startTime, from, to] = useValues(0, 0, 0);

  const endTime = add(startTime, duration);

  const opacity = interpolate(clock, {
    inputRange: [startTime, endTime],
    outputRange: [from, to],
    extrapolate: Extrapolate.CLAMP,
  });

  useCode(
    () => runAnimation(startAnimation, clock, startTime, from, opacity, to),
    [show]
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View style={{ opacity }}>
          <Card />
        </Animated.View>
      </View>
      <Button onPress={() => setShow(!show)} title={show ? 'Hide' : 'Show'} />
    </View>
  );
};
