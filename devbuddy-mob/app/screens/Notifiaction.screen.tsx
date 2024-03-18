import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {notificationHistory, readNotification} from '../services/api';
import {useAuthStore} from '../stores/auth';
import ScreenBg from '../components/ScreenBg.component';
import Label from '../components/Label.component';
import {stringShorter} from '../utils/helper';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../navigations';

type Props = {};
type NotificationItem = {
  title: string;
  notification: string;
  read: boolean;
  id: string;
};

const Notification: React.FC<
  StackScreenProps<RootStackParamList, 'Notification'>
> = ({route}) => {
  const notificationId = route.params?.notificationId;

  const {clientId} = useAuthStore();
  const [notifications, setNotifications] = React.useState(
    [] as NotificationItem[],
  );
  const navigation = useNavigation();

  useEffect(() => {
    const apiCall = async () => {
      const res = await notificationHistory({
        clientId: clientId,
      });
      console.log(JSON.stringify(res));
      if (res?.data?.notifications && res?.data?.notifications.length > 0) {
        setNotifications(res?.data?.notifications);
      }
    };
    apiCall();
  }, [clientId, notificationId]);

  useEffect(() => {
    if (notificationId && notifications.length > 0) {
      const notification = notifications.find(notificationItem => {
        return notificationItem.id === notificationId;
      });
      if (notification) {
        updateMessageAsRead(notification);
      }
    }
  }, [notificationId, notifications]);

  const updateMessageAsRead = async (item: NotificationItem) => {
    const res = await readNotification({
      clientId: clientId,
      id: item.id,
    });
    if (res?.data?.read) {
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === item.id) {
          notification.read = true;
        }
        return notification;
      });
      setNotifications(updatedNotifications);
    }
    const parsedNotification = parseNotification(item.notification);
    navigation.navigate('PopUp', {
      title: parsedNotification?.title,
      content: parsedNotification?.content,
    });
  };

  const parseNotification = (notification: string) => {
    return JSON.parse(notification);
  };

  const renderNotification = (item: NotificationItem) => {
    const parsedNotification = parseNotification(item.notification);

    const shortenContent = stringShorter(parsedNotification?.content);
    return (
      <>
        <TouchableOpacity
          style={styles.container}
          onPress={() => updateMessageAsRead(item)}>
          <Label label={parsedNotification?.title} weight="bold" />
          <Label label={shortenContent} weight="normal" />
        </TouchableOpacity>
        {!item?.read ? <View style={styles.notReadDot} /> : null}
      </>
    );
  };
  console.log('notifications', notifications);

  return (
    <ScreenBg>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Label label="Waiting for notifications!" weight="light" />
        </View>
      ) : (
        <FlatList
          data={notifications.reverse()}
          renderItem={({item}) => renderNotification(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </ScreenBg>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    margin: 10,
    backgroundColor: '#d4d4d430',
    borderRadius: 5,
  },
  notReadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
