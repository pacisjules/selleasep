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
import i18next, { languageResources } from "./services/i18next";
import { useTranslation } from "react-i18next";

import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SetSPT = ({ navigation }) => {
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);
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

  const { t } = useTranslation();
  const changeLng = (lng) => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };
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
            marginTop:31,
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
              {t("selectspt")}
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
            style={[
              styles.container,
              {
                backgroundColor: currenttheme.light,
              },
            ]}
          >
            <StatusBar
              backgroundColor={currenttheme.bar} // Set the background color of the status bar
              barStyle="white" // Set the text color of the status bar to dark
              hidden={false} // Show the status bar
            />

            <Center style={styles.container}>
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 20,
                  marginTop: 10,
                  marginBottom: 10,
                  color: currenttheme.secondary,
                  fontFamily: "Poppins-Bold",
                }}
              >
                {all_SPT.length} {t("spt")}
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  marginTop: 5,
                  color: "grey",
                  fontFamily: "Poppins-Regular",
                  width: "85%",
                }}
              >
                {t("setspt")}
              </Text>

              {all_SPT.map((item) => (
                <View
                  style={{
                    width: "95%",
                    backgroundColor: currenttheme.primary,
                    borderRadius: 10,
                    marginTop:20,
                    padding:10,
                    justifyContent:"center",
                    alignItems:"center",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{
                  textAlign: "left",
                  fontSize: 14,
                  color: "white",
                  fontFamily: "Poppins-Bold",
                }}>{t("manager")}: {item.manager_name}</Text>
                  <Text style={{
                  textAlign: "left",
                  fontSize: 12,
                  marginTop: 3,
                  color: "white",
                  fontFamily: "Poppins-Regular",
                }}>{t("location")}: {item.location}</Text>
                  <Text style={{
                  textAlign: "left",
                  fontSize: 12,
                  marginTop: 3,
                  color: "white",
                  fontFamily: "Poppins-Regular",
                }}>{t("phone")}: {item.phone_number}</Text>

                  <TouchableOpacity onPress={() => Alert.alert(`${t("schange")}`, `${t("askchange")}`, [
      {
        text: `${t("no")}`,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: `${t("yes")}`, onPress: async () => {
        await AsyncStorage.removeItem("salepoint_id");
        await AsyncStorage.removeItem("mySpt_location");
        await AsyncStorage.setItem("salepoint_id", item.sales_point_id);
        await AsyncStorage.setItem("mySpt_location", item.location);
        navigation.navigate("Loading");
      }},
    ])}>
                    <View
                      style={{
                        width: "95%",
                        backgroundColor: currenttheme.light,
                        borderRadius: 5,
                        padding:10,
                        justifyContent:"space-around",
                        alignItems:"center",
                        flexDirection:"column"
                      }}
                    >
                      <Text>{t("accessin")} {item.location} {t("spt")}</Text>
                      <Entypo name="arrow-bold-right" size={24} color={currenttheme.primary} />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </Center>
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

export default SetSPT;
