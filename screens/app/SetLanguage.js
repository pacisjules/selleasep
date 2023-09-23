import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Vibration,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Button,
  Modal,
  FormControl,
  Input,
  Center,
  NativeBaseProvider,
  AlertDialog,
  useToast,
  TextArea,
  Switch,
} from "native-base";

import * as Font from "expo-font";
import * as Linking from "expo-linking";
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { fetchSPT } from "../../features/getallsales/getallsales";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next, { languageResources } from "./services/i18next";
import { useTranslation } from "react-i18next";
import languagesList from "./services/languagesList.json";

import { setUserLanguage } from "../../features/userinfo/userInfos";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SetLanguage = ({ navigation }) => {
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedLg, setSelectedLg] = useState(false);

  const { t } = useTranslation();

  const changeLng = (lng) => {
    i18next.changeLanguage(lng);
    setVisible(false);
    setSelectedLg(lng);

    Alert.alert("SelleasEP", `${t('asetlang')}`, [
      {
        text: `${t('cancel')}`,
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: `${t('ok')}`,
        onPress: () => {
          dispatch(setUserLanguage(lng));
          AsyncStorage.setItem("language", lng);
          navigation.navigate("Home");
        },
      },
    ]);
  };

  const SetLanguageNow = () => {
    alert("Setted: " + selectedLg);
  };

  const notificationListener = useRef();
  const responseListener = useRef();
  const [currenttheme, setcurrenttheme] = useState(
    useSelector((state) => state.userInfos.current_theme)
  );

  const [salesCoi, setsalesCo] = useState(
    useSelector((state) => state.userInfos.currentCompanyID)
  );

  const { SPTLoad, all_SPT, SPTError } = useSelector(
    (state) => state.all_sales
  );

  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    setFontsLoaded(true);
  }

  useEffect(() => {
    dispatch(fetchSPT(salesCoi));

    loadFonts();
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `SellEASEP Notification`,
        body: `${companyName} system:\n${notMessage}`,
        data: { data: "goes here" },
      },
      trigger: { seconds: 1 },
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const cancelRef = React.useRef(null);

  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
  ];

  const PATTERN_DESC =
    Platform.OS === "android"
      ? "wait 1s, vibrate 2s, wait 3s"
      : "wait 1s, vibrate, wait 2s, vibrate, wait 3s";

  return (
    <SafeAreaView style={styles.containerer}>
      <NativeBaseProvider>
        <View
          style={{
            backgroundColor: currenttheme.light,
            height: 65,
            width: "100%",
            marginTop: 31,
          }}
        >
          <LinearGradient
            colors={[currenttheme.secondary, currenttheme.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            angle={-45}
            style={{
              height: 65,
              backgroundColor: "blue",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 45,
              borderBottomRightRadius: 45,
              justifyContent: "flex-start",
              alignContent: "center",
              flexDirection: "row",
              paddingTop: 10,
              paddingLeft: 20,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SystemSetting");
              }}
            >
              <Ionicons name="caret-back" size={35} color="white" />
            </TouchableOpacity>

            <Text
              style={{
                textAlign: "left",
                fontSize: 20,
                color: "white",
                marginLeft: 35,
                fontFamily: "Poppins-Bold",
              }}
            >
              {t('change-language')}
            </Text>
          </LinearGradient>
        </View>

        <ScrollView
          style={{
            backgroundColor: "#f5f5f5",
            width: "100%",
            height: "120%",
            paddingBottom: 30,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FlatList
              data={Object.keys(languageResources)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: currenttheme.secondary,
                    width: "100%",
                    height: 50,
                    margin: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                    fontFamily: "Poppins-Regular",
                    padding: 10,
                  }}
                  onPress={() => changeLng(item)}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "Poppins-Regular",
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {languagesList[item].nativeName}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
      </NativeBaseProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  containerer: {
    height: "100%",
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default SetLanguage;
