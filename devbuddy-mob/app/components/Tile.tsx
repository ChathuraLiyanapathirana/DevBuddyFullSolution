import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  onPress: () => void;
  bg: string;
  textColor: string;
};

const Tile = ({bg, onPress, textColor, title}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: bg}]}
      onPress={onPress}>
      <Text style={[styles.title, {color: textColor}]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Tile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
