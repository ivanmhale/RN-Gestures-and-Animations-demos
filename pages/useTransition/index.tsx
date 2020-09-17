import React, { useState } from 'react';
import Card, { cards } from '../components/Card';
import { View, StyleSheet, Dimensions, Button } from 'react-native';
import StyleGuide from '../components/StyleGuide';
import Animated, {
  Extrapolate,
  interpolate,
  multiply,
} from 'react-native-reanimated';
import { useTransition } from 'react-native-redash';

const width = Dimensions.get('window').width;

const transformOrigin = -(width / 2 - StyleGuide.spacing * 2);

export default () => {
  const [toggled, setToggled] = useState<0 | 1>(0);
  const transition = useTransition(toggled);

  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        // var direction = 0;
        // if (index === 0) {
        //   direction = -1;
        // } else if (index === 2) {
        //   direction = 1;
        // }

        const direction = interpolate(index, {
          inputRange: [0, 1, 2],
          outputRange: [-1, 0, 1],
          extrapolate: Extrapolate.CLAMP,
        });

        // const rotate = direction * (toggled ? Math.PI / 6 : 0);
        const rotate = multiply(
          direction,
          interpolate(transition, {
            inputRange: [0, 1],
            outputRange: [0, Math.PI / 6],
          })
        );

        return (
          <Animated.View
            style={[
              styles.overlay,
              {
                transform: [
                  { translateX: transformOrigin },
                  { rotate },
                  { translateX: -transformOrigin },
                ],
              },
            ]}
            key={index}
          >
            <Card {...{ card }} />
          </Animated.View>
        );
      })}
      <Button
        title="Start"
        // @ts-ignore
        onPress={() => setToggled(toggled ^ 1)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
