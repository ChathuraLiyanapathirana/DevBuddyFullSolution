import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import ScreenBg from '../components/ScreenBg.component';
import Label from '../components/Label.component';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../navigations';

export type PopUpParams = {
  title: string;
  content: string;
};

const PopUpScreen: React.FC<StackScreenProps<RootStackParamList, 'PopUp'>> = ({
  route,
}) => {
  const {title, content} = route.params;

  return (
    <ScreenBg>
      <ScrollView style={styles.container}>
        <View style={styles.title}>
          <Label label={title} weight="bold" size="large" />
        </View>
        <View>
          <Label label={content} weight="normal" />
        </View>
      </ScrollView>
    </ScreenBg>
  );
};

export default PopUpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
});
