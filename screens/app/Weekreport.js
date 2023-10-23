import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
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
  //Modal,
} from "react-native";
import * as Font from "expo-font";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";

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
} from "native-base";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { useRoute } from "@react-navigation/native";
import {
  fetchAllPickingfromtoSalesData,
  fetchPickingfromtototals,
  fetchSearchPickingfromtoSalesData,
} from "../../features/getallsales/getallsales";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import i18next, {languageResources} from './services/i18next';
import {useTranslation} from 'react-i18next';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Weekreport = ({ navigation }) => {
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  //Normal
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const [SelectedID, setSelectedID] = useState(null); //setProductID
  const [SelectedPID, setProductID] = useState(null);
  const [SelectedName, setSelectedName] = useState(null);
  const [notMessage, setNotMessage] = React.useState("");

  //Modals
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pro_qty, setPro_qty] = useState(0);

  //Infos
  const [pro_name, setPro_name] = useState("");
  const [edit, setEdit] = useState(true);
  const {t} = useTranslation();
  const changeLng = lng => {
      i18next.changeLanguage(lng);
      setVisible(false);
    };

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const route = useRoute();

  //For search products
  const [searchQuery, setSearchQuery] = useState("");

  //Sales Data

  const { all_sale_error, all_sales, all_sales_isLoading } = useSelector(
    (state) => state.all_sales
  );

  const { daysTotalsload, all_DayTotals, daysTotalsfailes } = useSelector(
    (state) => state.all_sales
  );

  const [printLoad, setPrintLoad] = React.useState(false);
  const [company_Color, setcompany_Color] = useState(
    useSelector((state) => state.userInfos.CompanyColors)
  );

const [company_name, setcompany_name] = useState(
    useSelector((state) => state.userInfos.currentUserCompany)
  );

  const [Usernames, setUsernames] = useState(
    useSelector((state) => state.userInfos.currentUser)
  );

const [company_Logo, setcompany_Logo] = useState(
    useSelector((state) => state.userInfos.Companylogo)
  );

  const [location_Spt, setLocation_Spt] = useState(
    useSelector((state) => state.userInfos.SptLocation)
  );
  //Generate Days

  function getMondayToSundayDates() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = currentDay === 0 ? 6 : currentDay - 1; // Calculate the difference from Monday

    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - diff);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      monday,
      tuesday: new Date(monday.getTime() + 24 * 60 * 60 * 1000),
      wednesday: new Date(monday.getTime() + 2 * 24 * 60 * 60 * 1000),
      thursday: new Date(monday.getTime() + 3 * 24 * 60 * 60 * 1000),
      friday: new Date(monday.getTime() + 4 * 24 * 60 * 60 * 1000),
      saturday: new Date(monday.getTime() + 5 * 24 * 60 * 60 * 1000),
      sunday,
    };
  }

  // Example usage
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
    getMondayToSundayDates();

  const currentDate = monday;

  //alert(date.toDateString());
  const montly = currentDate.getMonth();
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDateMonday =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");

  const currentDatesunday = sunday;

  //alert(date.toDateString());
  const montlys = currentDatesunday.getMonth();
  const dates = currentDatesunday.getDate();
  const years = currentDatesunday.getFullYear();

  const formattedDateSunday =
    years +
    "-" +
    (montlys + 1).toString().padStart(2, "0") +
    "-" +
    dates.toString().padStart(2, "0");

  const setStart = formattedDateMonday;
  const setEnd = formattedDateSunday;

  //End of Generate Days

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
    dispatch(
      fetchAllPickingfromtoSalesData(
        currentCompany,
        currentSpt,
        setStart,
        setEnd
      )
    );
    dispatch(fetchPickingfromtototals(currentSpt, setStart, setEnd));
    // perform your refresh logic here
    setRefreshing(false);
  };

  useEffect(() => {
    loadFonts();
    dispatch(
      fetchAllPickingfromtoSalesData(
        currentCompany,
        currentSpt,
        setStart,
        setEnd
      )
    );
    dispatch(fetchPickingfromtototals(currentSpt, setStart, setEnd));
    if (isFocused) {
      dispatch(
        fetchAllPickingfromtoSalesData(
          currentCompany,
          currentSpt,
          setStart,
          setEnd
        )
      );
      dispatch(fetchPickingfromtototals(currentSpt, setStart, setEnd));
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
        title: `Shami Boutique sales system`,
        body: `You've add new product ${pro_name}`,
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
  const onCloseAlert = () => setIsOpenAlert(false);

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
    name,
    id,
    price,
    quantity,
    total,
    time,
    remainqty,
    sid,
    benefit,
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
            padding: 6,
            borderRadius: 5,
            backgroundColor: currenttheme.secondary,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "white",
              fontFamily: "Poppins-Bold",
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontFamily: "Poppins-Regular",
            }}
          >
            {t('sales')} {t('quantity')}: {quantity}
            {"   "}
            {t('remain')}:{remainqty} {"   "}{" "}
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: currentusertype == "BOSS" ? 11 : 0,
              fontFamily: "Poppins-Regular",
            }}
          >
            {currentusertype == `BOSS` ? `${t('benefit')}: ` + benefit : ""}
          </Text>
        </View>

        <View
          style={{
            width: "30%",
            flexDirection: "column",
          }}
        >
          <Text style={styles.title2}> {price}</Text>
          <Text
            style={{
              fontSize: 10,
              color: currenttheme.normal,
              textAlign: "right",
              fontFamily: "Poppins-Bold",
            }}
          >
            {time}
          </Text>
        </View>
      </View>
    </Center>
  );

  const deleteSales = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      sales_id: parseInt(SelectedID),
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/sales/deletesales.php",
        data,
        config
      )
      .then((response) => {
        console.log(response);
        setNotMessage(`This sale ${SelectedName} has been deleted`);
        schedulePushNotification();
        setIsLoading(false);
        Vibration.vibrate();
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAllSalesData(currentCompany, currentSpt));
      })
      .catch((error) => {
        console.log(error);
        setNotMessage(`This sale ${SelectedName} has failed to be deleted`);
        Vibration.vibrate();
        setIsLoading(false);
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAllSalesData(currentCompany, currentSpt));
      });
  };

  //Adding Command
  const Update_information = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      product_id: parseInt(SelectedPID),
      quantity: pro_qty,
      s_id: parseInt(SelectedID),
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/sales/updatesales.php",
        data,
        config
      )
      .then((response) => {
        console.log(response);
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        dispatch(fetchAllSalesData(currentCompany, currentSpt));
        setPro_qty(0);
      })
      .catch((error) => {
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setPro_qty(0);
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
      return `${diffSeconds} ${t('secago')}`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${t('minago')}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${t('hago')}`;
    } else {
      return `${diffDays} ${t('dayago')}`;
    }
  }


  // Print pdf

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

  //Printing

  const formatDateTime = (myDateTime) => {
    const dateTimeParts = myDateTime.split(" ");
    const date = dateTimeParts[0];
    const time = dateTimeParts[1];

    const dateParts = date.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const timeParts = time.split(":");
    const hour = timeParts[0];
    const minute = timeParts[1];
    const second = timeParts[2];

    const formattedDate = new Date(year, month - 1, day).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const formattedTime = `${hour}:${minute}:${second}`;

    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    return formattedDateTime;
  };

  const rpmontly = currentDate.getMonth();
  const rpdate = currentDate.getDate();
  const rpyear = currentDate.getFullYear();

  const formattedDate =
    rpyear +
    "-" +
    (rpmontly + 1).toString().padStart(2, "0") +
    "-" +
    rpdate.toString().padStart(2, "0");

  const createDynamicTable = () => {
    let table = "";
    for (let i = 0; i < all_sales.length; i++) {
      const item = all_sales[i];
      table += `
        <tr height="35px" >
        <td style="font-size: 12px;font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal;  vertical-align: top; padding: 0 0 7px;" align="left" width="150">${i+1}. ${
          item.name
        }</td>
        <td style="font-size: 12px;font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal;  vertical-align: top; padding: 0 0 7px;" align="left" width="150">${
          item.quantity
        }</td>
        <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal;  vertical-align: top; padding: 0 0 7px;" align="left" width="100">${new Intl.NumberFormat(
          "en-US",
          {
            style: "currency",
            currency: "RWF",
          }
        ).format(item.price)}</td>

       
        
          <td style="font-size: 12px;font-family: 'Open Sans', sans-serif; color: ${
            item.paid_status == "Paid" ? "green" : "red"
          }; font-weight: bold;  vertical-align: top; padding: 0 0 7px;" align="left" width="150">${
        item.paid_status
      }</td> 
      
      <td style="font-size: 9px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: bold;  vertical-align: top; padding: 0 0 7px;" align="right" width="150">${formatDateTime(
          item.Sales_time
        )}</td>
          
            <td style="font-size: 12px;font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal;  vertical-align: top; padding: 0 0 7px;" align="right" width="150">${new Intl.NumberFormat(
              "en-US",
              {
                style: "currency",
                currency: "RWF",
              }
            ).format(item.Total)}</td>
        </tr>

        <tr height='20px' width="600">
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              
              </tr>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title> Order confirmation </title>
<meta name="robots" content="noindex,nofollow" />
<meta name="viewport" content="width=device-width; initial-scale=1.0;" />


<style type="text/css">
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);
body { margin: 0; padding: 0; background: white; }
div, p, a, li, td { -webkit-text-size-adjust: none; }
.ReadMsgBody { width: 100%; background-color: #ffffff; }
.ExternalClass { width: 100%; background-color: #ffffff; }
body { width: 100%; height: 100%; background-color: white; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
html { width: 100%; }
p { padding: 0 !important; margin-top: 0 !important; margin-right: 0 !important; margin-bottom: 0 !important; margin-left: 0 !important; }
.visibleMobile { display: none; }
.hiddenMobile { display: block; }

@media only screen and (max-width: 600px) {
body { width: auto !important; }
table[class=fullTable] { width: 96% !important; clear: both; }
table[class=fullPadding] { width: 85% !important; clear: both; }
table[class=col] { width: 45% !important; }
.erase { display: none; }
}

@media only screen and (max-width: 420px) {
table[class=fullTable] { width: 100% !important; clear: both; }
table[class=fullPadding] { width: 85% !important; clear: both; }
table[class=col] { width: 100% !important; clear: both; }
table[class=col] td { text-align: left !important; }
.erase { display: none; font-size: 0; max-height: 0; line-height: 0; padding: 0; }
.visibleMobile { display: block !important; }
.hiddenMobile { display: none !important; }
}
</style>


<!-- Header -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="white">
<tr>
<td height="20"></td>
</tr>
<tr>
<td>
<table width="800" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff" style="border-radius: 10px 10px 0 0;">
  <tr class="hiddenMobile">
    <td height="40"></td>
  </tr>
  <tr class="visibleMobile">
    <td height="30"></td>
  </tr>

  <tr>
    <td>
      <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
        <tbody>
          <tr>
            <td>
              <table width="240" border="0" cellpadding="0" cellspacing="0" align="left" class="col">
                <tbody>
                  <tr>
                    <td align="left"> <img src="${company_Logo}" width="75" height="75" alt="logo" border="0" style="object-fit:cover;" /></td>
                  </tr>
                  <tr class="hiddenMobile">
                    <td height="40"></td>
                  </tr>
                  <tr class="visibleMobile">
                    <td height="20"></td>
                  </tr>
                  <tr>
                    <td style="font-size: 22px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; font-weight:bold;  vertical-align: top; text-align: left;">
                      ${company_name}
                    </td>
                  </tr>

                  <tr>
                <td height="1" colspan="4" style="border-bottom:1px solid #e4e4e4"></td>
              </tr>

                  <tr>
                      <td style="padding-top:20px; font-size: 18px; color: #5b5b5b; font-family: 'Open Sans', sans-serif;   vertical-align: top; text-align: left;">
                      ${t('manager')}, ${Usernames}
                    </td>
                      </tr>

                      <tr>
                      <td style="font-size: 12px; color: ${company_Color}; font-family: 'Open Sans', sans-serif;   vertical-align: top; text-align: left;">
                      ${location_Spt} ${t('spt')}
                    </td>
                      </tr>
                </tbody>
              </table>
              <table width="220" border="0" cellpadding="0" cellspacing="0" align="right" class="col">
                <tbody>
                  <tr class="visibleMobile">
                    <td height="20"></td>
                  </tr>
                  <tr>
                    <td height="5"></td>
                  </tr>
                  <tr>
                    <td style="font-size: 26px; color: ${company_Color}; letter-spacing: 1px; font-family: 'Open Sans', sans-serif; font-weight:bold;  vertical-align: top; text-align: right;">
                    {t('weeksp')}
                    </td>
                  </tr>
                  <tr>
                  <tr class="hiddenMobile">
                    <td height="50"></td>
                  </tr>
                  <tr class="visibleMobile">
                    <td height="20"></td>
                  </tr>
                  <tr>
                    <td style="font-size: 16px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: right;">
                      <small>${formatDate(formattedDate)}</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</table>
</td>
</tr>
</table>
<!-- /Header -->
<!-- Order Details -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="white" >
<tbody>
<tr>
<td>
  <table width="800" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
    <tbody>
      <tr>
      <tr class="hiddenMobile">
        <td height="60"></td>
      </tr>
      <tr class="visibleMobile">
        <td height="40"></td>
      </tr>
      <tr>
        <td>
          <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
            <tbody>
              <tr>
                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: ${company_Color}; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 10px 7px 0;" align="left" width="150">
                ${t('item')}
                </th>
              <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: ${company_Color}; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="left" width="100">
                ${t('quantity')}
              </th>

               

                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: ${company_Color}; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="left" width="100">
                  ${t('price')}
                </th> 
                
                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: ${company_Color}; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="left" width="150">
                ${t('paidst')}
                </th>

                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: ${company_Color}; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="right" width="150">
                ${t('time')}
                </th>

                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: ${company_Color}; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="right" width="100">
                 ${t('total')}
                </th>
              </tr>
              <tr height='20px' width="600">
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              <td height="2"  style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
       
              </tr>
              
              ${table}
              
              
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td height="20"></td>
      </tr>
    </tbody>
  </table>
</td>
</tr>
</tbody>
</table>
<!-- /Order Details -->
<!-- Total -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="white">
<tbody>
<tr>
<td>
  <table width="800" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
    <tbody>
      <tr>
        <td>

          <!-- Table Total -->
          <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
            <tbody>

            <!-- 
              
            <tr>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 22px; vertical-align: top; text-align:right; ">
                  
                </td>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 22px; vertical-align: top; text-align:right; white-space:nowrap;" width="80">
                 
                </td>
              </tr>
              -->
              
              <tr>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                </td>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                  <strong>${t("total")} ${t("paid")} ${t(
      "amount"
    )}:  ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
    }).format(
      all_sales
        .filter((obj) => obj.paid_status === "Paid")
        .reduce((sum, obj) => sum + parseInt(obj.Total), 0)
    )}</strong>
                </td>
              </tr>

              <tr>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                  
                </td>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                  <strong>${t("total")} ${t("no-paid")} ${t(
      "amount"
    )}:  ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
    }).format(
      all_sales
        .filter((obj) => obj.paid_status === "Not Paid")
        .reduce((sum, obj) => sum + parseInt(obj.Total), 0)
    )}
    ${`\n`}
    <br/>
    ---------------------------------------------------------
    <br/><br/>
    </strong>
                </td>
                
              </tr>

              
              <tr>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                </td>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                  <strong>${t("total")} ${t(
      "amount"
    )}:  ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
    }).format(
      all_sales.reduce((sum, obj) => sum + parseInt(obj.Total), 0)
    )}</strong>
                </td>
              </tr>

              <tr>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                  
                </td>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                  <strong>${t("total")} ${t("benefit")} ${t(
      "amount"
    )}:  ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
    }).format(
      all_sales.reduce((sum, obj) => sum + parseInt(obj.benefit), 0)
    )}</strong>
                </td>
              </tr>
              
            </tbody>
          </table>
          <!-- /Table Total -->

        </td>
      </tr>
    </tbody>
  </table>
</td>
</tr>
</tbody>
</table>
<!-- /Total -->

<table width="800" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding" bgcolor="white">
            <tbody>
              <tr>
                <td>
<table width="220" border="0" cellpadding="0" cellspacing="0" align="left" class="col" style="margin-left:100px; margin-top:50px;">
                    <tbody>
                      <tr class="visibleMobile">
                        <td height="20"></td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 1; vertical-align: top; ">
                          <strong>${t('manager')} ${t('name')}: ${Usernames}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td width="100%" height="40"></td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: 'Open Sans', sans-serif; font-weight:100; color: #5b5b5b; line-height: 1; vertical-align: top; ">
                          <strong>${t('stamp')}</strong>
                        </td>
                      </tr>

                      <tr height='20px'>
              <td height="1" colspan="4" style="border-bottom:1px solid #e4e4e4; margin-bottom:10px"></td>
              </tr>
                      <tr>
                        <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                          <br/>
                          <br/>
                          <br/>

                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table></td></tr></tbody></table>




<!-- Information -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="white">
<tbody>
<tr>
<td>
  <table width="800" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
    <tbody>
      <tr class="visibleMobile">
        <td height="30">
      </td>
      </tr>
    </tbody>
  </table>
</td>
</tr>
</tbody>
</table>




<!-- /Information -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="white">

<tr>
<td>
<table width="800" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff" style="border-radius: 0 0 10px 10px;">
  <tr>
    <td>
      <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
        <tbody>
          <tr>
            <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: left;">
             
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
  <tr class="spacer">
    <td height="50"></td>
  </tr>

</table>
</td>
</tr>
<tr>
<td height="20"></td>
</tr>
</table>
      </html>
    `;

    return html;
  };

  const printToFile = async () => {
    setPrintLoad(true);

    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html: createDynamicTable(),
    });

    
    console.log("File has been saved to:", uri);
    
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    
    setPrintLoad(false);
  };

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
                height: currentusertype == "BOSS" ? 60 : 26,
                width: "100%",
              }}
            >
              {daysTotalsload ? (
                <ActivityIndicator size="small" color="#a8006e" />
              ) : (
                all_DayTotals.map((post) => (
                  <Text
                    key="1"
                    style={{
                      textAlign: "center",
                      fontSize: 18,
                      marginLeft: 5,
                      color: "black",
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    {t('total')} {t('sales')}:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(post.Totat_sales_Amount)}
                  </Text>
                ))
              )}

              {daysTotalsload ? (
                <ActivityIndicator size="small" color="#a8006e" />
              ) : currentusertype == "BOSS" ? (
                all_DayTotals.map((post) => (
                  <Text
                    key="1"
                    style={{
                      textAlign: "center",
                      fontSize: currentusertype == "BOSS" ? 18 : 0,
                      marginLeft: 5,
                      color: "black",
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    {t('benefit')}:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(post.Totat_sales_Benefits)}
                  </Text>
                ))
              ) : (
                ""
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
              {t('all')} {all_sales.length} {all_sales.length == 1 ? `${t('sale')}` : `${t('sales')}`}{" "}
              {t('list')}
            </Text>

            <Center>
            <TouchableOpacity
                onPress={printToFile}
                style={{
                  width: "93%",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: currenttheme.secondary,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    flexDirection: "row",
                    marginBottom: 20,
                  }}
                >
                  <Entypo name="print" size={24} color="white" />
                  <Text
                    style={{
                      fontFamily: "Poppins-SemiBold",
                      textAlign: "center",
                      fontSize: 16,
                      marginLeft: 5,
                      color: "white",
                      marginLeft: 20,
                    }}
                  >
                    {t('expdf')}
                  </Text>
                </View>
              </TouchableOpacity>

              <Input
                w={{
                  base: "94%",
                  md: "25%",
                }}
                onChangeText={(e) => {
                  setSearchQuery(e);
                  dispatch(
                    fetchSearchPickingfromtoSalesData(
                      currentCompany,
                      currentSpt,
                      setStart,
                      setEnd,
                      e
                    )
                  );
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
                placeholder={t('search')}
              />
            </Center>
          </View>
        </ScrollView>

        {all_sales_isLoading ? (
          <View>
            <Center>
              <ActivityIndicator size="large" color={currenttheme.secondary} />
              <Text style={styles.textInGFuc}>{t('loading-wait')}</Text>
            </Center>
          </View>
        ) : (
          <FlatList
            style={{
              backgroundColor: "white",
            }}
            data={all_sales}
            renderItem={({ item }) => (
              <TouchableOpacity
                // onPress={() => {
                //   setSelectedID(item.sales_id);
                //   setProductID(item.product_id);
                //   setSelectedName(item.name);
                //   setIsOpenAlert(true);
                // }}
              >
                <Item
                  name={item.name}
                  id={item.id}
                  price={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.Total)}
                  quantity={item.quantity}
                  total={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.Total)}
                  time={timeAgo(item.Sales_time)}
                  remainqty={item.remain_stock}
                  sid={item.sales_id}
                  benefit={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.Totalbenefit)}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        )}

        <Center flex={1} px="3">
          <Center>
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
                    <FormControl.Label>Quantity</FormControl.Label>
                    <Input
                      value={pro_qty}
                      onChangeText={setPro_qty}
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
                        setShowModal(false);
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
                          <Text style={{ color: "white" }}>Edit Sale</Text>
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
            >
              <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Sale Quick Actions</AlertDialog.Header>
                <AlertDialog.Body>
                  <Text>
                    Here are for Edit or Remove selected sale {SelectedName}.
                  </Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={2}>
                    <Button
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
                    </Button>

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
                  <Text>Are you sure to delete {SelectedName} sale now ?</Text>
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
                    <Button colorScheme="danger" onPress={deleteSales}>
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
    marginTop: 10,
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
    height: 85,
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
    fontSize: 11,
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
  },

  itemBtnText: {
    color: "white",
    marginLeft: 10,
  },
});

export default Weekreport;
