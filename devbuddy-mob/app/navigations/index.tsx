import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from '../screens/SignIn.screen';
import HomeScreen from '../screens/Home.screen';
import ChatScreen, {ChatScreenParams} from '../screens/Chat.screen';
import {useAuthStore} from '../stores/auth';
import NotificationScreen from '../screens/Notifiaction.screen';
import {serverSignOut} from '../services/api';
import PopUpScreen, {PopUpParams} from '../screens/NotifiactionPopUp.screen';
import {useNotificationStore} from '../stores/notification';
import Label from '../components/Label.component';

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  Notification: {notificationId?: string};
  PopUp: PopUpParams;
  Chat: ChatScreenParams['Chat'];
};

const HomeStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator();

const RootNavigation = () => {
  const {signOut, clientId} = useAuthStore();
  const {notificationReceived} = useNotificationStore();

  const navigation = useNavigation();

  const logOut = useCallback(async () => {
    const res = await serverSignOut({clientId: clientId});
    if (res?.data?.logout) {
      await auth().signOut();
      signOut();
    }
  }, [clientId, signOut]);

  const renderSignOutButton = useCallback(() => {
    return (
      <View style={styles.rightButtonContent}>
        <TouchableOpacity
          style={styles.rightBtn}
          onPress={() => navigation.navigate('Notification' as never)}>
          {notificationReceived ? (
            <Icon name="notifications-active" size={25} color="#fff" />
          ) : (
            <Icon name="notifications" size={25} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightBtn} onPress={() => logOut()}>
          <Icon name="logout" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }, [logOut, navigation, notificationReceived]);

  const renderHeaderTitle = useCallback(() => {
    return (
      <View style={styles.title}>
        <Label label="teach" size={30} weight="bold" />
        <Label label="Me" size={30} weight="light" />
      </View>
    );
  }, []);

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4c669f',
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => renderHeaderTitle(),
          headerTintColor: '#fff',
          headerRight: () => renderSignOutButton(),
        }}
      />
      <HomeStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          title: 'Notifications',
          headerTintColor: '#fff',
        }}
      />
      <HomeStack.Screen
        name="PopUp"
        component={PopUpScreen}
        options={{
          title: 'Grab New Knowledge!',
          headerTintColor: '#fff',
        }}
      />
      <HomeStack.Screen name="Chat" component={ChatScreen} />
    </HomeStack.Navigator>
  );
};

const AuthNavigation = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{header: () => null}}
      />
    </AuthStack.Navigator>
  );
};

export {RootNavigation, AuthNavigation};

const styles = StyleSheet.create({
  rightBtn: {
    marginRight: 15,
  },
  rightButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
