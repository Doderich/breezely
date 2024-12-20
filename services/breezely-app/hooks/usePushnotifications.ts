import { useState, useEffect, useRef} from 'react'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

import Constants from "expo-constants"
import { Platform } from 'react-native'
import { useAssignPushToken } from './queries/useUserInfo'
import { useAuth } from './useAuth'

export interface PushNotifcationState {
    notification?: Notifications.Notification,
    expoPushToken?: Notifications.ExpoPushToken 
}


export const usePushnotification = (): PushNotifcationState | undefined => {
    const {mutate: assignPushToken} = useAssignPushToken()
    const {user} = useAuth()
    if(!user) return undefined
    Notifications.setNotificationHandler({
        handleNotification: async ( ) => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false
        })
    })
    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>()
    const [notification, setNotification] = useState<Notifications.Notification | undefined>()

    const notificationListener = useRef<Notifications.EventSubscription>()
    const responseListener = useRef<Notifications.EventSubscription>()

    async function registeForPushNotificationAsync() {
        let token;
        if(Device.isDevice){

            const {status: existingStatus} = await Notifications.getPermissionsAsync()

            let finalStatus = existingStatus;

            if(existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync()
                finalStatus = status;
            }
            if (finalStatus !== 'granted'){
                alert("Failed to get push Token")
            }

            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.easConfig?.extra.eas.projectId
            })

            if(Platform.OS === 'android'){
                Notifications.setNotificationChannelAsync('default', {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0,250,250,250]
                })
            }


            return token
        }else {
            console.log("ERROR: Please use a physical device")
        }
    }

    useEffect(()=> {
        registeForPushNotificationAsync().then((token) => {
            setExpoPushToken(token)
        })

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('response', response)
        })

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current!)
            Notifications.removeNotificationSubscription(responseListener.current!)
        }

    }, [])


    useEffect(() => {
        if(expoPushToken){
            assignPushToken({expo_push_token: expoPushToken.data})
        }
    }, [expoPushToken])


    return {
        expoPushToken,
        notification
    }

}

