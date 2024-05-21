import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { useState } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [selectedBackground, setSelectedBackground] = useState('#090C08');
    //Initializing Authentication handler
    const auth = getAuth();

    const signInUser = () => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate('Chat', { name: name, backgroundColor: selectedBackground, userID: result.user.uid })
                Alert.alert('Signed in successfully.')
            })
            .catch((error) => {
                Alert.alert('Unable to sign in, try later again.')
            })
    }

    // Array of color options
    const colorOptions = [
        { color: "#090C08", label: "Dark Green" },
        { color: "#474056", label: "Dark Gray" },
        { color: "#8A95A5", label: "Light Gray" },
        { color: "#B9C6AE", label: "Light Green" },
    ];

    return (
        <ImageBackground
            source={require('../img/chatbg.png')}
            style={styles.imgbg}
        >
            <Text style={styles.appTitle}>Chat</Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.yourName}
                    value={name}
                    onChangeText={setName}
                    placeholder='Your Name'
                />
                <View style={styles.colorOptions}>
                    <Text style={styles.chooseColorTxt}>Choose Background Color:</Text>
                </View>
                <View style={styles.colorBtnContainer}>
                    {/* Updates background color state when a color is selected */}
                    {
                        colorOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index} //index of colorOptions array
                                style={[
                                    styles.chooseColor,
                                    { backgroundColor: option.color },
                                    selectedBackground === option.color && styles.selectedColor,
                                ]}
                                onPress={() => setSelectedBackground(option.color)}
                                accessibilityLabel={`Choose ${option.label} background color`}
                            />
                        ))
                    }
                </View>
                <TouchableOpacity
                    style={styles.startChattingBtn}
                    onPress={signInUser}
                >
                    <Text style={styles.startChattingBtnTxt}>
                        Start Chatting
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    imgbg: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        resizeMode: 'cover',
    },
    appTitle: {
        flex: 1,
        fontSize: 45,
        fontWeight: "600",
        color: "#FFF",
        justifyContent: "center",
        marginTop: 80,
    },
    container: {
        width: "88%",
        height: "44%",
        backgroundColor: "white",
        alignItems: "center",
        marginBottom: 20,
        justifyContent: "space-evenly",
        borderRadius: 4,
    },
    yourName: {
        width: "88%",
        padding: 10,
        borderWidth: 1,
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.5,
        borderColor: "#757083",
        borderRadius: 10,
    },
    colorOptions: {
        width: "84%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    chooseColorTxt: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 1,
    },
    colorBtnContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
        paddingLeft: 40,
    },
    chooseColor: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        margin: 5,
        borderColor: '#FFF'
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: '#000',
    },
    startChattingBtn: {
        width: '88%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#757083',
        paddingVertical: 12,
    },
    startChattingBtnTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
})

export default Start;