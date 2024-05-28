import { StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useNetInfo }from '@react-native-community/netinfo';
import Start from './components/Start';
import Chat from './components/Chat';

//Creating  the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const App = () => {
  //Defining a new state useNetInfo() that represents the network connectivity
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost!');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  //App's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAusc8pa7iar4AWmnPMzTjVojPekMdCgzs",
    authDomain: "chat-app-27b43.firebaseapp.com",
    projectId: "chat-app-27b43",
    storageBucket: "chat-app-27b43.appspot.com",
    messagingSenderId: "562080608888",
    appId: "1:562080608888:web:e0ba44a2ae91534e8ab38d"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Initialize Cloud Firestore and get a reference to  the service
  const db = getFirestore(app);

  //Initialize the storage
  const storage = getStorage(app);

  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator
        initialRouteName='Start'
      >
        <Stack.Screen
          name='Start'
          component={Start}
        />
        <Stack.Screen name='Chat'>
          {
            props => 
              <Chat 
                isConnected={connectionStatus.isConnected} 
                db={db} 
                storage={storage}
                {...props} />
          }
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;