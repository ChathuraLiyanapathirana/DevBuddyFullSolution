import React from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  children: React.ReactNode;
};

const ScreenBg = ({children}: Props) => {
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={{flex: 1}}>
      {children}
    </LinearGradient>
  );
};

export default ScreenBg;
