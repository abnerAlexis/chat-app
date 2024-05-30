import  * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const CustomActions = ({ userID }) => {

    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imgName = uri.split('/')[]
    }

    const shareImage = async (imgURI) => {
        //TO DO
    }

    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissions.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
    
            if (!result.canceled) shareImage(result.assets[0].uri);
    
            else Alert.alert('Permission to access media library is required!');
        }
    };
    
}

export default CustomActions;