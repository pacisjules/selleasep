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
} from "react-native";

import { useFonts } from "expo-font";

import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Feather
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
  Select,
  CheckIcon,
  Box,
} from "native-base";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Permissions } from "expo";
import * as Font from "expo-font";
import i18next, {languageResources} from './services/i18next';
import {useTranslation} from 'react-i18next';

function Reports({ navigation }) {
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [service, setService] = React.useState("");

  const [showModalMonth, setShowModalMonth] = useState(false);
  const [serviceMonth, setServiceMonth] = React.useState("");

  const [pro_name, setPro_name] = useState("");
  const [pro_quatity, setQuatity] = useState(0);
  const [pro_benefit, setPro_benefit] = useState("");

  const [showPickerFrom, setShowPickerFrom] = useState(false);
  const [showPickerTo, setShowPickerTo] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const [showPickerInventory, setShowPickerInventory] = useState(false);
  const [showPickerUsers, setShowPickerUsers] = useState(false);
 
  const {t} = useTranslation();
  const changeLng = lng => {
      i18next.changeLanguage(lng);
      setVisible(false);
    };
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

    navigation.navigate("RedPick", {
      dating: formattedDate,
    });
  }


  function onDateChangeInventory(event, selectedDate) {
    const currentDate = selectedDate || date;
    setShowPickerInventory(Platform.OS === "Android");
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

    navigation.navigate("InventoryIn", {
      dating: formattedDate,
    });
  }



  function onDateChangeUsers(event, selectedDate) {
    const currentDate = selectedDate || date;
    setShowPickerUsers(Platform.OS === "Android");
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

    navigation.navigate("Getusers", {
      dating: formattedDate,
    });
  }



  const setMonth = () => {
    setShowModalMonth(false);
    navigation.navigate("MonthReport", {
      monthSelected: serviceMonth,
    });
  };

  const setYear = () => {
    navigation.navigate("YearReport", {
      yearSelected: service,
    });
  };

  function onPress() {
    setShowPicker(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: createDynamicTable(),
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const array = [
    {
      company: "Alfreds Futterkiste",
      contact: "Maria Anders",
      country: "Germany",
    },
    {
      company: "Centro comercial Moctezuma",
      contact: "Francisco Chang",
      country: "Mexico",
    },
    { company: "Ernst Handel", contact: "Roland Mendel", country: "Austria" },
    { company: "Island Trading", contact: "Helen Bennett", country: "UK" },
    {
      company: "Laughing Bacchus Winecellars",
      contact: "Yoshi Tannamuri",
      country: "Canada",
    },
    {
      company: "Magazzini Alimentari Riuniti",
      contact: "Giovanni Rovelli",
      country: "Italy",
    },
  ];

  const createDynamicTable = () => {
    let table = "";
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      table += `
        <tr height="35px" >
          <td style="font-size: 12px;font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal;  vertical-align: top; padding: 0 0 7px;" align="left">${item.company}</td>
          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal;  vertical-align: top; padding: 0 0 7px;" align="left">${item.contact}</td>
          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal;  vertical-align: top; padding: 0 0 7px;" align="right">${item.country}</td>
          <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal;  vertical-align: top; padding: 0 0 7px;" align="right">${item.country}</td>
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
                    <td align="left"> <img src="https://logos-world.net/wp-content/uploads/2020/04/Huawei-Logo.png" width="75" height="75" alt="logo" border="0" style="object-fit:cover;" /></td>
                  </tr>
                  <tr class="hiddenMobile">
                    <td height="40"></td>
                  </tr>
                  <tr class="visibleMobile">
                    <td height="20"></td>
                  </tr>
                  <tr>
                    <td style="font-size: 22px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; font-weight:bold;  vertical-align: top; text-align: left;">
                      Huawei Rwanda Ltd.
                    </td>
                  </tr>

                  <tr>
                <td height="1" colspan="4" style="border-bottom:1px solid #e4e4e4"></td>
              </tr>

                  <tr>
                      <td style="padding-top:20px; font-size: 18px; color: #5b5b5b; font-family: 'Open Sans', sans-serif;   vertical-align: top; text-align: left;">
                      Manager, Kabalisa Eric
                    </td>
                      </tr>

                      <tr>
                      <td style="font-size: 12px; color: red; font-family: 'Open Sans', sans-serif;   vertical-align: top; text-align: left;">
                      Gisozi, Gasabo Sales Point
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
                    <td style="font-size: 26px; color: #ff0000; letter-spacing: 1px; font-family: 'Open Sans', sans-serif; font-weight:bold;  vertical-align: top; text-align: right;">
                      Inventory in report
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
                      <small>March, 4<sup>th</sup> 2016</small>
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
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="white">
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
                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: red; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 10px 7px 0;" width="52%" align="left">
                  Item
                </th>
                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: red; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="left">
                  <small>SKU</small>
                </th>
                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: red; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="center">
                  Quantity
                </th>
                <th style="font-size: 16px; font-family: 'Open Sans', sans-serif; color: red; font-weight: bold; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="right">
                  Subtotal
                </th>
              </tr>
              <tr height='20px'>
              <td height="2" colspan="4" style="border-top:2px solid #e4e4e4; margin-bottom:10px"></td>
              </tr>
              
              ${table}
              
              <tr height='20px'>
              <td height="2" colspan="4" style="border-bottom:2px solid #e4e4e4; margin-bottom:10px"></td>
              </tr>
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
              <tr>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 22px; vertical-align: top; text-align:right; ">
                  Subtotal
                </td>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e; line-height: 22px; vertical-align: top; text-align:right; white-space:nowrap;" width="80">
                  $329.90
                </td>
              </tr>
              
              <tr>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                  <strong>Grand Total (Incl.Tax)</strong>
                </td>
                <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                  <strong>$344.90</strong>
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
                          <strong>Manager name: Kabalisa Eric</strong>
                        </td>
                      </tr>
                      <tr>
                        <td width="100%" height="40"></td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: 'Open Sans', sans-serif; font-weight:100; color: #5b5b5b; line-height: 1; vertical-align: top; ">
                          <strong>Stamp & Signature</strong>
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
              Have a nice day.
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
    // On iOS/android prints the given html. On web prints the HTML from the current page.

    const { uri } = await Print.printToFileAsync({
      html: createDynamicTable(),
    });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NativeBaseProvider>
        <Center>
          <Text
            style={{
              textAlign: "center",
              fontSize: 10,
              color: "#0a0a0a",
              fontFamily: "Poppins-Bold",
            }}
          >
            {t('funcreport')}
          </Text>

          <View
            style={[
              styles.fuc,
              {
                backgroundColor: currenttheme.secondary,
              },
            ]}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Yesterday")}>
              <View style={styles.fucs}>
                <AntDesign name="back" size={24} color={currenttheme.primary} />
                <Text style={styles.textInGFuc}>{t('yests')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPress}>
              <View style={styles.fucs}>
                <MaterialIcons
                  name="date-range"
                  size={24}
                  color={currenttheme.primary}
                />
                <Text style={styles.textInGFuc}>{t('pick')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Weekreport")}>
              <View style={styles.fucs}>
                <FontAwesome
                  name="calendar"
                  size={24}
                  color={currenttheme.primary}
                />
                <Text style={styles.textInGFuc}>{t('week')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                alert("This report still wait...");
              }}
            >
              <View style={styles.fucs}>
                <MaterialCommunityIcons
                  name="calendar-search"
                  size={24}
                  color={currenttheme.primary}
                />
                <Text style={styles.textInGFuc}>{t('fromto')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModalMonth(true)}>
              <View style={styles.fucs}>
                <Ionicons
                  name="md-calendar"
                  size={24}
                  color={currenttheme.primary}
                />
                <Text style={styles.textInGFuc}>{t('monthly')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(true)}>
              <View style={styles.fucs}>
                <FontAwesome
                  name="calendar-check-o"
                  size={24}
                  color={currenttheme.primary}
                />
                <Text style={styles.textInGFuc}>{t('picky')}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowPickerUsers(true)}
            style={[
              {
                marginTop: 10,
                backgroundColor: "#a8006e",
                width: "85%",
                height: 60,
                borderRadius: 50,
                alignItems: "center",
                padding: 5,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: currenttheme.secondary,
              },
            ]}
          >
            <Feather
              name="users"
              size={24}
              color="white"
              style={{
                marginRight: 15,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "white",
                fontFamily: "Poppins-Bold",
              }}
            >
             {t('dailyuser')} 
            </Text>
          </TouchableOpacity>



          <TouchableOpacity
            onPress={() => navigation.navigate("Inventory")}
            style={[
              {
                marginTop: 10,
                backgroundColor: "#a8006e",
                width: "85%",
                height: 60,
                borderRadius: 50,
                alignItems: "center",
                padding: 5,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: currenttheme.secondary,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="database-clock"
              size={24}
              color="white"
              style={{
                marginRight: 15,
              }}
            />
            
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "white",
                fontFamily: "Poppins-Bold",
              }}
            >
              {t('remainstock')}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => setShowPickerInventory(true)}
            style={[
              {
                marginTop: 10,
                backgroundColor: "#a8006e",
                width: "85%",
                height: 60,
                borderRadius: 50,
                alignItems: "center",
                padding: 5,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: currenttheme.secondary,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="database-import"
              size={24}
              color="white"
              style={{
                marginRight: 15,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "white",
                fontFamily: "Poppins-Bold",
              }}
            >
              {t('instock')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AlertInventory")}
            style={[
              {
                marginTop: 10,
                backgroundColor: "#a8006e",
                width: "85%",
                height: 60,
                borderRadius: 50,
                alignItems: "center",
                padding: 5,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: currenttheme.secondary,
              },
            ]}
          >
            <MaterialCommunityIcons name="alert" size={24} color="white" />
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "white",
                fontFamily: "Poppins-Bold",
              }}
            >
              {t('alertinv')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("IncidentalReport")}
            style={[
              {
                marginTop: 10,
                backgroundColor: "#a8006e",
                width: "85%",
                height: 60,
                borderRadius: 50,
                alignItems: "center",
                padding: 5,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: currenttheme.secondary,
              },
            ]}
          >
            <MaterialIcons name="error" size={24} color="white" />
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "white",
                fontFamily: "Poppins-Bold",
              }}
            >
              {t('incereport')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Debts")}
            style={[
              {
                marginTop: 10,
                backgroundColor: "#a8006e",
                width: "85%",
                height: 60,
                borderRadius: 50,
                alignItems: "center",
                padding: 5,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: currenttheme.secondary,
              },
            ]}
          >
            <AntDesign name="questioncircle" size={24} color="white" />
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "white",
                fontFamily: "Poppins-Bold",
              }}
            >
              {t('debtrep')}
            </Text>
          </TouchableOpacity>
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


        {showPickerInventory && (
          <DateTimePicker
            value={date}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onDateChangeInventory}
            theme={{
              backgroundColor: "#001935",
              textColor: "#FFFFFF",
              headerBackgroundColor: "#001935",
              headerTextColor: "#FFFFFF",
            }}
          />
        )}


        {showPickerUsers && (
          <DateTimePicker
            value={date}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onDateChangeUsers}
            theme={{
              backgroundColor: "#001935",
              textColor: "#FFFFFF",
              headerBackgroundColor: "#001935",
              headerTextColor: "#FFFFFF",
            }}
          />
        )}

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setService("");
          }}
          animationDuration={100}
        >
          <Modal.Content maxWidth="600px" width="340px">
            <Modal.CloseButton />
            <Modal.Header>{t('yearrep')}</Modal.Header>
            <Modal.Body>
              <Select
                selectedValue={service}
                minWidth="200"
                accessibilityLabel="Choose year"
                placeholder="Select year"
                _selectedItem={{
                  bg: "#001935",
                  color: "white",
                  endIcon: <CheckIcon size="4" />,
                }}
                mt={1}
                onValueChange={(e) => {
                  setService(e);
                }}
                value={service}
              >
                <Select.Item label="2023" value={2023} />
                <Select.Item label="2024" value={2024} />
                <Select.Item label="2025" value={2025} />
                <Select.Item label="2026" value={2026} />
                <Select.Item label="2027" value={2027} />
                <Select.Item label="2028" value={2028} />
                <Select.Item label="2029" value={2029} />
                <Select.Item label="2030" value={2030} />
              </Select>
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
                    <Text style={{ color: "gray" }}>{t('loading-wait')}</Text>
                  ) : (
                    <Text style={{ color: "gray" }}>{t('cancel')}</Text>
                  )}
                </Button>
                <TouchableOpacity>
                  <Button
                    style={{
                      backgroundColor: "#68bd00",
                    }}
                    onPress={setYear}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={{ color: "white" }}>{t('continue')}</Text>
                    )}
                  </Button>
                </TouchableOpacity>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <Modal
          isOpen={showModalMonth}
          onClose={() => {
            setShowModalMonth(false);
            setServiceMonth("");
          }}
          animationDuration={100}
        >
          <Modal.Content maxWidth="600px" width="340px">
            <Modal.CloseButton />
            <Modal.Header>{t('monthrep')}</Modal.Header>
            <Modal.Body>
              <Select
                selectedValue={serviceMonth}
                minWidth="200"
                accessibilityLabel="Choose month"
                placeholder="Select month"
                _selectedItem={{
                  bg: "#001935",
                  color: "white",
                  endIcon: <CheckIcon size="4" />,
                }}
                mt={1}
                onValueChange={(e) => {
                  setServiceMonth(e);
                }}
                value={serviceMonth}
              >
                <Select.Item label="January" value={"01"} />
                <Select.Item label="February" value={"02"} />
                <Select.Item label="March" value={"03"} />
                <Select.Item label="April" value={"04"} />
                <Select.Item label="May" value={"05"} />
                <Select.Item label="June" value={"06"} />
                <Select.Item label="July" value={"07"} />
                <Select.Item label="August" value={"08"} />
                <Select.Item label="September" value={"09"} />
                <Select.Item label="October" value={"10"} />
                <Select.Item label="November" value={"11"} />
                <Select.Item label="December" value={"12"} />
              </Select>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModalMonth(false);
                  }}
                >
                  {isLoading ? (
                    <Text style={{ color: "gray" }}>{t('loading-wait')}</Text>
                  ) : (
                    <Text style={{ color: "gray" }}>{t('cancel')}</Text>
                  )}
                </Button>
                <TouchableOpacity>
                  <Button
                    style={{
                      backgroundColor: "#68bd00",
                    }}
                    onPress={setMonth}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={{ color: "white" }}>{t('continue')}</Text>
                    )}
                  </Button>
                </TouchableOpacity>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </NativeBaseProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  fuc: {
    marginTop: 10,
    backgroundColor: "#a8006e",
    width: "95%",
    //height: 200,
    borderRadius: 10,
    alignItems: "center",
    //marginLeft: 3,
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  fucs: {
    backgroundColor: "white",
    width: 90,
    height: 65,
    borderRadius: 5,
    alignItems: "center",
    padding: 15,
    flax: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    margin: 5,
  },

  textInGFuc: {
    textAlign: "center",
    fontSize: 10,
    color: "#0a0a0a",
    fontFamily: "Poppins-Regular",
  },
  dateTimePicker: {
    backgroundColor: "#ff00a6",
  },
});

export default Reports;
