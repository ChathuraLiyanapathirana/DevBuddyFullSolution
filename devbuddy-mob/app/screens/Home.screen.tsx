import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';

import {TILES} from '../constants/appConstants';
import Tile from '../components/Tile';
import ScreenBg from '../components/ScreenBg.component';
import {RootStackParamList} from '../navigations';
import {useNotificationStore} from '../stores/notification';

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {setNotificationReceived, notificationReceived} =
    useNotificationStore();

  useEffect(() => {
    const handleStateNotification = async (remoteMessage: any) => {
      console.log('Notification received:', remoteMessage);
      const notificationId = remoteMessage.data?.notificationId;
      if (typeof notificationId === 'string') {
        setNotificationReceived(notificationId);
      } else {
        console.error('Invalid notificationId received:', notificationId);
      }
    };

    // Handle foreground notifications
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      await handleStateNotification(remoteMessage);
    });

    // Handle background notifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification received:', remoteMessage);
      await handleStateNotification(remoteMessage);
    });

    const unsubscribeInitialNotification = messaging().onNotificationOpenedApp(
      remoteMessage => {
        const notificationId = remoteMessage.data?.notificationId;
        if (typeof notificationId === 'string') {
          navigation.navigate('Notification', {
            notificationId: notificationId,
          });
        } else {
          console.error('Invalid notificationId received:', notificationId);
        }
      },
    );

    // Handle notifications when the app is opened from a notification click
    const handleOpenedApp = async () => {
      const initialNotification = await messaging().getInitialNotification();

      if (initialNotification) {
        const notificationId = initialNotification.data?.notificationId;
        if (typeof notificationId === 'string') {
          navigation.navigate('Notification', {
            notificationId: notificationId,
          });
        } else {
          console.error('Invalid notificationId received:', notificationId);
        }
      }
    };

    handleOpenedApp();

    return () => {
      unsubscribeForeground();
      unsubscribeInitialNotification();
    };
  }, [navigation, setNotificationReceived, notificationReceived]);

  return (
    <ScreenBg>
      <View style={styles.container}>
        <FlatList
          data={TILES}
          renderItem={({item}) => (
            <Tile
              title={item.title}
              bg={item.bg}
              textColor={item.textColor}
              onPress={() => {
                navigation.navigate('Chat', {
                  title: item.title,
                  bg: item.bg,
                  textColor: item.textColor,
                });
              }}
            />
          )}
          keyExtractor={item => item.title}
          numColumns={2}
          horizontal={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </ScreenBg>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    marginHorizontal: 8,
  },
  flatListContainer: {
    paddingVertical: 8,
  },
});
