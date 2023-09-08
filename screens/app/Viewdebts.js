import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
  Platform,
  Vibration,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Button,
  Modal,
  FormControl,
  Input,
  Center,
  NativeBaseProvider,
  AlertDialog,
  useToast,
  Icon,
  TextArea,
} from "native-base";
import { useRoute } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import {
  fetchAlldebtsDatain,
  fetchAlldebtsDataTotals,
} from "../../features/gettalldebts/getalldebts";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Viewdebts = ({ navigation }) => {
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerlbl, setShowPickerlbl] = useState(false);

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
  const [currentusertype, setcurrentUsertype] = useState(
    useSelector((state) => state.userInfos.currentUserType)
  );

  const [usertype, setusertype] = useState(
    useSelector((state) => state.userInfos.currentUserType)
  );


  const [notMessage, setNotMessage] = React.useState("");
  const [companyName, setCompanyName] = useState(
    useSelector((state) => state.userInfos.currentUserCompany)
  );

  //Normal
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const toast = useToast();

  const [SelectedID, setSelectedID] = useState(null); //setProductID
  const [SelectedPhoneNumber, setSelectedPhoneNumber] = useState(null);
  const [SelectedName, setSelectedName] = useState(null);

  //Modals
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setAddShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPay, setIsOpenPay] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pro_qty, setPro_qty] = useState(0);

  //Infos
  const [pro_name, setPro_name] = useState("");
  const [edit, setEdit] = useState(true);

  const [exp_name, setexp_name] = useState("");
  const [exp_amount, setexp_amount] = useState("");
  const [exp_description, setexp_description] = useState("");

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //For search products
  const [searchQuery, setSearchQuery] = useState("");
  const [ident, setIdent] = React.useState("");

  //Add Debts States
  const [SelectedDueDate, setSelectedDueDate] = useState(null);
  const [person_Names, setperson_Names] = useState("");
  const [person_Phone, setperson_Phone] = useState("");
  const [person_Location, setperson_Location] = useState("");
  const [debt_Amount, setDebt_Amount] = useState(0);
  const [debt_Descriptions, setDebt_Descriptions] = useState("");
  const [debt_AmountPay, setDebt_AmountPay] = useState(0);

  const [debtPerson_Names, setDebtPerson_Names] = useState("");
  const [total_Amount, setTotal_Amount] = useState(0);

  const route = useRoute();
  const params = route.params;

  //Sales Data
  const {
    debts_error,
    all_debt,
    debt_isLoading,
    TotalASll_debt,
    Totaldebt_isLoading,
    Totaldebts_error,
    debts_errorIn,
    all_debtIn,
    debt_isLoadingIn,
  } = useSelector((state) => state.getalldebts);

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

  const Setparms = () => {
    setIdent(params.id);
    setDebtPerson_Names(params.name);
    setTotal_Amount(params.amount);
  };

  const onRefresh = () => {
    Setparms();
    setRefreshing(true);
    dispatch(fetchAlldebtsDatain(currentSpt, ident));
    dispatch(fetchAlldebtsDataTotals(currentSpt));

    // perform your refresh logic here
    setRefreshing(false);
  };

  function onDateChange(event, selectedDate) {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "Android");
    setDate(currentDate);

    //alert(date.toDateString());
    const montly = currentDate.getMonth();
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

    const formattedDate =
      year +
      "-" +
      (montly + 1).toString().padStart(2, "0") +
      "-" +
      date.toString().padStart(2, "0");

    setSelectedDueDate(formattedDate);
    setShowPickerlbl(true);
  }

  const makePhoneCall = () => {
    const phoneNumber = SelectedPhoneNumber; // Replace with the desired phone number
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    Setparms();
    loadFonts();
    dispatch(fetchAlldebtsDatain(currentSpt, ident));
    dispatch(fetchAlldebtsDataTotals(currentSpt));
    if (isFocused) {
      dispatch(fetchAlldebtsDatain(currentSpt, ident));
      dispatch(fetchAlldebtsDataTotals(currentSpt));
    }

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
  }, [isFocused, navigation]);

  //Notification and Vibration

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
      //console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const onClose = () => setIsOpen(false);
  const onClosePay = () => setIsOpenPay(false);
  const onCloseAlert = () => setIsOpenAlert(false);

  const formatDate = (myDate) => {
    const dateParts = myDate.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const formattedDate = new Date(year, month - 1, day).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    return formattedDate;
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

  const Item = ({
    id,
    name,
    description,
    expense_name,
    amount,
    time,
    duetime,
    status,
  }) => (
    <Center px="1">
      <View
        style={[
          styles.item,
          {
            borderColor: currenttheme.secondary,
            borderStyle: "solid",
            borderWidth: 2,
          },
        ]}
      >
        <View
          style={{
            width: "70%",
            padding: 2,
            paddingLeft: 10,
            borderRadius: 5,
            backgroundColor: currenttheme.secondary,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: "white",
              fontFamily: "Poppins-Bold",
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontFamily: "Poppins-Regular",
            }}
          >
            Quantity:{" "}
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontFamily: "Poppins-Bold",
                color: "yellow",
              }}
            >
              {expense_name}
            </Text>
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontFamily: "Poppins-Regular",
            }}
          >
            {status == 2
              ? `Half-Due Date: ${duetime}`
              : status == 3
              ? `Full Paid`
              : `Pay Due Date: ${duetime}`}
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 11,
              fontFamily: "Poppins-Regular",
            }}
          ></Text>
        </View>

        <View
          style={{
            width: "30%",
            flexDirection: "column",
          }}
        >
          <Text style={styles.title2}> {amount}</Text>
          <Text
            style={{
              fontSize: 12,
              color: currenttheme.normal,
              textAlign: "right",
              fontFamily: "Poppins-Bold",
            }}
          >
            {time}{" "}
          </Text>
        </View>
      </View>
    </Center>
  );

  const deleteExpense = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      id: parseInt(SelectedID),
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/debts/removedebt.php",
        data,
        config
      )
      .then((response) => {
        console.log(response);
        setNotMessage(`This debt ${SelectedName} has been deleted`);
        schedulePushNotification();
        setIsLoading(false);
        Vibration.vibrate();
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
      })
      .catch((error) => {
        console.log(error);
        setNotMessage(`This debt ${SelectedName} has failed to be deleted`);
        Vibration.vibrate();
        setIsLoading(false);
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
      });
  };

  const PayFull = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      status: 3,
      descriptions: "Yose arayishyuye",
      id: parseInt(SelectedID),
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/debts/paiddebtState.php",
        data,
        config
      )
      .then((response) => {
        //console.log(response);
        setNotMessage(`This debt ${SelectedName} has been full payed`);
        schedulePushNotification();
        setIsLoading(false);
        Vibration.vibrate();
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        setIsOpenPay(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
      })
      .catch((error) => {
        //console.log(error);
        setNotMessage(`This debt ${SelectedName} has failed to be payed`);
        schedulePushNotification();
        Vibration.vibrate();
        setIsLoading(false);
        setIsOpenPay(false);
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
      });
  };

  const SessionPayFull = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      status: 3,
      descriptions: "Yose arayishyuye",
      sess_id: ident,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/debts/paiddebtStateSession.php",
        data,
        config
      )
      .then((response) => {
        //console.log(response);
        setNotMessage(`This debt ${SelectedName} has been full payed`);
        schedulePushNotification();
        setIsLoading(false);
        Vibration.vibrate();
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        setIsOpenPay(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
        alert("Debt payed full!");
      })
      .catch((error) => {
        //console.log(error);
        setNotMessage(`This debt ${SelectedName} has failed to be payed`);
        schedulePushNotification();
        Vibration.vibrate();
        setIsLoading(false);
        setIsOpenPay(false);
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
      });
  };

  const PayHalf = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      descriptions: "Yishyuye igice",
      id: parseInt(SelectedID),
      amount_paid: debt_AmountPay,
      due_date: SelectedDueDate,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/debts/halfpaiddebtState.php",
        data,
        config
      )
      .then((response) => {
        console.log(response);
        setNotMessage(`This debt ${SelectedName} has been half payed`);
        schedulePushNotification();
        setIsLoading(false);
        Vibration.vibrate();
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
      })
      .catch((error) => {
        console.log(error);
        setNotMessage(`This debt ${SelectedName} has failed to be payed`);
        schedulePushNotification();
        Vibration.vibrate();
        setIsLoading(false);
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
      });
  };

  //Adding Command
  const Update_information = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      person_names: person_Names,
      phone: person_Phone,
      location: person_Location,
      amount: parseFloat(debt_Amount),
      due_date: SelectedDueDate,
      descriptions: debt_Descriptions,
      sales_point_id: currentSpt,
      id: SelectedID,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/debts/updatedebt.php",
        data,
        config
      )
      .then((response) => {
        setNotMessage(
          `This debt ${SelectedName} has been updated successfully`
        );
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);

        setSelectedID(null);
        setperson_Names("");
        setperson_Phone("");
        setperson_Location("");
        setDebt_Amount(0);
        setDebt_Descriptions("");

        setIsOpenAlert(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));
      })
      .catch((error) => {
        setNotMessage(
          `This debt ${SelectedName} has been failed to be updated `
        );
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
      });
  };

  //Adding Command
  const Adding_information = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      person_names: person_Names,
      phone: person_Phone,
      location: person_Location,
      amount: parseFloat(debt_Amount),
      due_date: SelectedDueDate,
      descriptions: debt_Descriptions,
      sales_point_id: currentSpt,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/debts/insertdebt.php",
        data,
        config
      )
      .then((response) => {
        setNotMessage(`This debt ${SelectedName} has been saved successfully`);
        schedulePushNotification();
        setEdit(true);
        setAddShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        dispatch(fetchAlldebtsDatain(currentSpt, ident));
        dispatch(fetchAlldebtsDataTotals(currentSpt));

        setSelectedID(null);
        setperson_Names("");
        setperson_Phone("");
        setperson_Location("");
        setDebt_Amount(0);
        setDebt_Descriptions("");

        setIsOpenAlert(false);
      })
      .catch((error) => {
        setNotMessage(`This debt ${SelectedName} has failed to be saved`);
        schedulePushNotification();
        setEdit(true);
        setAddShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);

        setSelectedID(null);
        setperson_Names("");
        setperson_Phone("");
        setperson_Location("");
        setDebt_Amount(0);
        setDebt_Descriptions("");

        setIsOpenAlert(false);
      });
  };

  //Time ago function

  function timeAgo(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    const now = new Date();
    const diffMs = now - dateTime;
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }

  return (
    <SafeAreaView style={styles.containerer}>
      <NativeBaseProvider>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            <StatusBar
              backgroundColor={currenttheme.secondary} // Set the background color of the status bar
              barStyle="white" // Set the text color of the status bar to dark
              hidden={false} // Show the status bar
            />

            <View
              style={{
                backgroundColor: "white",
                height: 26,
                width: "100%",
              }}
            >
              {Totaldebt_isLoading ? (
                <ActivityIndicator size="small" color="#a8006e" />
              ) : (
                TotalASll_debt.map((post) => (
                  <View key="1" style={{
                    marginBottom:10
                  }}>
                    <Text
                      
                      style={{
                        textAlign: "center",
                        fontSize: 15,
                        marginLeft: 5,
                        color: "black",
                        fontFamily: "Poppins-Bold",
                      }}
                    >
                      Debt of {debtPerson_Names}
                    </Text>
                    <Text style={{
                        textAlign: "center",
                        fontSize: 15,
                        marginLeft: 5,
                        color: "black",
                        fontFamily: "Poppins-Bold",
                        
                      }}>
                      {" "}
                      Total Amount:{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "RWF",
                      }).format(total_Amount)}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.normal,
                },
              ]}
            >
              All {all_debtIn.length}{" "}
              {all_debtIn.length == 1 ? "debt" : "debts"} list
            </Text>

            {/* <TouchableOpacity
              style={[
                styles.itemBtn,
                {
                  backgroundColor: currenttheme.secondary,
                  borderColor: currenttheme.secondary,
                },
              ]}
              onPress={() => setAddShowModal(true)}
            >
              <MaterialIcons name="add-to-photos" size={24} color="white" />
              <Text style={styles.itemBtnText}>Pay all Debt</Text>
            </TouchableOpacity> */}

            <Center>
              <Input
                w={{
                  base: "94%",
                  md: "25%",
                }}
                onChangeText={(e) => {
                  setSearchQuery(e);
                  dispatch(fetchSearchSalesData(currentCompany, currentSpt, e));
                }}
                value={searchQuery}
                InputLeftElement={
                  <Icon
                    as={<Ionicons name="ios-search-circle" />}
                    size={5}
                    ml="2"
                    color="muted.600"
                  />
                }
                placeholder="Search..."
              />

              {total_Amount < 1 ? (
                ""
              ) : (
                
                usertype == "BOSS"?
                <TouchableOpacity
                  style={[
                    styles.itemBtn,
                    {
                      backgroundColor: currenttheme.secondary,
                      borderColor: currenttheme.secondary,
                    },
                  ]}
                  onPress={() => {
                    Alert.alert("SELLEASEP", "Are sure to pay full debts", [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      { text: "OK", onPress: () => SessionPayFull() },
                    ]);
                  }}
                >
                  <MaterialCommunityIcons
                    name="cash-check"
                    size={30}
                    color="white"
                  />
                  <Text style={styles.itemBtnText}>Pay all Debt</Text>
                </TouchableOpacity>
                :null

              )}
            </Center>
          </View>
        </ScrollView>

        {debt_isLoading ? (
          <View>
            <Center>
              <ActivityIndicator size="large" color={currenttheme.secondary} />
              <Text style={styles.textInGFuc}>Loading Please Wait...</Text>
            </Center>
          </View>
        ) : (
          usertype == "BOSS"?
          <FlatList
            style={{
              backgroundColor: "white",
            }}
            data={all_debtIn}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedID(item.id);
                  setperson_Names(item.person_names);
                  setperson_Phone(item.phone);
                  setperson_Location(item.location);
                  setDebt_Amount(item.amount);
                  setDebt_Descriptions(item.descriptions);
                  setSelectedDueDate(item.due_date);
                  setSelectedPhoneNumber(item.phone);

                  if (item.status == 3) {
                    alert("Debt is full Paid..");
                  } else {
                    setIsOpenAlert(true);
                  }
                }}
              >
                <Item
                  name={item.product_name}
                  id={item.id}
                  amount={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.amount)}
                  expense_name={item.qty}
                  duetime={formatDate(item.due_date)}
                  status={item.status}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
          :

          <FlatList
          style={{
            backgroundColor: "white",
          }}
          data={all_debtIn}
          renderItem={({ item }) => (
            <TouchableOpacity
            >
              <Item
                name={item.product_name}
                id={item.id}
                amount={new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "RWF",
                }).format(item.amount)}
                expense_name={item.qty}
                duetime={formatDate(item.due_date)}
                status={item.status}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
          
        )}

        <Center flex={1} px="3">
          <Center>
            <Modal
              isOpen={showAddModal}
              onClose={() => {
                setAddShowModal(false);
              }}
              animationDuration={500}
            >
              <Modal.Content maxWidth="500px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>Add New</Modal.Header>

                <Modal.Body>
                  <FormControl mt="3">
                    <FormControl.Label>Owner names</FormControl.Label>
                    <Input
                      value={person_Names}
                      onChangeText={setperson_Names}
                      editable={edit}
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Phone</FormControl.Label>
                    <Input
                      value={person_Phone}
                      onChangeText={setperson_Phone}
                      editable={edit}
                      inputMode="tel"
                      keyboardType="phone-pad"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Location</FormControl.Label>
                    <Input
                      value={person_Location}
                      onChangeText={setperson_Location}
                      editable={edit}
                      inputMode="text"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Amount</FormControl.Label>
                    <Input
                      value={debt_Amount}
                      onChangeText={setDebt_Amount}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Due date</FormControl.Label>
                    <TouchableOpacity
                      onPress={() => {
                        setShowPicker(true);
                        setShowPickerlbl(false);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          width: 100,
                          height: 80,
                          borderRadius: 10,
                          alignItems: "center",
                          padding: 15,
                          flax: 1,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          margin: 5,
                        }}
                      >
                        <MaterialIcons
                          name="date-range"
                          size={24}
                          color={currenttheme.primary}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 10,
                            color: "#0a0a0a",
                            fontFamily: "Poppins-Regular",
                          }}
                        >
                          Pick Date
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {showPickerlbl ? (
                      <Text>Picked date: {SelectedDueDate} </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          color: "green",
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        Please wait for set....
                      </Text>
                    )}
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Description</FormControl.Label>
                    <TextArea
                      h={20}
                      value={debt_Descriptions}
                      onChangeText={(text) => setDebt_Descriptions(text)}
                      editable={edit}
                      inputMode="text"
                      keyboardType="default"
                    />
                  </FormControl>
                </Modal.Body>

                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="ghost"
                      colorScheme="blueGray"
                      onPress={() => {
                        setAddShowModal(false);
                      }}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>Please wait..</Text>
                      ) : (
                        <Text style={{ color: "gray" }}>Cancel</Text>
                      )}
                    </Button>

                    <TouchableOpacity>
                      <Button
                        style={{
                          backgroundColor: currenttheme.secondary,
                        }}
                        onPress={Adding_information}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>Save Debt</Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <Modal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
              }}
              animationDuration={500}
            >
              <Modal.Content maxWidth="500px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>Edit</Modal.Header>

                <Modal.Body>
                  <FormControl mt="3">
                    <FormControl.Label>Owner names</FormControl.Label>
                    <Input
                      value={person_Names}
                      onChangeText={setperson_Names}
                      editable={edit}
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Phone</FormControl.Label>
                    <Input
                      value={person_Phone}
                      onChangeText={setperson_Phone}
                      editable={edit}
                      inputMode="tel"
                      keyboardType="phone-pad"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Location</FormControl.Label>
                    <Input
                      value={person_Location}
                      onChangeText={setperson_Location}
                      editable={edit}
                      inputMode="text"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Amount</FormControl.Label>
                    <Input
                      value={debt_Amount}
                      onChangeText={setDebt_Amount}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Due date</FormControl.Label>
                    <TouchableOpacity
                      onPress={() => {
                        setShowPicker(true);
                        setShowPickerlbl(false);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          width: 100,
                          height: 80,
                          borderRadius: 10,
                          alignItems: "center",
                          padding: 15,
                          flax: 1,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          margin: 5,
                        }}
                      >
                        <MaterialIcons
                          name="date-range"
                          size={24}
                          color={currenttheme.primary}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 10,
                            color: "#0a0a0a",
                            fontFamily: "Poppins-Regular",
                          }}
                        >
                          Pick Date
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {showPickerlbl ? (
                      <Text>Picked date: {SelectedDueDate} </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          color: "green",
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        Please wait for set....
                      </Text>
                    )}
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>Description</FormControl.Label>
                    <TextArea
                      h={20}
                      value={debt_Descriptions}
                      onChangeText={(text) => setDebt_Descriptions(text)}
                      editable={edit}
                      inputMode="text"
                      keyboardType="default"
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

                        setSelectedID(null);
                        setperson_Names("");
                        setperson_Phone("");
                        setperson_Location("");
                        setDebt_Amount(0);
                        setDebt_Descriptions("");
                      }}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>Please wait..</Text>
                      ) : (
                        <Text style={{ color: "gray" }}>Cancel</Text>
                      )}
                    </Button>
                    <TouchableOpacity>
                      <Button
                        style={{
                          backgroundColor: currenttheme.secondary,
                        }}
                        onPress={Update_information}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>Edit Debt</Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <AlertDialog
              leastDestructiveRef={cancelRef}
              isOpen={isOpenAlert}
              onClose={onCloseAlert}
              size="xl"
            >
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Debt Quick Actions</AlertDialog.Header>
                <AlertDialog.Body>
                  <Text>
                    Here are for Edit or Remove selected debt {SelectedName}.
                  </Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    {/* <Button
                      variant="unstyled"
                      colorScheme="coolGray"
                      onPress={onCloseAlert}
                      ref={cancelRef}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>Please wait..</Text>
                      ) : (
                        <Text style={{ color: "gray" }}>Cancel</Text>
                      )}
                    </Button> */}

                    <Button
                      colorScheme="success"
                      onPress={() => {
                        setShowModal(true);
                        setIsOpenAlert(false);
                      }}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={{ color: "white" }}>Edit</Text>
                      )}
                    </Button>

                    <Button
                      colorScheme="danger"
                      onPress={() => {
                        setIsOpen(true);
                        setIsOpenAlert(false);
                      }}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={{ color: "white" }}>Remove</Text>
                      )}
                    </Button>

                    <Button
                      colorScheme="info"
                      onPress={() => {
                        setIsOpen(false);
                        setIsOpenAlert(false);
                        setIsOpenPay(true);
                      }}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={{ color: "white" }}>Payment</Text>
                      )}
                    </Button>

                    <Button colorScheme="success" onPress={makePhoneCall}>
                      {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Ionicons name="call" size={18} color="white" />
                      )}
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>

            <AlertDialog
              leastDestructiveRef={cancelRef}
              isOpen={isOpen}
              onClose={onClose}
            >
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Delete</AlertDialog.Header>
                <AlertDialog.Body>
                  <Text>Are you sure to delete {SelectedName} debt now ?</Text>
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
                        <Text style={{ color: "gray" }}>Please wait..</Text>
                      ) : (
                        <Text style={{ color: "gray" }}>Cancel</Text>
                      )}
                    </Button>

                    <Button colorScheme="danger" onPress={deleteExpense}>
                      {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={{ color: "white" }}>Delete</Text>
                      )}
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>

            <AlertDialog
              leastDestructiveRef={cancelRef}
              isOpen={isOpenPay}
              onClose={onClosePay}
            >
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Payment</AlertDialog.Header>
                <AlertDialog.Body>
                  <Text>Pay debt of {person_Names} on this item ?</Text>

                  <Text>
                    Current debt Amount{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(debt_Amount)}
                  </Text>

                  {/* <FormControl mt="3">
                    <FormControl.Label>Enter paid amount</FormControl.Label>
                    <Input
                      value={debt_AmountPay}
                      onChangeText={setDebt_AmountPay}
                      editable={edit}
                      inputMode="numeric"
                    />

                    <FormControl.Label>Due date</FormControl.Label>
                    <TouchableOpacity
                      onPress={() => {
                        setShowPicker(true);
                        setShowPickerlbl(false);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          width: 100,
                          height: 80,
                          borderRadius: 10,
                          alignItems: "center",
                          padding: 15,
                          flax: 1,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          margin: 5,
                        }}
                      >
                        <MaterialIcons
                          name="date-range"
                          size={24}
                          color={currenttheme.primary}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 10,
                            color: "#0a0a0a",
                            fontFamily: "Poppins-Regular",
                          }}
                        >
                          Pick Date
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {showPickerlbl ? (
                      <Text>Picked date: {SelectedDueDate} </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          color: "green",
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        Please wait for set....
                      </Text>
                    )}

                    <Button
                      colorScheme="warning"
                      onPress={PayHalf}
                      style={{
                        marginTop: 10,
                      }}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Text>
                            <MaterialCommunityIcons
                              name="circle-half-full"
                              size={24}
                              color="white"
                            />
                          </Text>
                          <Text style={{ color: "white", marginLeft: 10 }}>
                            Half Payment
                          </Text>
                        </View>
                      )}
                    </Button>
                  </FormControl> */}
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button
                      variant="unstyled"
                      colorScheme="coolGray"
                      onPress={onClosePay}
                      ref={cancelRef}
                    >
                      {isLoading ? (
                        <Text style={{ color: "gray" }}>Please wait..</Text>
                      ) : (
                        <Text style={{ color: "gray" }}>Cancel</Text>
                      )}
                    </Button>
                    
                    <Button colorScheme="info" onPress={PayFull}>
                      {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Text>
                            <MaterialCommunityIcons
                              name="moon-full"
                              size={24}
                              color="white"
                            />
                          </Text>
                          <Text style={{ color: "white", marginLeft: 10 }}>
                            Full Payment
                          </Text>
                        </View>
                      )}
                    </Button>


                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
          </Center>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
              theme={{
                backgroundColor: "#001935",
                textColor: "#FFFFFF",
                headerBackgroundColor: "#001935",
                headerTextColor: "#FFFFFF",
              }}
            />
          )}
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
    height: 230,
    flex: 1,
  },

  containerer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "white",
    height: 60,
    width: "100%",
  },
  textTitle2: {
    fontFamily: "Regular",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
    color: "#a8006e",
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 2,
    borderRadius: 10,
    width: "100%",
    height: 110,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  title: {
    fontSize: 10,
    color: "white",
    textAlign: "center",
    fontWeight: "900",
    width: "50%",
    textAlign: "left",
    backgroundColor: "#690044",
    height: "100%",
    padding: 6,
    borderRadius: 5,
    alignItems: "center",
  },

  title2: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    fontWeight: "900",
    width: "100%",
    textAlign: "right",
  },

  itemBtn: {
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 10,
    width: "94%",
    height: 55,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },

  itemBtnText: {
    color: "white",
    marginLeft: 10,
  },
});

export default Viewdebts;
