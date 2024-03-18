import {StyleSheet, Switch, View} from 'react-native';
import React, {useEffect} from 'react';
import Label from './Label.component';
import {enableNotification} from '../services/api';

type Props = {
  thumbColor: string;
  clientID: string;
  area: string;
  state: boolean;
};

const ToggleNotification = ({area, clientID, thumbColor, state}: Props) => {
  const [isEnabled, setIsEnabled] = React.useState(state);
  useEffect(() => {
    setIsEnabled(state);
  }, [state]);

  const toggleSwitchEffect = async () => {
    const newIsEnabled = !isEnabled;
    setIsEnabled(newIsEnabled);
    try {
      if (clientID && area) {
        await enableNotification({
          clientId: clientID,
          area: area,
          state: newIsEnabled,
        });
      }
      console.log('Notification state updated', {
        clientId: clientID,
        area: area,
        state: newIsEnabled,
      });
    } catch (error) {
      // Handle errors here
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Label label="Notify Me" weight="bold" />
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? thumbColor : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitchEffect}
        value={isEnabled}
      />
    </View>
  );
};

export default ToggleNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});
