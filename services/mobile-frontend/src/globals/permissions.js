import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

const STORED_TOKEN_KEY = 'pushToken';

async function handleNotificationsPermissions() {
    const status = await getNotificationsPermissionsStatus();

    if (status === 'granted') {
        if (Platform.OS === 'android') await configureAndroidNotificationChannel();
        const { stashed, current } = await getPushTokens();
        await AsyncStorage.setItem(STORED_TOKEN_KEY, current);
        return { stashed, current };
    } else {
        const stashed = await AsyncStorage.getItem(STORED_TOKEN_KEY);
        await AsyncStorage.removeItem(STORED_TOKEN_KEY);
        return { stashed };
    }
}

async function getNotificationsPermissionsStatus() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    return finalStatus;
}

async function getPushTokens() {
    return {
        stashed: await AsyncStorage.getItem(STORED_TOKEN_KEY),
        current: (await Notifications.getExpoPushTokenAsync()).data,
    };
}

function configureAndroidNotificationChannel() {
    return Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
    });
}

export { handleNotificationsPermissions };
