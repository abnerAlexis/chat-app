import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Create the navigator
const Stack = createNativeStackNavigator();

export default function App() {
  //Firebase config of the web app
  const firebaseConfig = {
    apiKey: "AIzaSyBesh50htWjDL_jl7fzViASOEZUOmYjbPc",
    authDomain: "chatapp-16472.firebaseapp.com",
    projectId: "chatapp-16472",
    storageBucket: "chatapp-16472.appspot.com",
    messagingSenderId: "33842315983",
    appId: "1:33842315983:web:8e508c0e9dccf5b168edba"
  };  

  //Initialize Firebase
  const app =initializeApp(firebaseConfig);

  //Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator
        initialRouteName='Start'
      >
        <Stack.Screen
          name='Start'
          component={Start}
        />
        <Stack.Screen
          name='Chat'
          component={Chat}
        >
          {
            props => <Chat 
              db={db} 
              {...props}
            />
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
