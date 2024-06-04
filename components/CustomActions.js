import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

const CustomActions = ({ wrapperStyle, iconTextStyle, userID, onSend, storage }) => {
    const actionSheet = useActionSheet();

    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }
            }
        );
    }

    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                await uploadImageToFirebase(result.assets[0].uri);
            } else Alert.alert('Permission to access media library is required!');
        }
    };

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();

            if (!result.canceled) await uploadImageToFirebase(result.assets[0].uri);
            else Alert.alert('You need to grant camera permissions to take a photo.');
        };
    }

    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                // onSend({
                //     location: {
                //         longitude: location.coords.longitude,
                //         latitude: location.coords.latitude,
                //     },
                // });
                onSend([{
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude
                    }
                }]
                );

            } else Alert.alert('Error fetching location.');
        } else Alert.alert('Permission is required to view the location.')
    }

    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        // Image name is extracted from the URI
        const imageName = uri.split('/').pop();
        return `${userID}-${timeStamp}-${imageName}`
    }

    const uploadImageToFirebase = async (imageURI) => {
        try {
            const imgReference = generateReference(imageURI);
            const newUploadRef = ref(storage, imgReference);

            const response = await fetch(imageURI);
            const blob = await response.blob();

            const snapshot = await uploadBytes(newUploadRef, blob);
            const imageURL = await getDownloadURL(snapshot.ref);

            // onSend({ image: imageURL });
            onSend([{ image: imageURL }]);

            console.log('Upload successful!');
            console.log(`Image available at: ${imageURL}`);
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Upload failed', error.message);
        }
    }
    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>
                    +
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;