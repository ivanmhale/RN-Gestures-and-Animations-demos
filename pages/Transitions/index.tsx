import React, { useRef, useState } from 'react';
import { FlexibleCard, cards } from '../components/Card';
import Selection from '../components/Selection';
import {
  View,
  StyleSheet,
  Dimensions,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import StyleGuide from '../components/StyleGuide';
import {
  Transition,
  Transitioning,
  TransitioningView,
} from 'react-native-reanimated';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: { flex: 1 },
});

interface Layout {
  id: string;
  name: string;
  layout: {
    container: ViewStyle;
    child?: ImageStyle;
  };
}

const layouts: Layout[] = [
  {
    id: 'column',
    name: 'Column',
    layout: {
      container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  },
  {
    id: 'row',
    name: 'Row',
    layout: {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
  },
  {
    id: 'wrap',
    name: 'Wrap',
    layout: {
      container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      child: {
        flex: 0,
        width: width / 2 - StyleGuide.spacing * 2,
      },
    },
  },
];

const transition = (
  <Transition.Change durationMs={400} interpolation="easeInOut" />
);

export default () => {
  const [currentLayout, setCurrentLayout] = useState<Layout>(layouts[0]);
  const ref = useRef<TransitioningView>(null);

  return (
    <>
      <Transitioning.View
        {...{ ref, transition }}
        style={[styles.container, currentLayout.layout.container]}
      >
        {cards.map((card) => (
          <FlexibleCard
            key={card.id}
            style={currentLayout.layout.child}
            {...{ card }}
          />
        ))}
      </Transitioning.View>
      {layouts.map((layout) => (
        <Selection
          key={layout.id}
          name={layout.name}
          isSelected={layout === currentLayout}
          onPress={() => {
            if (ref.current) {
              ref.current.animateNextTransition();
            }
            setCurrentLayout(layout);
          }}
        />
      ))}
    </>
  );
};
