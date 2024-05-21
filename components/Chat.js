import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
    // using object destructuring to extract specific properties(name and background) from the route.params object.
    const { name, backgroundColor, userID } = route.params;
    const [messages, setMessages] = useState([]);

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

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    // initializes the 'messages' state with two predefined messages when the component mounts for the first time
    useEffect(() => {
        const messageQuery = query(
            collection(db, 'messages'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
            const messagesFirestore = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    _id: doc.id,
                    text: data.text,
                    createdAt: data.createdAt.toDate(),
                    user: data.user,
                };
            });
            setMessages(messagesFirestore);
        });
    }, []);

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    };

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
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
});

export default Chat;