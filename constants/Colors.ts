/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const primary = '#176980';
const secondary = '#268995';

const blue = '#77c9f6';
const darkBlue = '#002145';
const green = '#0eaa42';
const darkGreen = '#01452c';
const red = '#f6bcbc';
const darkRed = '#bf1515';
const yellow = '#efb034';
const darkOrange = '#bd632f';
const orange = '#f7b48e';

const gradientStopper = '#128961';
const gradientStopperLight = '#66f0b9';

const textColor = '#ffffff';
const textColor2 = '#5dff94';
const label = '#ffffff80'; // 50% opacity for labels
const gray = '#b5b5b5ff';
const darkGray = '#575656ff';

const modalBackdrop = '#00000088';

const primaryGradient = `linear-gradient(-45deg, ${green} 0%, ${gradientStopper} 34%, ${primary} 100%)`;

export const Colors = {
  primary,
  secondary,
  blue,
  darkBlue,
  green,
  darkGreen,
  red,
  darkRed,
  yellow,
  orange,
  darkOrange,
  label,
  gray,
  darkGray,
  gradientStopper,
  gradientStopperLight,
  textColor,
  textColor2,
  modalBackdrop,
  light: {
    text: textColor,
    background: primaryGradient,
    icon: textColor2,
  },
  dark: {
    text: textColor,
    background: primaryGradient,
    icon: textColor2,
  },
};
