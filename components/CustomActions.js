import  * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const CustomActions = ({ userID, onSend }) => {

    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        // Image name is extracted from the URI
        const imageName = imageUri.split('/').pop(); 
    }

    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissions.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
    
            if (!result.canceled) uploadImageToFirebase(result.assets[0].uri);
    
            else Alert.alert('Permission to access media library is required!');
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

    const uploadImageToFirebase = async (imgURI) => {
       try {
            // Convert the image to a blob
            const response = await fetch(imgURI);
            const blob = await response.blob();

            // Create a reference
            const imgReference = generateReference(imgURI);

            // Upload the file
            const snapshot = await uploadBytes(imgReference, blob);

            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            onSend({ image: downloadURL })

            // Display success message with download URL
            console.log('Upload successful!');
            console.log(`Image available at: ${downloadURL}`);
        } catch (error) {
            // Display error message if upload fails
            Alert.alert('Upload failed.')
        }
    }    
}

export default CustomActions;