import React, {useCallback, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth, {firebase} from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import Input from '../components/Input.component';
import VerticalSpacer from '../components/VirticalSpacer.component';
import Label from '../components/Label.component';
import ScreenBg from '../components/ScreenBg.component';
import {setAccess} from '../services/api';
import {useAuthStore} from '../stores/auth';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const SignIn = (): React.JSX.Element => {
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = React.useState(false as boolean);
  const [email, setEmail] = React.useState('' as string);
  const [password, setPassword] = React.useState('' as string);
  const [confirmPassword, setConfirmPassword] = React.useState('' as string);
  const [fcmToken, setFcmToken] = React.useState('' as string);

  const {signIn} = useAuthStore();

  useEffect(() => {
    const setTheToken = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      setFcmToken(token);
    };
    setTheToken();
  }, []);

  const onPressSignUpSubmit = useCallback(() => {
    auth()
      .createUserWithEmailAndPassword(email, confirmPassword)
      .then(userCredentials => {
        setAccess({
          nToken: fcmToken,
          clientId: userCredentials?.user?.uid,
        }).then(() => {
          signIn();
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }, [email, confirmPassword, fcmToken, signIn]);

  const onPressSignInSubmit = useCallback(() => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        setAccess({
          nToken: fcmToken,
          clientId: userCredentials?.user?.uid,
        }).then(() => {
          signIn();
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }, [email, password, fcmToken, signIn]);

  return (
    <ScreenBg>
      <View style={styles.container}>
        <View style={styles.title}>
          <Label label="teach" size={40} weight="bold" />
          <Label label="Me" size={40} weight="light" />
        </View>
        <VerticalSpacer flex={1} />
        <Input
          label="Email"
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text: string) => setEmail(text)}
        />
        <VerticalSpacer />
        <Input
          label="Password"
          placeholder="Password"
          secureTextEntry
          keyboardType="default"
          onChangeText={(text: string) => setPassword(text)}
        />
        {isSignUp && (
          <>
            <VerticalSpacer />
            <Input
              label="Confirm Password"
              placeholder="Confirm Password"
              secureTextEntry
              keyboardType="default"
              onChangeText={(text: string) => setConfirmPassword(text)}
            />
          </>
        )}

        <VerticalSpacer flex={1} />
        <View style={styles.signUp}>
          <Label
            label={isSignUp ? 'Already signed in? ' : 'New user? '}
            size={'medium'}
            weight="normal"
          />
          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp);
            }}>
            <Label
              label={isSignUp ? 'Sign In' : 'Sign Up'}
              size={'medium'}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <VerticalSpacer height={10} />
        <Label label="Or" size={'small'} weight="light" />
        <VerticalSpacer height={10} />
        <TouchableOpacity
          onPress={() => {
            isSignUp ? onPressSignUpSubmit() : onPressSignInSubmit();
          }}
          style={styles.button}>
          <Label
            label={isSignUp ? 'Sign Up' : 'Sign In'}
            size={20}
            weight="bold"
          />
        </TouchableOpacity>
      </View>
    </ScreenBg>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  signUp: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3f51b5',
    borderRadius: 5,
  },
});
