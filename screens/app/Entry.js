import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import NetInfo from "@react-native-community/netinfo";
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
  ActivityIndicator,
  Alert,
  Share,
  ImageBackground,
  ToastAndroid,
} from "react-native";

import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";

import { useToast, Center, NativeBaseProvider, Button, Box } from "native-base";
import * as Font from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import { useSelector, useDispatch } from "react-redux";
import { fetchTotalsData } from "../../features/changetotals/change_total_slice";
import { fetchCurrentProductData } from "../../features/getcurrentproducts/get_current";
import {
  fetchMostSold,
  fetchMostBenefit,
  fetchBalance,
} from "../../features/getallsales/getallsales";

import {
  fetchAllProductsData,
  fetchSearchProductsData,
  search_AllProductsData,
} from "../../features/getfullproducts/getallproducts";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

import i18next, {languageResources} from './services/i18next';
import {useTranslation} from 'react-i18next';
import languagesList from './services/languagesList.json';



export default Entry = ({ navigation }) => {

  const [visible, setVisible] = useState(false);

  const [webUrl, setWebUrl] = useState(
    useSelector((state) => state.userInfos.currentWebUrl)
  );
  const Toast = useToast();
  const loadImg = require("../../assets/go.jpeg");

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [userstatus, setuserstatus] = useState();

  const [refreshing, setRefreshing] = useState(false);
  const [monthname, setMonthname] = useState("Month");
  const [dayname, setDayname] = useState("day");

  const [user, setUser] = useState("Test");
  const [usernames, setusernames] = useState(
    useSelector((state) => state.userInfos.currentUser)
  );
  const [userphone, setuserphone] = useState(
    useSelector((state) => state.userInfos.UserPhone)
  );
  const [company, setCompany] = useState(
    useSelector((state) => state.userInfos.currentUserCompany)
  );
  const [salesP, setsalesP] = useState(
    useSelector((state) => state.userInfos.currentSalesPointID)
  );

  const [salesCoi, setsalesCo] = useState(
    useSelector((state) => state.userInfos.currentCompanyID)
  );

  const [usertype, setusertype] = useState(
    useSelector((state) => state.userInfos.currentUserType)
  );

  const [currenttheme, setcurrenttheme] = useState(
    useSelector((state) => state.userInfos.current_theme)
  );

  const [C_logo, setC_logo] = useState(
    useSelector((state) => state.userInfos.Companylogo)
  );

  const {
    SoldLoad,
    all_MostSold,
    SoldLoadError,

    SoldBenefitLoad,
    all_MostSoldBenefit,
    SoldBenefitLoadError,

    BalanceLoad,
    all_Balance,
    BalanceError,
  } = useSelector((state) => state.all_sales);

  const [location_Spt, setLocation_Spt] = useState(
    useSelector((state) => state.userInfos.SptLocation)
  );

  const currentDate = new Date();
  const day = currentDate.getDay();
  const montly = currentDate.getMonth();
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  const dispatch = useDispatch();
  const { Total_data, isLoading, error } = useSelector(
    (state) => state.changeTotals
  );

  function showToastOff() {
    ToastAndroid.show(
      "Network is Off please check your internet connection!",
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  }

  function showToastBack() {
    ToastAndroid.show(
      "Network is Back!",
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  }

  const {
    Current_products,
    Current_products_isLoading,
    Current_product_error,
  } = useSelector((state) => state.get_current_products);

  const formattedDate =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");

  const isFocused = useIsFocused();

  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    setFontsLoaded(true);
  }

  const {t} = useTranslation();

  const changeLng = lng => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };

  const rundays = () => {
    //Get Days
    switch (day) {
      case 0:
        setDayname("Sunday");
        break;
      case 1:
        setDayname("Monday");
        break;
      case 2:
        setDayname("Tuesday");
        break;
      case 3:
        setDayname("Wednesday");
        break;
      case 4:
        setDayname("Thursday");
        break;
      case 5:
        setDayname("Friday");
        break;
      case 6:
        setDayname("Saturday");
        break;
      default:
        setDayname("Invalid day of week.");
        break;
    }

    switch (montly) {
      case 0:
        setMonthname("January");
        break;
      case 1:
        setMonthname("February");
        break;
      case 2:
        setMonthname("March");
        break;
      case 3:
        setMonthname("April");
        break;
      case 4:
        setMonthname("May");
        break;
      case 5:
        setMonthname("June");
        break;
      case 6:
        setMonthname("July");
        break;
      case 7:
        setMonthname("August");
        break;
      case 8:
        setMonthname("September");
        break;
      case 9:
        setMonthname("October");
        break;
      case 10:
        setMonthname("November");
        break;
      case 11:
        setMonthname("December");
        break;
      default:
        setMonthname("Invalid month number.");
        break;
    }
  };

  useEffect(() => {
    //Check Internet
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        showToastOff();
      }
    });

    const fetchData = async () => {
      try {
        const chooseData = await AsyncStorage.getItem("choose");
        setcurrenttheme(JSON.parse(chooseData));

        const ustatus = await AsyncStorage.getItem("status");
        setuserstatus(ustatus);

        //dispatch(setDataThemeSuccess(JSON.parse(chooseData)));
      } catch (error) {
        console.log("Error retrieving data:", error);
      }
    };

    fetchData();
    dispatch(fetchAllProductsData(salesCoi, salesP));
    dispatch(fetchTotalsData(salesP));
    dispatch(fetchMostSold(salesP));
    dispatch(fetchMostBenefit(salesP));
    dispatch(fetchBalance(salesP));
    dispatch(fetchCurrentProductData(salesCoi, salesP));
    rundays();
    loadFonts();
    if (isFocused) {
      fetchData();
      dispatch(fetchTotalsData(salesP));
      dispatch(fetchCurrentProductData(salesCoi, salesP));
      dispatch(fetchMostSold(salesP));
      dispatch(fetchMostBenefit(salesP));
      dispatch(fetchBalance(salesP));
      rundays();
    }
  }, [isFocused, navigation]);

  //Check if font loaded

  if (!fontsLoaded) {
    return (
      <NativeBaseProvider>
        <ImageBackground
          source={loadImg}
          resizeMode="cover"
          style={styles.image}
        >
          <Center
            style={{
              width: "100%",
              height: "100%",
            }}
            px="3"
          >
            <ActivityIndicator size="large" color="#001935" />
            <Text
              style={{
                color: "#001935",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              {t('loading')}
            </Text>
          </Center>
        </ImageBackground>
      </NativeBaseProvider>
    );
  }

  const Item = ({ name, quantity, Total, time, remain, paid }) => (
    <View
      style={{
        width: "100%",
        height: 200,
      }}
    >
      <View
        style={{
          width: 100,
          height: 80,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 15,
          backgroundColor: currenttheme.secondary,
          position: "absolute",
          borderWidth: 2,
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
          marginTop: 10,
          marginLeft: 50,
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            color: "white",
            textAlign: "center",
            fontWeight: "900",
            fontFamily: "Poppins-Bold",
          }}
        >
          {quantity > 1 ? "Last Sales" : "Last Sale"}
        </Text>
      </View>

      <LinearGradient
        colors={[currenttheme.secondary, currenttheme.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        angle={-40}
        style={{
          width: 300,
          height: 160,
          borderRadius: 25,
          marginLeft: 20,
          borderWidth: 2,
          borderColor: currenttheme.secondary,
          borderStyle: "solid",
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          flexDirection: "row",
          marginTop: 40,
          zIndex: 1,
        }}
      >
        <LinearGradient
          colors={[currenttheme.secondary, currenttheme.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          angle={45}
          style={{
            width: "50%",
            height: "100%",
            borderTopLeftRadius: 23,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 23,
            borderBottomRightRadius: 0,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              color: "white",
              textAlign: "left",
              fontWeight: "900",
              fontFamily: "Poppins-Bold",
              marginTop: 48,
              marginLeft: 25,
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "white",
              textAlign: "left",
              fontFamily: "Poppins-Regular",
              marginLeft: 25,
              marginTop: 5,
            }}
          >
            {quantity} {quantity > 1 ? "Items" : "Item"}
            {/* {quantity} {name} */}
          </Text>

          <Text
            style={{
              fontSize: 11,
              color: "white",
              textAlign: "left",
              fontWeight: "900",
              fontFamily: "Poppins-Bold",
              marginLeft: 25,
              marginTop: -6,
            }}
          >
            {Total}
            {/* {quantity} {name} */}
          </Text>
        </LinearGradient>

        <View
          style={{
            width: "50%",
            height: "100%",
            backgroundColor: currenttheme.light,
            borderStyle: "solid",
            borderColor: currenttheme.secondary,
            borderStyle: "solid",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 23,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 23,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: currenttheme.secondary,
              textAlign: "left",
              fontWeight: "900",
              fontFamily: "Poppins-Bold",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
            {t('sold')}
            {/* {quantity} {name} */}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: currenttheme.normal,
              textAlign: "left",
              fontWeight: "900",
              fontFamily: "Poppins-Bold",
              marginLeft: 10,
            }}
          >
            {time}
            {/* {quantity} {name} */}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: currenttheme.secondary,
              textAlign: "left",
              fontWeight: "900",
              fontFamily: "Poppins-Bold",
              marginLeft: 10,
              marginTop: 10,
            }}
          >
           {t('remain-in-stock')} 
            {/* {quantity} {name} */}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: currenttheme.normal,
              textAlign: "left",
              fontWeight: "900",
              fontFamily: "Poppins-Bold",
              marginLeft: 10,
            }}
          >
            {remain} {(remain = 1 ? "Item" : "Items")}
          </Text>

          <View
            style={{
              width: "85%",
              height: 30,
              backgroundColor: currenttheme.secondary,
              textAlign: "center",
              borderRadius: 80,
              marginTop: 10,
              marginLeft: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: paid === "Paid" ? "#00E14B" : "red",
                borderRadius: 80,
                borderWidth: 2,
                borderColor: "white",
                borderStyle: "solid",
              }}
            ></View>

            <Text
              style={{
                fontSize: 10,
                color: "white",
                textAlign: "left",
                fontWeight: "900",
                fontFamily: "Poppins-Regular",
                marginLeft: 10,
              }}
            >
              {paid}
            </Text>
          </View>
        </View>

        {/* <Fontisto name="shopping-basket" size={40} color={currenttheme.primary} />
      <Text style={styles.title}>
        {quantity} {name}
      </Text>
      <Text style={styles.normal}> {Total} </Text>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 10,
          marginTop: -20,
          color: "#2e9100",
        }}
      >
        {" "}
        {time}{" "}
      </Text> */}
      </LinearGradient>
    </View>
  );

  const handlePress = () => {
    navigation.openDrawer();
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchTotalsData(salesP));
    dispatch(fetchCurrentProductData(salesCoi, salesP));
    setRefreshing(false);
    dispatch(fetchBalance(salesP));
    dispatch(fetchMostSold(salesP));
    dispatch(fetchMostBenefit(salesP));
  };

  //Format Names

  function formatName(name) {
    const nameArray = name.split(" ");

    if (nameArray.length < 2) {
      return name; // Invalid name format, return the original name
    }

    const firstName = nameArray[0];
    const lastName = nameArray[nameArray.length - 1];

    // Get the initials of the first name
    const firstNameInitial = firstName.charAt(0).toUpperCase() + ".";

    // Combine the formatted name
    const formattedName = firstNameInitial + " " + lastName;

    return formattedName;
  }

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

  if (userstatus == 0) {
    setTimeout(() => {
      navigation.navigate("LoginScreen");
    }, 3000);
  }

  return (
    <NativeBaseProvider>
      <SafeAreaView
        style={{
          backgroundColor: "#fff",
        }}
      >
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
              style={[
                styles.dates_up,
                {
                  backgroundColor: currenttheme.secondary,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={handlePress}
                  style={{
                    marginRight: 35,
                  }}
                >
                  <Image style={styles.tinyLogo} source={{ uri: C_logo }} />
                </TouchableOpacity>

                <View>
                  <Text
                    style={[
                      styles.dates,
                      {
                        fontSize: 16,
                        marginTop: -10,
                      },
                    ]}
                  >
                    {t('hello')}, {formatName(usernames)}
                  </Text>
                  <Text
                    style={[
                      styles.dates,
                      {
                        fontSize: 12,
                        marginTop: -10,
                      },
                    ]}
                  >
                    {usertype}
                  </Text>
                  <Text
                    style={[
                      styles.dates,
                      {
                        fontSize: 10,
                        marginTop: -2,
                      },
                    ]}
                  >
                    {company}{" "}
                    <Text
                      style={{
                        fontSize: 8,
                      }}
                    >
                      {location_Spt}
                    </Text>
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: 15,
                  //marginBottom: 10,
                  fontFamily: "Poppins-Bold",
                  backgroundColor: currenttheme.normal,
                  borderRadius: 80,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  fontSize: 12,
                }}
              >
                {t('on')} {date}
                <Text
                  style={{
                    fontSize: 10,
                    paddingTop: -15,
                    marginBottom: 10,
                  }}
                >
                  {" Th,"}
                </Text>{" "}
                {monthname} {year}, {dayname}{" "}
              </Text>

              <View style={styles.news}>
                <View style={styles.infos}>
                  <Text
                    style={[
                      styles.textInH,
                      {
                        color: currenttheme.secondary,
                      },
                    ]}
                  >
                    {t('total-sales')}
                  </Text>

                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={currenttheme.secondary}
                    />
                  ) : (
                    Total_data.map((post) => (
                      <Text key="1" style={styles.textInG}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(post.Totat_sales_Amount)}
                      </Text>
                    ))
                  )}
                </View>

                {usertype == "BOSS" ? (
                  <View style={styles.infos}>
                    <Text
                      style={[
                        styles.textInH,
                        {
                          color: currenttheme.secondary,
                        },
                      ]}
                    >
                      {t('benefit')}
                    </Text>

                    {isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={currenttheme.secondary}
                      />
                    ) : (
                      Total_data.map((post) => (
                        <Text key="1" style={styles.textInG}>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "RWF",
                          }).format(post.Totat_sales_Benefits)}
                        </Text>
                      ))
                    )}
                  </View>
                ) : (
                  <View style={styles.infos}>
                    <Text
                      style={[
                        styles.textInH,
                        {
                          color: currenttheme.secondary,
                        },
                      ]}
                    >
                      {t('sales')}
                    </Text>

                    {isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={currenttheme.secondary}
                      />
                    ) : (
                      Total_data.map((post) => (
                        <Text key="1" style={styles.textInG}>
                          {post.Sales_Count}{" "}
                          {post.Sales_Count == 1 ? "Sale" : "Sales"}
                        </Text>
                      ))
                    )}
                  </View>
                )}
              </View>
            </View>


            {/* <FlatList
            data={Object.keys(languageResources)}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() => changeLng(item)}>
                <Text style={styles.lngName}>
                  {languagesList[item].nativeName}
                </Text>
              </TouchableOpacity>
            )}
          />     */}


            <Text
              style={[
                styles.textTitle,
                {
                  color: currenttheme.secondary,
                },
              ]}
            >
              {t('sales-functions')}
            </Text>

            {/* <Center flex={1} px="3">
                <Example />
            </Center> */}

            <Center>
              <View
                style={[
                  styles.fuc,
                  {
                    backgroundColor: currenttheme.secondary,
                  },
                ]}
              >
                <TouchableOpacity onPress={() => navigation.navigate("Sales")}>
                  <View style={styles.fucs}>
                    <MaterialCommunityIcons
                      name="sale"
                      size={24}
                      color={currenttheme.normal}
                    />
                    <Text style={styles.textInGFuc}>{t('sales')}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Products")}
                >
                  <View style={styles.fucs}>
                    <AntDesign
                      name="database"
                      size={24}
                      color={currenttheme.normal}
                    />
                    <Text style={styles.textInGFuc}>{t('products')}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Shopping")}
                >
                  <View style={styles.fucs}>
                    <Entypo name="shop" size={24} color={currenttheme.normal} />
                    <Text style={styles.textInGFuc}>{t('selling')}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Expenses")}
                >
                  <View style={styles.fucs}>
                    <MaterialIcons
                      name="workspaces-filled"
                      size={24}
                      color={currenttheme.normal}
                    />
                    <Text style={styles.textInGFuc}>{t('expenses')}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Debts")}>
                  <View style={styles.fucs}>
                    <MaterialCommunityIcons
                      name="cash-lock"
                      size={24}
                      color={currenttheme.normal}
                    />
                    <Text style={styles.textInGFuc}>{t('debts')}</Text>
                  </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  onPress={() => navigation.navigate("Services")}
                >
                  <View style={styles.fucs}>
                    <MaterialCommunityIcons
                      name="state-machine"
                      size={24}
                      color={currenttheme.normal}
                    />
                    <Text style={styles.textInGFuc}>Services</Text>
                  </View>
                </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => navigation.navigate("Reports")}
                >
                  <View style={styles.fucs}>
                    <FontAwesome
                      name="print"
                      size={24}
                      color={currenttheme.normal}
                    />
                    <Text style={styles.textInGFuc}>{t('report')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Center>

            <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.secondary,
                },
              ]}
            >
              {t('current-sales')}
            </Text>

            {Current_products_isLoading ? (
              <View>
                <ActivityIndicator
                  size="large"
                  color={currenttheme.secondary}
                />
                <Text style={styles.textInGFuc}>{t('loading-wait')}</Text>
              </View>
            ) : (
              <FlatList
                style={{
                  backgroundColor: "white",
                }}
                horizontal={true}
                data={Current_products}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        `${item.name}`,
                        `Information:\n1. Qty ${item.quantity}\n2. Benefit ${
                          usertype == "BOSS" ? item.Totalbenefit : "0"
                        } \n3. Time ${
                          item.Sales_time
                        }\n5. Total:${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(item.Total)}`,
                        [
                          {
                            text: "OK",
                            onPress: () => console.log("OK Pressed"),
                          },
                          {
                            text: "SHARE",
                            onPress: () =>
                              Share.share({
                                message: `${company._j} system:\n${
                                  user._j
                                } share to you ${
                                  item.name
                                } sale information.\n1. Price: ${
                                  item.price
                                }\n2. Qty: ${item.quantity}\n3. Benefit: ${
                                  usertype == "BOSS" ? item.Totalbenefit : "0"
                                } \n4.Time: ${
                                  item.Sales_time
                                }\nTotal:${new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "RWF",
                                }).format(item.Total)}`,
                                url: "https://myapp.com",
                                title: `${company._j} `,
                              }),
                          },
                        ]
                      )
                    }
                  >
                    <Item
                      name={item.name}
                      quantity={item.quantity}
                      Total={new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "RWF",
                      }).format(item.Total)}
                      time={timeAgo(item.Sales_time)}
                      remain={item.remain_stock}
                      paid={item.paid_status}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
          <Center>
            <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.secondary,
                },
              ]}
            >
              {t('most-sold-sales')}
            </Text>

            {all_MostSold.map((item) => (
              <View
                style={{
                  width: "90%",
                  backgroundColor: currenttheme.secondary,
                  borderRadius: 10,
                  padding: 10,
                  marginTop: 10,
                  borderLeftWidth: 10,
                  borderLeftColor: currenttheme.primary,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    textAlign: "left",
                    fontSize: 16,
                    marginTop: 13,
                    marginLeft: 15,
                    color: "white",
                  }}
                >
                  {item.Product_name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    textAlign: "left",
                    fontSize: 12,
                    marginLeft: 15,
                    color: "white",
                  }}
                >
                  {t('total')}:{item.total_sold}{" "}
                  {item.total_sold == 1 ? "Single" : "Times"}
                </Text>
              </View>
            ))}

            <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.secondary,
                },
              ]}
            >
              {t('most-benefit-sales')}
            </Text>

            {all_MostSoldBenefit.map((item) => (
              <View
                style={{
                  width: "90%",
                  backgroundColor: currenttheme.secondary,
                  borderRadius: 10,
                  padding: 10,
                  marginTop: 2,
                  borderLeftWidth: 10,
                  borderLeftColor: currenttheme.primary,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    textAlign: "left",
                    fontSize: 16,
                    marginTop: 5,
                    marginLeft: 15,
                    color: "white",
                  }}
                >
                  {item.Product_name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    textAlign: "left",
                    fontSize: 12,
                    marginLeft: 15,
                    color: "white",
                  }}
                >
                  {t('total')}: {item.total_sold}{" "}
                  {item.total_sold == 1 ? "Single" : "Times"}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    textAlign: "left",
                    fontSize: 12,
                    marginLeft: 15,
                    color: "white",
                  }}
                >
                  {t('amount')}:{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.Amount)}
                </Text>
                {usertype == "BOSS" ? (
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      textAlign: "left",
                      fontSize: 12,
                      marginLeft: 15,
                      color: "white",
                    }}
                  >
                    {t('benefit')}:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(item.Benefit)}
                  </Text>
                ) : null}
              </View>
            ))}

            {usertype == "BOSS" ? (
              <Text
                style={[
                  styles.textTitle2,
                  {
                    color: currenttheme.secondary,
                  },
                ]}
              >
                {t('daily-balance')}
              </Text>
            ) : (
              ""
            )}

            {all_Balance.map((item) =>
              usertype === "BOSS" ? (
                <View
                  style={{
                    width: "90%",
                    backgroundColor:
                      item.Balance < 0 ? "#eb0027" : currenttheme.secondary,
                    borderRadius: 10,
                    padding: 10,
                    marginTop: 10,
                    borderLeftWidth: 10,
                    borderLeftColor:
                      item.Balance < 0 ? "#5c5c5c" : currenttheme.primary,
                    marginBottom: 20,
                  }}
                  key={item.id} // Add a unique key for each item in the loop
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Bold",
                      textAlign: "left",
                      fontSize: 16,
                      marginTop: 13,
                      marginLeft: 15,
                      color: "white",
                    }}
                  >
                     {t('daily-balance')}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins-Bold",
                      textAlign: "left",
                      fontSize: 16,
                      marginTop: 13,
                      marginLeft: 15,
                      color: "white",
                    }}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(
                      item.Balance === null
                        ? item.daybenefit === null
                          ? 0
                          : item.daybenefit
                        : item.Balance
                    )}
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      textAlign: "left",
                      fontSize: 12,
                      marginLeft: 15,
                      color: "white",
                    }}
                  >
                     {t('daily-expense')}:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(item.dayexpenses === null ? 0 : item.dayexpenses)}
                  </Text>
                </View>
              ) : null
            )}
          </Center>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 30,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  dates_up: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
  },
  dates: {
    color: "white",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Poppins-Bold",
  },

  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginTop: 10,
  },
  news: {
    backgroundColor: "transparent",
    width: 300,
    height: 120,
    marginTop: 20,
    flex: 1,
    justifyContent: "space-between",
    alignContent: "space-between",
    flexDirection: "row",
  },

  infos: {
    textAlign: "center",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
    width: "48%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  textInH: {
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#a8006e",
  },

  textInG: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 10,
    color: "#0a0a0a",
    fontFamily: "Poppins-Bold",
    width: "95%",
    marginLeft: 3,
  },

  fuc: {
    marginTop: 10,
    width: "93%",
    height: "auto",
    borderRadius: 10,
    alignItems: "center",
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

  textTitle: {
    fontFamily: "Poppins-Bold",
    textAlign: "left",
    fontSize: 16,
    marginTop: 90,
    marginLeft: 15,
    color: "#a8006e",
  },

  textTitle2: {
    fontFamily: "Poppins-Bold",
    textAlign: "left",
    fontSize: 16,
    marginTop: 13,
    marginLeft: 15,
    color: "#a8006e",
  },

  containerer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },

  item: {
    backgroundColor: "#fff2fb",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    width: 220,
    height: 175,
    textAlign: "center",
    alignItems: "center",
    borderColor: "#a8006e",
    borderStyle: "solid",
    borderWidth: 2,
    justifyContent: "space-around",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    color: "#a8006e",
    textAlign: "center",
    fontWeight: "900",
    fontFamily: "Poppins-Bold",
    textTransform: "capitalize",
  },

  normal: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },
});
