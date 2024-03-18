import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {
  label: string;
  style?: any;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large' | number;
  weight?: 'light' | 'normal' | 'bold';
};

const Label = ({
  label,
  style,
  variant,
  size,
  weight,
}: Props): React.JSX.Element => {
  const getVariant = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      default:
        return styles.default;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      case 'large':
        return styles.large;
      default:
        return {fontSize: size};
    }
  };

  const getWeight = () => {
    switch (weight) {
      case 'light':
        return styles.light;
      case 'bold':
        return styles.bold;
      default:
        return styles.normal;
    }
  };

  return (
    <View>
      <Text style={[styles.label, getVariant(), getSize(), getWeight(), style]}>
        {label}
      </Text>
    </View>
  );
};

export default Label;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
  },
  primary: {
    color: '#3f51b5',
  },
  secondary: {
    color: '#607d8b',
  },
  default: {
    color: 'white',
  },
  small: {
    fontSize: 12,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 20,
  },
  light: {
    fontWeight: '200',
  },
  normal: {
    fontWeight: '400',
  },
  bold: {
    fontWeight: '700',
  },
});
