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
import i18next, {languageResources} from './services/i18next';
import {useTranslation} from 'react-i18next';

import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Entypo,
  MaterialCommunityIcons
} from "@expo/vector-icons";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Aboutus = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [currenttheme, setcurrenttheme] = useState(
    useSelector((state) => state.userInfos.current_theme)
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

  const {t} = useTranslation();
  const changeLng = lng => {
      i18next.changeLanguage(lng);
      setVisible(false);
    };
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
                navigation.navigate("Home");
              }}
            >
              <Ionicons name="caret-back" size={35} color="white" />
            </TouchableOpacity>

            <Text
              style={{
                textAlign: "left",
                fontSize: 23,
                color: "white",
                marginLeft: 75,
                fontFamily: "Poppins-Bold",
              }}
            >
             {t('aboutus')} 
            </Text>
          </LinearGradient>
        </View>

        <ScrollView
          style={{
            backgroundColor: "#f5f5f5",
            width: "100%",
            height: "100%",
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
                  color: currenttheme.secondary,
                  fontFamily: "Poppins-Bold",
                }}
              >
               {t('aboutsystem')}
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
                {t('aboutmes')}
              </Text>

              <Text
                style={{
                  textAlign: "left",
                  fontSize: 20,
                  marginTop: 10,
                  color: currenttheme.secondary,
                  fontFamily: "Poppins-Bold",
                }}
              >
                {t('vision')}
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
               {t('vismes')}
              </Text>

              <Text
                style={{
                  textAlign: "left",
                  fontSize: 20,
                  marginTop: 10,
                  color: currenttheme.secondary,
                  fontFamily: "Poppins-Bold",
                }}
              >
                {t('mission')}
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
               {t('mismes')}
              </Text>

              <LinearGradient
                colors={[currenttheme.secondary, currenttheme.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                angle={90}
                style={{
                  height: 220,
                  borderTopLeftRadius: 13,
                  borderTopRightRadius: 13,
                  borderBottomLeftRadius: 45,
                  borderBottomRightRadius: 45,
                  alignContent: "center",
                  flexDirection: "column",
                  width: "90%",
                  marginTop: 60,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    width: "100%",
                    alignItems: "center",
                    marginTop: -55,
                    position: "absolute",
                  }}
                >
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 80,
                      backgroundColor: currenttheme.secondary,
                      borderWidth: 3,
                      borderColor: currenttheme.normal,
                      borderStyle: "solid",
                      shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                      zIndex: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: 112,
                        height: 112,
                        borderRadius: 100,
                      }}
                      source={require("../../assets/ezrapic.jpg")}
                    />
                  </View>
                </View>

                <Center>
                  <View
                    style={{
                      width: "75%",
                      height: 100,
                      marginTop: 55,
                    }}
                  >
                    <Text
                      style={{
                        marginTop: 5,
                        textAlign: "center",
                        fontSize: 23,
                        color: "white",
                        fontFamily: "Poppins-Bold",
                      }}
                    >
                      Ntwari Esdras
                    </Text>

                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        color: "white",
                        fontFamily: "Poppins-Bold",
                        marginTop: -10,
                      }}
                    >
                     {t('cofounder')}
                    </Text>

                    <Text
                      style={{
                        marginTop: -2,
                        textAlign: "center",
                        fontSize: 11,
                        color: "white",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                     {t('softeng')} - Kigali, Rwanda
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "75%",
                      height: 50,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL("mailto:ntwariezraa@gmail.com")
                      }
                    >
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: currenttheme.secondary,
                          borderRadius: 10,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Entypo name="email" size={28} color="white" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => Linking.openURL("tel:+250782584354")}
                    >
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: "white",
                          borderRadius: 50,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          marginTop: -5,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 3,
                          borderColor: currenttheme.secondary,
                          borderStyle: "solid",
                        }}
                      >
                        <Ionicons
                          name="call"
                          size={35}
                          color={currenttheme.secondary}
                        />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL("https://portfolioofezraa.vercel.app")
                      }
                    >
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: currenttheme.secondary,
                          borderRadius: 10,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons name="web" size={28} color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </Center>
              </LinearGradient>

              <LinearGradient
                colors={[currenttheme.secondary, currenttheme.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                angle={90}
                style={{
                  height: 220,
                  borderTopLeftRadius: 13,
                  borderTopRightRadius: 13,
                  borderBottomLeftRadius: 45,
                  borderBottomRightRadius: 45,
                  alignContent: "center",
                  flexDirection: "column",
                  width: "90%",
                  marginTop: 75,
                  marginBottom: 50,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    width: "100%",
                    alignItems: "center",
                    marginTop: -55,
                    position: "absolute",
                  }}
                >
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 80,

                      backgroundColor: currenttheme.secondary,
                      borderWidth: 3,
                      borderColor: currenttheme.normal,
                      borderStyle: "solid",
                      shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                      zIndex: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: 112,
                        height: 112,
                        borderRadius: 100,
                      }}
                      source={require("../../assets/pacispic.png")}
                    />
                  </View>
                </View>

                <Center>
                  <View
                    style={{
                      width: "75%",
                      height: 100,
                      marginTop: 55,
                    }}
                  >
                    <Text
                      style={{
                        marginTop: 10,
                        textAlign: "center",
                        fontSize: 20,
                        color: "white",
                        fontFamily: "Poppins-Bold",
                      }}
                    >
                      ISHIMWE Jules Pacis
                    </Text>

                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        color: "white",
                        fontFamily: "Poppins-Bold",
                        marginTop: -10,
                      }}
                    >
                     {t('cofounder')}
                    </Text>

                    <Text
                      style={{
                        marginTop: -2,
                        textAlign: "center",
                        fontSize: 11,
                        color: "white",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      {t('softeng')} - Kigali, Rwanda
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "75%",
                      height: 50,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL("mailto:pacisjules@gmail.com")
                      }
                    >
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: currenttheme.secondary,
                          borderRadius: 10,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Entypo name="email" size={28} color="white" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => Linking.openURL("tel:+250788224590")}
                    >
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: "white",
                          borderRadius: 50,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          marginTop: -5,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 3,
                          borderColor: currenttheme.secondary,
                          borderStyle: "solid",
                        }}
                      >
                        <Ionicons
                          name="call"
                          size={35}
                          color={currenttheme.secondary}
                        />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL("https://paciscvapp.vercel.app/")
                      }
                    >
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: currenttheme.secondary,
                          borderRadius: 10,
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons name="web" size={28} color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </Center>
              </LinearGradient>
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

export default Aboutus;
