import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { BarCodeScanner } from "expo-barcode-scanner";
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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import i18next, { languageResources } from "./services/i18next";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { Camera } from 'expo-camera';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const ProductView = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false); //showModalSale
  const [showModalSale, setShowModalSale] = useState(false);
  const [showModalBarcode, setShowModalBarcode] = useState(false);

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvOpen, setIsInvOpen] = React.useState(false);
  const [isIncidentalOpen, setIsIncidentalOpen] = React.useState(false);
  const [isStatusLoading, setStatusLoading] = useState(false);

  const [companyName, setCompanyName] = useState(
    useSelector((state) => state.userInfos.currentUserCompany)
  );
  const [myuserID, setMyuserID] = useState(
    useSelector((state) => state.userInfos.currentUserID)
  );
  const [isActive, setActive] = useState(false);

  //Reduxes
  const [cuser, setcUser] = useState(
    useSelector((state) => state.userInfos.currentUser)
  );
  const [currenttheme, setcurrenttheme] = useState(
    useSelector((state) => state.userInfos.current_theme)
  );

  const [currentCompany, setcurrentCompany] = useState(
    useSelector((state) => state.userInfos.currentCompanyID)
  );

  const [currentSpt, setcurrentSpt] = useState(
    useSelector((state) => state.userInfos.currentSalesPointID)
  );

  const { t } = useTranslation();
  const changeLng = (lng) => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };
  const route = useRoute();
  const params = route.params;
  const toast = useToast();

  //Barcode
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  //Infos
  const [ident, setIdent] = React.useState("");
  const [pro_name, setPro_name] = React.useState("");
  const [pro_price, setPro_price] = React.useState("");
  const [pro_benefit, setPro_benefit] = React.useState("");
  const [pro_quantity, setPro_quantity] = React.useState("");
  const [pro_alert, setPro_alert] = React.useState("");
  const [pro_time, setPro_time] = React.useState("");
  const [pro_description, setPro_description] = React.useState("");
  const [notMessage, setNotMessage] = React.useState("");
  const [NewPro_quantity, setNewPro_quantity] = useState(0);
  const [pro_barcode, setProBarcode] = React.useState("");

  //IssalePaid
  //setIssalePaid

  const [IssalePaid, setIssalePaid] = useState(true);

  const [IncidentalCause, setIncidentaCause] = useState("");
  const [IncidentalQty, setIncidentalQty] = useState(0);

  const [usertype, setusertype] = useState(
    useSelector((state) => state.userInfos.currentUserType)
  );

  const [cuserid, setcUserid] = useState(
    useSelector((state) => state.userInfos.currentUserID)
  );

  const [edit, setEdit] = useState(true);
  const [pro_quatity, setQuatity] = useState(0);

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //Running
  const Setparms = () => {
    setIdent(params.id);
    setPro_name(params.name);
    setPro_price(params.price);
    setPro_benefit(params.benefit);
    setPro_quantity(params.quantity);
    setPro_alert(params.alertQuantity);
    setPro_time(params.time);
    setActive(params.status);
    setPro_description(params.description);
    setProBarcode(params.barcode);
  };

  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      magneto: require("../../assets/fonts/magneto.ttf"),
      Cocogoose: require("../../assets/fonts/Cocogoose.ttf"),

      "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    setFontsLoaded(true);
  }

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  useEffect(() => {
    loadFonts();
    Setparms();

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

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
        body: `${companyName} system: \n${notMessage}`,
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

  const onClose = () => setIsOpen(false);

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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
  };


  //Update Command
  const Updateinformation = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      id: ident,
      name: pro_name,
      product_id: ident,
      salespt_id: currentSpt,
      user_id: myuserID,
      name: pro_name,
      price: pro_price,
      benefit: pro_benefit,
      description: pro_description,
      barcode: scannedData,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/product/updateproduct.php",
        data,
        config
      )
      .then((response) => {
        setNotMessage(`This product ${pro_name} has been Updated Successfully`);
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        setShowModalBarcode(false);
      })
      .catch((error) => {
        setNotMessage(`This product ${pro_name} failed to be Updated`);
        schedulePushNotification();

        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        setShowModalBarcode(false);
      });
  };

  const handleSwitchToggle = () => {
    setIssalePaid(!IssalePaid);
  };

  //Adding Command
  const Adding_information = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      product_id: ident,
      quantity: pro_quatity,
      sales_type: 1,
      paid_status: IssalePaid ? "Paid" : "Not Paid",
      sales_point_id: currentSpt,
      user_id: cuserid,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/sales/addnewsales.php",
        data,
        config
      )
      .then((response) => {
        setNotMessage(`This product ${pro_name} has been Sold Successfully`);
        schedulePushNotification();

        setPro_quantity(parseInt(pro_quantity) - parseInt(pro_quatity));
        setEdit(true);
        setShowModalSale(false);
        Vibration.vibrate();
        setIsLoading(false);
        getallproduct();
        getallsales();

        setQuatity(0);
        setIssalePaid(true);
      })
      .catch((error) => {
        setNotMessage(`This product ${pro_name} has been failed to be Sold`);
        schedulePushNotification();

        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        setIssalePaid(true);
        setQuatity(0);
      });
  };

  const enableProduct = async () => {
    setEdit(false);
    setStatusLoading(true);

    const data = {
      product_id: ident,
      state: 1,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/product/disableproduct.php",
        data,
        config
      )
      .then((response) => {
        setNotMessage(`This product ${pro_name} has been Enabled`);
        schedulePushNotification();
        setStatusLoading(false);
        setActive(true);
        Vibration.vibrate();
      })
      .catch((error) => {
        setNotMessage(`This product ${pro_name} has failed to Enable`);
        Vibration.vibrate();
        setStatusLoading(false);
      });
  };

  const deleteProduct = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      product_id: parseInt(ident),
    };

    console.log(data.product_id);
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/product/deleteproduct.php",
        data,
        config
      )
      .then((response) => {
        //console.log(response);
        setNotMessage(`This product ${pro_name} has been deleted`);
        schedulePushNotification();
        setIsLoading(false);
        Vibration.vibrate();
        navigation.navigate("Products");
      })
      .catch((error) => {
        setNotMessage(`This product ${pro_name} has failed to be deleted`);
        Vibration.vibrate();
        setIsLoading(false);
      });
  };

  const inventoryProduct = async () => {
    //console.log("Pressed");
    setEdit(false);
    setIsLoading(true);

    const data = {
      product_id: ident,
      new_adding: NewPro_quantity,
      salespt_id: currentSpt,
      user_id: myuserID,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/inventory/increseinventory.php",
        data,
        config
      )
      .then((response) => {
        //console.log(response);
        setNotMessage(
          `This product ${pro_name} has successful added new stock`
        );
        schedulePushNotification();
        Vibration.vibrate();
        setIsInvOpen(false);
        setIsLoading(false);

        {
          pro_quantity === `${t("no-stock")}`
            ? setPro_quantity(parseInt(NewPro_quantity))
            : setPro_quantity(
                parseInt(pro_quantity) + parseInt(NewPro_quantity)
              );
        }
        {
          pro_alert === `${t("no-stock")}`
            ? setPro_alert(5)
            : setPro_alert(pro_alert);
        }
      })
      .catch((error) => {
        setNotMessage(
          `${t("this-product")} ${pro_name} ${t("has-failed-to-add-new-stock")}`
        );
        Vibration.vibrate();
        setIsLoading(false);
        setIsInvOpen(false);
      });
  };

  const IncidentalProduct = async () => {
    //console.log("Pressed");
    setEdit(false);
    setIsLoading(true);

    const data = {
      product_id: ident,
      user_id: myuserID,
      cause: IncidentalCause,
      quantity: IncidentalQty,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/incidental/insertincidental.php",
        data,
        config
      )
      .then((response) => {
        setNotMessage(`This incident of ${pro_name} has successful added`);
        schedulePushNotification();
        Vibration.vibrate();
        setIsIncidentalOpen(false);
        setIsLoading(false);
        setPro_quantity(parseInt(pro_quantity) - parseInt(IncidentalQty));
        setIncidentalQty(0);
        setIncidentaCause("");
      })
      .catch((error) => {
        setNotMessage(`This incident of ${pro_name} has failed to be added`);
        Vibration.vibrate();
        setIsLoading(false);
        setIsIncidentalOpen(false);
      });
  };

  const disableProduct = async () => {
    setEdit(false);
    setStatusLoading(true);

    const data = {
      product_id: ident,
      state: 0,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/product/disableproduct.php",
        data,
        config
      )
      .then((response) => {
        setNotMessage(`This product ${pro_name} has been Disabled`);
        schedulePushNotification();
        Vibration.vibrate();
        setStatusLoading(false);
        setActive(false);
      })
      .catch((error) => {
        setNotMessage(`This product ${pro_name} has failed to Disable`);
        Vibration.vibrate();
        setStatusLoading(false);
      });
  };


  // Toggle flash mode (on/off/auto)
  const toggleFlashMode = () => {
    setFlashMode((prevMode) => {
      if (prevMode === Camera.Constants.FlashMode.off) {
        return Camera.Constants.FlashMode.on;
      } else if (prevMode === Camera.Constants.FlashMode.on) {
        return Camera.Constants.FlashMode.auto;
      } else {
        return Camera.Constants.FlashMode.off;
      }
    });
  };



  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  
  return (
    <SafeAreaView style={styles.containerer}>
      <NativeBaseProvider>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{
            backgroundColor: "#f5f5f5",
            width: "100%",
            height: "100%",
          }}
        >
          <View style={styles.container}>
            <StatusBar
              backgroundColor={currenttheme.bar} // Set the background color of the status bar
              barStyle="white" // Set the text color of the status bar to dark
              hidden={false} // Show the status bar
            />
            <Center>
              <View
                style={{
                  width: "95%",
                  marginTop: 20,
                }}
              >
                <LinearGradient
                  colors={["white", currenttheme.light]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  angle={-45}
                  style={{
                    flexDirection: "row",
                    height: 150,
                    width: "100%",
                    shadowColor: "#000000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    borderRadius: 26,
                  }}
                >
                  <LinearGradient
                    colors={["white", currenttheme.light]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    angle={-45}
                    style={{
                      backgroundColor: currenttheme.secondary,
                      width: "60%",
                      height: 150,
                      borderTopLeftRadius: 25,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 25,
                      borderBottomRightRadius: 0,
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Poppins-Bold",
                          fontSize: 16,
                          color: currenttheme.secondary,
                        }}
                      >
                        {pro_name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins-Bold",
                          fontSize: 12,
                          color: currenttheme.primary,
                        }}
                      >
                        {pro_time}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          alignItems: "center",
                          //justifyContent:"center"
                        }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 50,
                            borderColor: "white",
                            borderWidth: 2,
                            borderStyle: "solid",
                            shadowColor: "#000000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            backgroundColor: isActive ? "green" : "red",
                          }}
                        ></View>
                        <Text
                          style={{
                            fontFamily: "Poppins-Bold",
                            fontSize: 12,
                            color: currenttheme.secondary,
                            marginLeft: 5,
                            marginTop: 5,
                          }}
                        >
                          {isActive ? `${t("active")}` : `${t("no-active")}`}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 12,
                        }}
                      >
                        {usertype == "BOSS" ? (
                          <TouchableOpacity
                            style={{
                              backgroundColor: currenttheme.secondary,
                              marginLeft: 5,
                              padding: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              width: 90,
                              borderRadius: 50,
                            }}
                            onPress={() => setShowModal(true)}
                          >
                            <Text
                              style={{
                                fontFamily: "Poppins-Bold",
                                fontSize: 12,
                                color: "white",
                                marginLeft: 5,
                              }}
                            >
                              {t("edit")}
                            </Text>
                          </TouchableOpacity>
                        ) : null}

                        {usertype == "BOSS" ? (
                          <TouchableOpacity
                            style={{
                              backgroundColor: currenttheme.secondary,
                              marginLeft: 5,
                              padding: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              width: 90,
                              borderRadius: 50,
                            }}
                            onPress={() => setIsOpen(true)}
                          >
                            <Text
                              style={{
                                fontFamily: "Poppins-Bold",
                                fontSize: 12,
                                color: "white",
                                marginLeft: 5,
                              }}
                            >
                              {t("delete")}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  </LinearGradient>

                  <View
                    style={{
                      backgroundColor: currenttheme.secondary,
                      width: "40%",
                      height: 150,
                      borderTopLeftRadius: 45,
                      borderTopRightRadius: 23,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 23,
                      paddingTop: 15,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "Poppins-Bold",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 10,
                      }}
                    >
                      {t("price")}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "Poppins-Regular",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 2,
                      }}
                    >
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "RWF",
                      }).format(pro_price)}
                    </Text>

                    {usertype == "BOSS" ? (
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Poppins-Bold",
                          fontSize: 12,
                          marginLeft: 10,
                          marginTop: 10,
                        }}
                      >
                        {t("benefit")}
                      </Text>
                    ) : null}

                    {usertype == "BOSS" ? (
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Poppins-Regular",
                          fontSize: 12,
                          marginLeft: 10,
                          marginTop: 2,
                        }}
                      >
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(pro_benefit)}
                      </Text>
                    ) : null}
                  </View>
                </LinearGradient>

                <View>
                  <Text
                    style={{
                      color: currenttheme.secondary,
                      fontFamily: "Poppins-Bold",
                      fontSize: 16,
                      marginLeft: 10,
                      marginTop: 10,
                    }}
                  >
                    {t("description")}
                  </Text>
                  <Text
                    style={{
                      color: "#4D4D4D",
                      fontFamily: "Poppins-Regular",
                      fontSize: 10,
                      marginLeft: 10,
                      marginTop: 10,
                      textAlign: "justify",
                      width: "90%",
                    }}
                  >
                    {pro_description}
                  </Text>
                </View>

                <LinearGradient
                  colors={["white", currenttheme.light]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  angle={-45}
                  style={{
                    flexDirection: "row",
                    height: 120,
                    width: "100%",
                    shadowColor: "#000000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    borderRadius: 26,
                    marginTop: 15,
                  }}
                >
                  <LinearGradient
                    colors={["white", currenttheme.light]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    angle={-45}
                    style={{
                      backgroundColor: currenttheme.secondary,
                      width: "60%",
                      height: 120,
                      borderTopLeftRadius: 25,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 25,
                      borderBottomRightRadius: 0,
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "space-around",
                          marginTop: 12,
                        }}
                      >
                        {usertype == "BOSS" ? (
                          <TouchableOpacity
                            style={{
                              backgroundColor: currenttheme.secondary,
                              marginLeft: 5,
                              padding: 5,
                              justifyContent: "center",
                              alignItems: "center",
                              width: "90%",
                              borderRadius: 50,
                              marginTop: 10,
                            }}
                            onPress={() => setIsInvOpen(true)}
                          >
                            <Text
                              style={{
                                fontFamily: "Poppins-Bold",
                                fontSize: 12,
                                color: "white",
                                marginLeft: 5,
                              }}
                            >
                              {t("fulfillment")}
                            </Text>
                          </TouchableOpacity>
                        ) : null}

                        <TouchableOpacity
                          style={{
                            backgroundColor: currenttheme.secondary,
                            marginLeft: 5,
                            padding: 5,
                            justifyContent: "center",
                            alignItems: "center",
                            width: "90%",
                            borderRadius: 50,
                            marginTop: 10,
                          }}
                          onPress={() => {
                            isActive
                              ? pro_quantity === "No Stock"
                                ? alert("No Stock this product have!")
                                : setIsIncidentalOpen(true)
                              : alert(
                                  "This Product is not Active Please active first!"
                                );
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Poppins-Bold",
                              fontSize: 12,
                              color: "white",
                              marginLeft: 5,
                            }}
                          >
                            {t("incidental")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </LinearGradient>

                  <View
                    style={{
                      backgroundColor: currenttheme.secondary,
                      width: "40%",
                      height: 120,
                      borderTopLeftRadius: 45,
                      borderTopRightRadius: 23,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 23,
                      paddingTop: 15,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "Poppins-Bold",
                        fontSize: 18,
                        marginLeft: 10,
                        marginTop: 10,
                      }}
                    >
                      {t("stock")}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "Poppins-Regular",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 2,
                      }}
                    >
                      {pro_quantity}{" "}
                      {pro_quantity === `${t("no-stock")}`
                        ? ""
                        : pro_quantity == 1
                        ? `${t("item")}`
                        : `${t("items")}`}
                    </Text>

                    <Text
                      style={{
                        color: "white",
                        fontFamily: "Poppins-Regular",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 2,
                      }}
                    >
                      {pro_alert}{" "}
                      {pro_alert === `${t("no-stock")}`
                        ? ""
                        : pro_alert == 1
                        ? `${t("alert-item")}`
                        : `${t("alert-items")}`}
                    </Text>
                  </View>
                </LinearGradient>

                <TouchableOpacity
                  onPress={() => {
                    isActive
                      ? pro_quantity === `${t("no-stock")}`
                        ? alert(`${t("no-Stock-this-product-have")}`)
                        : setShowModalSale(true)
                      : alert(`${t("no-Stock-this-product-have")}`);
                  }}
                >
                  <LinearGradient
                    colors={[currenttheme.secondary, currenttheme.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    angle={-45}
                    style={{
                      width: "100%",
                      borderRadius: 100,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      marginTop: 45,
                      height: 55,
                      shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="point-of-sale"
                      size={24}
                      color="white"
                    />
                    <Text
                      style={{
                        color: "white",
                        marginLeft: 10,
                        fontFamily: "Poppins-Bold",
                        fontSize: 15,
                      }}
                    >
                      {t("sale-new-now")}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {isActive ? (
                  usertype == "BOSS" ? (
                    <TouchableOpacity onPress={disableProduct}>
                      <LinearGradient
                        colors={["#A70000", "#780000"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        angle={-45}
                        style={{
                          width: "100%",
                          borderRadius: 100,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          marginTop: 17,
                          height: 55,
                          shadowColor: "#000000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <MaterialIcons
                          name="remove-done"
                          size={24}
                          color="white"
                        />

                        {isStatusLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text
                            style={{
                              color: "white",
                              marginLeft: 10,
                              fontFamily: "Poppins-Bold",
                              fontSize: 15,
                            }}
                          >
                            {t("disable-product")}
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    ""
                  )
                ) : usertype == "BOSS" ? (
                  <TouchableOpacity onPress={enableProduct}>
                    <LinearGradient
                      colors={["#00A700", "#2F7800"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      angle={-45}
                      style={{
                        width: "100%",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 17,
                        height: 55,
                        shadowColor: "#000000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      <MaterialIcons name="done-all" size={24} color="white" />

                      {isStatusLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text
                          style={{
                            color: "white",
                            marginLeft: 10,
                            fontFamily: "Poppins-Bold",
                            fontSize: 15,
                          }}
                        >
                          {t("enable-product")}
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  ""
                )}
              </View>
              {/* <Text
                          style={{
                            color: "black",
                            marginLeft: 10,
                            fontFamily: "Poppins-Bold",
                            fontSize: 15,
                          }}
                        >
                          {scannedData}
                        </Text> */}


                    <TouchableOpacity onPress={()=>{
                      Camera.Constants.FlashMode.on
                      setShowModalBarcode(true);
                      }}>
                    <LinearGradient
                      colors={["#00A700", "#2F7800"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      angle={-45}
                      style={{
                        width: "100%",
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 17,
                        height: 55,
                        shadowColor: "#000000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
                      {isStatusLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text
                          style={{
                            color: "white",
                            marginLeft: 5,
                            marginRight: 65,
                            fontFamily: "Poppins-Bold",
                            fontSize: 15,
                          }}
                        >
                          {t("scan-bar")}
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

              <View>
              
              </View>



            </Center>
          </View>
        </ScrollView>

        <View style={{ flex: 1 }}>
        <Camera
            style={{ flex: 1 }}
            type={type}
            flashMode={flashMode}
            ref={cameraRef}
          >
            {/* Your camera view */}
        </Camera>
        </View>

        <Center flex={1} px="3">
          <Center>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              animationDuration={500}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>
                  {t("edit")} {pro_name}{" "}
                </Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>{t("name")}</FormControl.Label>
                    <Input
                      value={pro_name}
                      onChangeText={setPro_name}
                      editable={edit}
                    />
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>{t("price")}</FormControl.Label>
                    <Input
                      value={pro_price}
                      onChangeText={setPro_price}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>{t("benefit")}</FormControl.Label>
                    <Input
                      value={pro_benefit}
                      onChangeText={setPro_benefit}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>{t("description")}</FormControl.Label>
                    <TextArea
                      h={20}
                      value={pro_description}
                      onChangeText={(text) => setPro_description(text)}
                      editable={edit}
                    />
                  </FormControl>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>
                          {t("loading-wait")}
                        </Text>
                      ) : (
                        <Text style={{ color: "gray" }}>{t("cancel")}</Text>
                      )}
                    </Button>
                    <TouchableOpacity>
                      <Button
                        style={{
                          backgroundColor: "#68bd00",
                        }}
                        onPress={Updateinformation}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>
                            {t("edit&save")}
                          </Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>


            <Modal
              isOpen={showModalBarcode}
              onClose={() => setShowModalBarcode(false)}
              animationDuration={500}
            >
              <Modal.Content width={(Dimensions.get("window").width)-20} height="820px">
                <Modal.CloseButton />
                <Modal.Header>
                  {t("barcode_scan")}
                </Modal.Header>
                <Modal.Body>

                <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  style={{ width:300, height: 400 }}
                  torchMode={true}
                />

                <Center>
                  <Text>
                    {scannedData}
                  </Text>
                </Center>
                  
                  

                  
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                       
                        setShowModalBarcode(false);
                      }}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>
                          {t("loading-wait")}
                        </Text>
                      ) : (
                        <Text style={{ color: "gray" }}>{t("cancel")}</Text>
                      )}
                    </Button>
                    
                    <TouchableOpacity>
                      <Button
                        style={{
                          backgroundColor: "#68bd00",
                        }}
                        onPress={Updateinformation}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>
                            {t("edit&save")}
                          </Text>
                        )}
                      </Button>
                    </TouchableOpacity>


                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <Modal
              isOpen={showModalSale}
              onClose={() => setShowModalSale(false)}
              animationDuration={500}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>
                  {t("sale")} {pro_name}
                </Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>{t("name")}</FormControl.Label>
                    <Text>{pro_name}</Text>
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>{t("price")}</FormControl.Label>
                    <Text>{pro_price}</Text>
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>{t("quantity")}</FormControl.Label>
                    <Input
                      value={pro_quatity}
                      onChangeText={setQuatity}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <Text
                    style={{
                      color: "green",
                      fontSize: 10,
                    }}
                  >
                    {pro_quatity == 0
                      ? ``
                      : `Total are ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(
                          pro_price * pro_quatity
                        )} and Benefit are ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(pro_benefit * pro_quatity)}.`}
                  </Text>

                  {/* <FormControl mt="3">
                    <FormControl.Label>
                      Show if this{" "}
                      <Text
                        style={{
                          color: "orange",
                          fontWeight: "bold",
                        }}
                      >
                        paid ?
                      </Text>{" "}
                    </FormControl.Label>
                    <View
                      style={{
                        alignItems: "flex-start",
                        justifyContent: "center",
                        width: "100%",
                        height: 40,
                      }}
                    >
                      <Switch
                        defaultIsChecked 
                        offTrackColor="#de003b"
                        onTrackColor="#17ab00"
                        onThumbColor="#107800"
                        offThumbColor="#78002c"
                        size="lg"
                        value={IssalePaid}
                        onValueChange={handleSwitchToggle}
                      />

                      <Text
                        style={{
                          color: IssalePaid ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        Payment Status: {IssalePaid ? "Paid" : "Not Paid"}
                      </Text>
                    </View>
                  </FormControl> */}
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setShowModalSale(false);
                        setIssalePaid(false);
                        setQuatity(0);
                      }}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>
                          {t("loading-wait")}
                        </Text>
                      ) : (
                        <Text style={{ color: "gray" }}>{t("cancel")}</Text>
                      )}
                    </Button>

                    {pro_quatity < 1 ? (
                      <Button
                        style={{
                          backgroundColor: "red",
                        }}
                        onPress={() => {
                          alert(`${t("adding")}`);
                        }}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>
                            {t("apply-now")}
                          </Text>
                        )}
                      </Button>
                    ) : (
                      <TouchableOpacity>
                        <Button
                          style={{
                            backgroundColor: "#68bd00",
                          }}
                          onPress={() => {
                            if (
                              parseInt(pro_quantity) < parseInt(pro_quatity)
                            ) {
                              alert(
                                `${t("more-quantity")}` +
                                  pro_quantity +
                                  `${t("items")}`
                              );
                            } else {
                              Adding_information();
                            }
                          }}
                        >
                          {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                          ) : (
                            <Text style={{ color: "white" }}>
                              {t("apply-now")}
                            </Text>
                          )}
                        </Button>
                      </TouchableOpacity>
                    )}
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <Modal
              isOpen={isInvOpen}
              onClose={() => setIsInvOpen(false)}
              animationDuration={400}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>
                  {t("stock-of")} {pro_name}{" "}
                </Modal.Header>
                <Modal.Body>
                  <Text>
                    {t("product")} {t("name")}: {pro_name}
                  </Text>

                  <FormControl mt="3">
                    <FormControl.Label>{t("quantity")}</FormControl.Label>
                    <Input
                      value={NewPro_quantity}
                      onChangeText={setNewPro_quantity}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setIsInvOpen(false);
                      }}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>
                          {t("loading-wait")}
                        </Text>
                      ) : (
                        <Text style={{ color: "gray" }}>{t("cancel")}</Text>
                      )}
                    </Button>
                    <TouchableOpacity>
                      <Button
                        style={{
                          backgroundColor: "#68bd00",
                        }}
                        onPress={inventoryProduct}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>
                            {t("save-stock")}
                          </Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <Modal
              isOpen={isIncidentalOpen}
              onClose={() => setIsIncidentalOpen(false)}
              animationDuration={400}
            >
              <Modal.Content maxWidth="600px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>
                  {t("incidental")} {t("of")} {pro_name}{" "}
                </Modal.Header>
                <Modal.Body>
                  <Text>
                    {t("product")} {t("name")}: {pro_name}
                  </Text>

                  <FormControl mt="3">
                    <FormControl.Label>{t("quantity")}</FormControl.Label>
                    <Input
                      value={IncidentalQty}
                      onChangeText={setIncidentalQty}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>{t("cause")}</FormControl.Label>
                    <TextArea
                      h={20}
                      value={IncidentalCause}
                      onChangeText={(text) => setIncidentaCause(text)}
                      editable={edit}
                    />
                  </FormControl>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setIsIncidentalOpen(false);
                      }}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>
                          P{t("loading-wait")}
                        </Text>
                      ) : (
                        <Text style={{ color: "gray" }}>{t("cancel")}</Text>
                      )}
                    </Button>

                    <TouchableOpacity>
                      <Button
                        style={{
                          backgroundColor: "#68bd00",
                        }}
                        onPress={IncidentalProduct}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>
                            {t("save")} {t("incident")}
                          </Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <AlertDialog
              leastDestructiveRef={cancelRef}
              isOpen={isOpen}
              onClose={onClose}
            >
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>{t("delete")} </AlertDialog.Header>
                <AlertDialog.Body>
                  <Text>
                    {t("are-you-sure-to-delete-now")} {pro_name} ?
                  </Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="unstyled"
                      colorScheme="coolGray"
                      onPress={onClose}
                      ref={cancelRef}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>
                          {t("loading-wait")}
                        </Text>
                      ) : (
                        <Text style={{ color: "gray" }}>{t("cancel")}</Text>
                      )}
                    </Button>
                    <Button colorScheme="danger" onPress={deleteProduct}>
                      {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={{ color: "white" }}>{t("delete")}</Text>
                      )}
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
          </Center>
        </Center>
      </NativeBaseProvider>
    </SafeAreaView>
  );
                      
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    marginTop: 0,
    width: "100%",
    height: "100%",
    flex: 1,
  },

  containerer: {
    height: "100%",
    marginTop: StatusBar.currentHeight || 0,
  },

  header: {
    backgroundColor: "white",
    height: 60,
    width: "100%",
  },
  textTitle2: {
    fontFamily: "Regular",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    marginLeft: 5,
    color: "#a8006e",
  },
  item: {
    backgroundColor: "#a8006e",
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 5,
    width: "94%",
    height: 70,
    textAlign: "center",
    alignItems: "center",
    borderColor: "#a8006e",
    borderStyle: "solid",
    borderWidth: 2,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    flexDirection: "row",
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  title2: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
    fontWeight: "900",
    width: "100%",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  fuc: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  update: {
    width: "45%",
    height: 50,
    backgroundColor: "#00960a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  delete: {
    width: "45%",
    height: 50,
    backgroundColor: "#b30000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "white",
  },

  itemBtn: {
    backgroundColor: "#a8006e",
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 5,
    width: "94%",
    height: 55,
    textAlign: "center",
    alignItems: "center",
    borderColor: "#a8006e",
    borderStyle: "solid",
    borderWidth: 2,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  itemBtnText: {
    color: "white",
    marginLeft: 10,
  },
});

export default ProductView;
