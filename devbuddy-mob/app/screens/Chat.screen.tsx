import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';

import Input from '../components/Input.component';
import Label from '../components/Label.component';
import {RootStackParamList} from '../navigations';
import ScreenBg from '../components/ScreenBg.component';
import {chatHistory, gptCall} from '../services/api';
import {useAuthStore} from '../stores/auth';
import ToggleNotification from '../components/ToggleNotification.component';

export type ChatScreenParams = {
  Chat: {
    title: string;
    bg: string;
    textColor: string;
  };
};

type MessageThread = {
  from: string;
  message: string;
};

const ChatScreen: React.FC<StackScreenProps<RootStackParamList, 'Chat'>> = ({
  route,
  navigation,
}) => {
  const {title, bg, textColor} = route.params;
  const {clientId} = useAuthStore();
  const [message, setMessage] = useState('' as string);
  const [messageThread, setMessageThread] = useState([] as MessageThread[]);
  const [notifyMe, setNotifyMe] = useState(false as boolean);
  const [loading, setLoading] = useState(false as boolean);

  // Set header title

  const ToggleNotificationComponent = useCallback(() => {
    return (
      <ToggleNotification
        area={title}
        clientID={clientId}
        thumbColor={textColor}
        state={notifyMe}
      />
    );
  }, [clientId, notifyMe, textColor, title]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
      headerTintColor: '#fff',
      headerRight: ToggleNotificationComponent,
    });
  }, [navigation, title, bg, textColor, clientId, ToggleNotificationComponent]);

  const renderActionButton = () => {
    return (
      <TouchableOpacity
        onPress={() => onSendMessage()}
        style={[styles.sendBtn, {backgroundColor: bg}]}>
        <Label label="Send" weight="bold" style={{color: textColor}} />
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    getChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, title]);

  const getChatHistory = async () => {
    setLoading(true);
    const res = await chatHistory({
      area: title,
      clientId: clientId,
    });
    const chatContent = res?.data?.content?.content;
    setNotifyMe(res?.data?.content?.notifyMe);
    if (chatContent && chatContent.length > 0) {
      setLoading(false);
      chatContent.reverse();
      const updatedMessageThread = [] as MessageThread[];
      for (let i = 0; i < chatContent.length; i++) {
        if (chatContent[i].generatedContent) {
          updatedMessageThread.push({
            from: 'bot',
            message: chatContent[i].generatedContent,
          });
        }
        if (chatContent[i].message) {
          updatedMessageThread.push({
            from: 'user',
            message: chatContent[i].message,
          });
        }
      }
      setMessageThread(prevMessageThread => [
        ...prevMessageThread,
        ...updatedMessageThread,
      ]);
    }
    setLoading(false);
  };

  const onSendMessage = async () => {
    if (message.trim().length > 0) {
      setLoading(true);
      // Append user message to the bottom
      setMessageThread(prevMessageThread => [
        {
          from: 'user',
          message: message,
        },
        ...prevMessageThread,
      ]);

      const res = await gptCall({
        area: title,
        clientId: clientId,
        prompt: message,
      });

      if (res?.data?.content) {
        setLoading(false);
        // Append bot message to the bottom
        setMessageThread(prevMessageThread => [
          {
            from: 'bot',
            message: res.data.content,
          },
          ...prevMessageThread,
        ]);
      }

      setMessage(''); // Clear input field
    }
  };

  return (
    <ScreenBg>
      <View style={styles.container}>
        <FlatList
          data={messageThread}
          renderItem={({item}) => {
            return (
              <View
                style={[
                  styles.chatFlat,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: item.from === 'user' ? '#d4d4d430' : bg,
                    alignSelf: item.from === 'user' ? 'flex-end' : 'flex-start',
                  },
                ]}>
                <Label
                  label={item.message}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{color: item.from === 'user' ? '#000' : textColor}}
                />
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          inverted
        />
      </View>
      {loading ? (
        <LottieView
          source={require('../../assets/typring.json')}
          autoPlay
          loop
          style={styles.typing}
        />
      ) : null}
      <View style={styles.typeContainer}>
        <Input
          placeholder="Type a message"
          keyboardType="default"
          onChangeText={(text: string) => setMessage(text)}
          value={message}
          actionButton={renderActionButton()}
        />
      </View>
    </ScreenBg>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  typeContainer: {
    backgroundColor: '#d4d4d430',
    paddingHorizontal: 8,
  },
  sendBtn: {
    height: 49.8,
    width: 70,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatFlat: {
    padding: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  typing: {
    width: 80,
    height: 20,
  },
});
