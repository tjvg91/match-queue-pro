import { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function RadialTimer({ duration = 3, size = 120, strokeWidth = 8, strokeColor = Colors.primary, fontSize = 35, onFinish }: {
  duration?: number,
  size?: number,
  strokeWidth?: number,
  strokeColor?: string,
  fontSize?: number,
  onFinish?: () => void;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(circumference);

  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Animate radial bar smoothly
    progress.value = withTiming(0, { duration: duration * 1000 });

    // Update text once per second (accurate countdown)
    let current = duration;
    setTimeLeft(current);
    const interval = setInterval(() => {
      current -= 1;
      setTimeLeft(current);
      if (current <= 0) {
        clearInterval(interval);
        if (onFinish) {
          onFinish(); // ✅ Trigger callback
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: progress.value,
  }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center", position: "relative" }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={strokeColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <ThemedText
        fontSize={fontSize}
        type="bold"
        color={Colors.secondary}
        style={{ position: "absolute", top: '50%', left: '50%', transform: [{ translateX: '-50%' }, { translateY: '-50%' }] }}>
        {timeLeft}
      </ThemedText>
    </View>
  );
}
