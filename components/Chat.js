import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
    // using object destructuring to extract specific properties(name, userID and background) from the route.params object.
    const { name, backgroundColor, userID } = route.params;
    const [messages, setMessages] = useState([]);

    const renderCustomActions = (props) => {
        return (
            <CustomActions
                userID={userID}
                storage={storage}
                {...props}
            />
        )
    }

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // Customization for the background color of bubbles
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    },
                    left: {
                        backgroundColor: '#FFF'
                    }
                }}
            />
        )
    }

    // useEffect(() => {
    //     navigation.setOptions({ title: name });
    // }, []);

    // Transfering text messages to storage
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    // Loading cached messages from storage
    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem('messages');
        if (cachedMessages) {
            setMessages(JSON.parse(cachedMessages));
        }
    }

    useEffect(() => {
        if (isConnected) {
            navigation.setOptions({ title: name });
            const messageQuery = query(collection(db, 'messages'),
                orderBy('createdAt', 'desc'));
            unsubscribe = onSnapshot(messageQuery, (docs) => {
                let newMessages = [];
                docs.forEach(doc => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    })
                })
                cacheMessages(newMessages);
                setMessages(newMessages);
            })
        } else {
            loadCachedMessages();
        }
        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, [isConnected]);

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    };

    // Customizing input toolbar to hide it when offline
    const renderInputToolbar = (props) => {
        if (isConnected) {
            return <InputToolbar style={styles.inputToolbar} {...props} />;
        }
        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputToolbar: {
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        backgroundColor: '#FFFFFF',
    },
});

export default Chat;
