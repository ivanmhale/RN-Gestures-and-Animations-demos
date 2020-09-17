import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  add,
  and,
  block,
  Clock,
  clockRunning,
  cond,
  decay,
  eq,
  not,
  set,
  startClock,
  stopClock,
  Value,
} from 'react-native-reanimated';
import StyleGuide from '../components/StyleGuide';
import Card, { cards, CARD_HEIGHT, CARD_WIDTH } from '../components/Card';
import { diffClamp, onGestureEvent, withOffset } from 'react-native-redash';

const [card] = cards;

const { width, height } = Dimensions.get('window');
const [containerWidth, containerHeight] = [width, height];

const withDecay = (
  value: Animated.Value<number>,
  gestureState: Animated.Value<State>,
  offset: Animated.Value<number>,
  velocity: Animated.Value<number>
) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity,
    position: new Value(0),
    time: new Value(0),
  };
  const config = {
    deceleration: 0.998,
  };
  return block([
    cond(eq(gestureState, State.BEGAN), [
      set(offset, state.position),
      stopClock(clock),
    ]),
    cond(
      eq(gestureState, State.END),
      [
        cond(and(not(clockRunning(clock)), not(state.finished)), [
          set(state.time, 0),
          startClock(clock),
        ]),
        decay(clock, state, config),
        cond(state.finished, [set(offset, state.position), stopClock(clock)]),
      ],
      [set(state.finished, 0), set(state.position, add(offset, value))]
    ),
    state.position,
  ]);
  //   return cond(
  //     eq(state, State.END),
  //     [set(offset, add(offset, value)), offset],
  //     add(offset, value)
  //   );
};

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const offsetX = new Value((containerWidth - CARD_WIDTH) / 2);
  const offsetY = new Value((containerHeight - CARD_HEIGHT) / 2);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY,
  });

  const translateX = diffClamp(
    withDecay(translationX, state, offsetX, velocityX),
    0,
    containerWidth - CARD_WIDTH
  );
  const translateY = diffClamp(
    withDecay(translationY, state, offsetY, velocityY),
    0,
    containerHeight - CARD_HEIGHT
  );

  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            transform: [{ translateX }, { translateY }],
          }}
        >
          <Card {...{ card }} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
  },
});
