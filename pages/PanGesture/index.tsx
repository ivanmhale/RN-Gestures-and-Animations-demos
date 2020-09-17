import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { add, cond, eq, set, Value } from 'react-native-reanimated';
import StyleGuide from '../components/StyleGuide';
import Card, { cards, CARD_HEIGHT, CARD_WIDTH } from '../components/Card';
import { diffClamp, onGestureEvent, withOffset } from 'react-native-redash';

const [card] = cards;

const { width, height } = Dimensions.get('window');
const [containerWidth, containerHeight] = [width, height];

const withOffest = (
  value: Animated.Value<number>,
  state: Animated.Value<State>,
  offset: Animated.Value<number>
) => {
  return cond(
    eq(state, State.END),
    [set(offset, add(offset, value)), offset],
    add(offset, value)
  );
};

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const offsetX = new Value((containerWidth - CARD_WIDTH) / 2);
  const offsetY = new Value((containerHeight - CARD_HEIGHT) / 2);
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
  });

  const translateX = diffClamp(
    withOffset(translationX, state, offsetX),
    0,
    containerWidth - CARD_WIDTH
  );
  const translateY = diffClamp(
    withOffest(translationY, state, offsetY),
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
