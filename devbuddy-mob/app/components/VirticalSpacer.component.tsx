import {View, ViewStyle} from 'react-native';
import React from 'react';

type Props = {
  height?: number | string;
  flex?: number;
};

const VerticalSpacer = ({height, flex}: Props) => {
  const getProperty = () => {
    if (height) {
      return {height: height} as ViewStyle;
    }
    if (flex) {
      return {flex: flex} as ViewStyle;
    }
    return {height: 20} as ViewStyle;
  };
  return <View style={getProperty()} />;
};

export default VerticalSpacer;
