import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation, db }) => {
    // using object destructuring to extract specific properties(name and background) from the route.params object.
    const { name, backgroundColor } = route.params;
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
        setMessages([
            {
                _id: 1,
                text: 'Hello Developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            }
        ]);
    }, []);

    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    };

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            {/* component serves as a pre-styled chat interface that includes 
            features like message input, message display */}
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1
                }}
            />
            {/* ensuring that a KeyboardAvoidingView is only rendered when the app is running 
                on an Android device. */}
            {
                Platform.OS === 'android' ?
                    <KeyboardAvoidingView
                        behavior="height"
                    /> :
                    null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;