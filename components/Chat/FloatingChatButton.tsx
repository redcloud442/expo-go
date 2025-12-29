import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet } from "react-native";
import { Surface, useTheme } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const FAB_SIZE = 60;
const SAFE_MARGIN = 16;
const TAB_BAR_HEIGHT = 90;

export function FloatingChatButton() {
  const theme = useTheme();
  const router = useRouter();

  // Track position safely
  const position = useRef({
    x: width - FAB_SIZE - SAFE_MARGIN,
    y: height - TAB_BAR_HEIGHT - FAB_SIZE,
  });

  const pan = useRef(new Animated.ValueXY(position.current)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.setOffset(position.current);
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();

        const isTap = Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5;

        if (isTap) {
          router.push("/private/(chat)/new");
          return;
        }

        // Snap horizontally
        const snapX =
          gesture.moveX > width / 2
            ? width - FAB_SIZE - SAFE_MARGIN
            : SAFE_MARGIN;

        // Clamp vertical
        const minY = SAFE_MARGIN;
        const maxY = height - TAB_BAR_HEIGHT - FAB_SIZE - SAFE_MARGIN;

        const snapY = Math.min(
          Math.max(gesture.moveY - FAB_SIZE / 2, minY),
          maxY
        );

        position.current = { x: snapX, y: snapY };

        Animated.spring(pan, {
          toValue: position.current,
          tension: 120,
          friction: 14,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.container, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <Surface
        elevation={6 as any}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
      >
        <Ionicons name="chatbox-ellipses" size={28} color="white" />
      </Surface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 9999,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
