import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';

import {AuthNavigation, RootNavigation} from './app/navigations';
import {StatusBar} from 'react-native';
import {setItem} from './app/stores/storage';
import {useAuthStore} from './app/stores/auth';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  StatusBar.setBackgroundColor('#4c669f');
  const signedUid = auth().currentUser?.uid;
  const {signedIn, signIn, setClientId} = useAuthStore();

  useEffect(() => {
    const clientIdFn = async () => {
      if (signedUid) {
        setClientId(signedUid);
        await setItem('clientId', signedUid);
        signIn();
      }
    };
    clientIdFn();
  }, [setClientId, signIn, signedUid]);

  return (
    <NavigationContainer>
      {!signedIn ? <AuthNavigation /> : <RootNavigation />}
    </NavigationContainer>
  );
};

export default App;
