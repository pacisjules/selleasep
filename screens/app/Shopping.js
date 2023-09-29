import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
  Platform,
  Vibration,
  ActivityIndicator,
  Modal,
  Alert,
  Share,
  
} from "react-native";
import * as Font from "expo-font";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Button,
  FormControl,
  Input,
  Center,
  NativeBaseProvider,
  useToast,
  Icon,
  Switch,
  
} from "native-base";

import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllProductsData,
  fetchSearchProductsData,
  search_AllProductsData,
  fetchAllCustomersData
} from "../../features/getfullproducts/getallproducts";

import {
  set_CARTSuccess,
  removeCartItem,
  increaseCartItem,
  decreaseCartItem,
  clearCart
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



const Shopping = ({ navigation }) => {
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [fetchedCustomers, setFetchedCustomers] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);



  //Get All products from redux array
  const { all_product_error, all_products, all_products_isLoading, all_customers_error, all_customers, all_customers_isLoading } =
    useSelector((state) => state.all_products);

  //Get All products from redux array
  const { CARTLoad, CARTs_array, CARTError, TotalAmountView, TotalBenefitView } = useSelector(
    (state) => state.all_sales
  );

  const [cuser, setcUser] = useState(
    useSelector((state) => state.userInfos.currentUser)
  );

  const [cuserid, setcUserid] = useState(
    useSelector((state) => state.userInfos.currentUserID)
  );

  const [currenttheme, setcurrenttheme] = useState(
    useSelector((state) => state.userInfos.current_theme)
  );

  const [currentCompany, setcurrentCompany] = useState(
    useSelector((state) => state.userInfos.currentCompanyID)
  );

  const [currentCompanyName, setcurrentCompanyName] = useState(
    useSelector((state) => state.userInfos.currentUserCompany)
  );
  const [currentSpt, setcurrentSpt] = useState(
    useSelector((state) => state.userInfos.currentSalesPointID)
  );

  const [IssalePaid, setIssalePaid] = useState(true);

  
const {t} = useTranslation();
const changeLng = lng => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };
  //Normal
  const [refreshing, setRefreshing] = useState(false);
  const [datas, setDatas] = useState([]);
  const isFocused = useIsFocused();
  const toast = useToast();

  //Modals
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState("SAVE SALE");

  //Infos
  const [ident, setIdent] = useState("");
  const [cartItemID, setCartItemID] = useState();

  const [pro_name, setPro_name] = useState("");
  const [pro_qty, setPro_qty] = useState(1);
  const [pro_cqty, setPro_cqty] = useState(0);
  const [pro_client, setPro_Client] = useState("");
  const [pro_Cphone, setPro_Cphone] = useState("");
  const [pro_price, setPro_price] = useState("");
  const [pro_benefit, setPro_benefit] = useState("");
  const [pro_calcshow, setCalcshow] = useState(false);
  const [pro_salestype, setSalesType] = useState(1);
  const [SwitchType, setSwitchType] = useState(false);
  const [DataSwitchType, setDataSwitchType] = useState(false);
  const [Custom_Price, setPro_Custom_Price] = useState("");

  const [edit, setEdit] = useState(true);

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //new set
  const [user, setUser] = useState(null);
  const [usernames, setusernames] = useState(null);
  const [userphone, setuserphone] = useState(null);
  const [company, setCompany] = useState(null);
  const [salesP, setsalesP] = useState(null);

  const [ctheme, settheme] = useState(null);
  const [usertype, setusertype] = useState(
    useSelector((state) => state.userInfos.currentUserType)
  );
  
  const [themeset, setthemeset] = useState("");

  //For search products
  const [searchQuery, setSearchQuery] = useState("");

  const handleSwitchToggle = () => {
    setIssalePaid(!IssalePaid)
  };


  const handleSwitchToggleType = () => {
    setSwitchType(!SwitchType)
    setDataSwitchType(!DataSwitchType)
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

  const openModal = () => {
    setModalVisible(true);
    setModalVisible2(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalVisible2(false);
  };

  const openModal2 = () => {
    setModalVisible2(true);
  };

  const closeModal2 = () => {
    setModalVisible2(false);
    setModalVisible(true);
  };


  const openModal3 = () => {
    setModalVisible3(true);
  };

  const closeModal3 = () => {
    setModalVisible3(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setFetchedProducts(all_products);
    dispatch(fetchAllProductsData(currentCompany, currentSpt));
    // perform your refresh logic here
    setRefreshing(false);
  };

  useEffect(() => {

    loadFonts();

    dispatch(fetchAllProductsData(currentCompany, currentSpt));
    setFetchedProducts(all_products);

    dispatch(fetchAllCustomersData(currentSpt));
    setFetchedCustomers(all_customers);

    if (isFocused) {
      dispatch(fetchAllProductsData(currentCompany, currentSpt));
      dispatch(fetchAllCustomersData(currentSpt));
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

  const handleRemoveItem = (id) => {
    dispatch(removeCartItem(id));
  };

  const increaseItem = (id) => {
    dispatch(increaseCartItem(id));
  };

  const decraeseItem = (id) => {
    dispatch(decreaseCartItem(id));
  };

  const handleAddtoList = () => {
    setCalcshow(false);
    if (parseFloat(pro_cqty) < parseFloat(pro_qty)) {
      alert("You entered more quantity than stock!");
    } else {
      var curLen = CARTs_array.length;
      dispatch(
        set_CARTSuccess({
          id: curLen + 1,
          product_id: ident,
          name: pro_name,
          qty: pro_qty,
          price: SwitchType?Custom_Price:pro_price,
          benefit: SwitchType?((parseFloat(pro_benefit)/parseFloat(pro_price))*parseFloat(Custom_Price)):pro_benefit,
          total_amount: SwitchType?(parseFloat(Custom_Price) * parseFloat(pro_qty)):(parseFloat(pro_price) * parseFloat(pro_qty)),
          total_benefit: SwitchType?(((parseFloat(pro_benefit)/parseFloat(pro_price))*parseFloat(Custom_Price)) * parseFloat(pro_qty)):(parseFloat(pro_benefit)*parseFloat(pro_qty)),
        })
      );


      setPro_Custom_Price("")
      setSwitchType(false);
      setPro_cqty(0);
      setModalVisible2(false);
      setModalVisible(false);
    }
  };

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

  const Item = ({
    name,
    id,
    price,
    benefit,
    quantity,
    alertQuantity,
    time,
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
            Qty: {quantity} Alert: {alertQuantity}
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



  const ItemCustomer = ({
    names,
    id,
    phone,
    location,
  }) => (
    <Center px="1">
      <View
        style={
          {
            borderColor: currenttheme.secondary,
            borderStyle: "solid",
            borderWidth: 1,
            width:"100%",
            marginTop:5,
            borderRadius: 3,
          }
        }
      >
        <View
          style={{
            width: "100%",
            padding: 3,
            borderRadius: 5,
            //backgroundColor: currenttheme.secondary,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "black",
              fontFamily: "Poppins-Bold",
            }}
          >
            {names}
          </Text>

          <Text
            style={{
              color: "black",
              fontSize: 10,
              fontFamily: "Poppins-Regular",
            }}
          >
            Phone: {phone} Location: {location}
          </Text>

          <Text
            style={{
              color: "black",
              fontSize: 10,
              fontFamily: "Poppins-Regular",
            }}
          >
           Location: {location}
          </Text>
        </View>
      </View>
    </Center>
  );

  //Adding Command
  const Adding_information = async () => {
    setModalVisible3(false);
    setEdit(false);
    setIsLoading(true);
    setSaveMsg("Saving proccess.....")


    const productIds = CARTs_array.map(item => item.product_id);
    const quantities = CARTs_array.map(item => item.qty);
    const Customs = CARTs_array.map(item => item.price);

    const data = {
      "product_id": productIds,
      "sales_point_id": parseInt(currentSpt),
      "cust_name": IssalePaid?"Normal Customer":pro_client,
      "phone": IssalePaid?"123456789":pro_Cphone,
      "quantity": quantities,
      "sales_type": DataSwitchType?2:1,
      "custom_price":DataSwitchType?Customs:0,
      "paid_status":IssalePaid ? "Paid" : "Not Paid",
      "service_amount": 10.5,
      "user_id": cuserid
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/sales/bulksales.php",
        data,
        config
      )
      .then((response) => {

        //console.log(response);
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        dispatch(fetchAllProductsData(currentCompany, currentSpt));
        setIdent("");
        setPro_name("");
        setPro_price("");
        setPro_benefit("");
        setPro_Client("");
        setPro_Cphone("");
        setDataSwitchType(false);
        

        const shareData = CARTs_array.map(item => `\n${item.id}. ${item.name} on ${item.price} by quantity: ${item.qty} = ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "RWF",
        }).format(item.qty*item.price)}`).join(",\n ");
        const totalPrice = CARTs_array.reduce((total, item) => total + (item.price * item.qty), 0);

        Alert.alert("SELLEASEP App", "Done! Review Other Options", [
          {
            text: "Share",
            onPress: () => {
              Share.share({
                message: `${currentCompanyName} system:\n${cuser} share to you\n\n${shareData},\n\nTotal: ${new Intl.NumberFormat(
                  "en-US",
                  {
                    style: "currency",
                    currency: "RWF",
                  }
                ).format(totalPrice)}`,
                url: "https://myapp.com",
                title: `${currentCompanyName} `,
              });

              dispatch(clearCart());
              setSaveMsg("SAVE SALE");
            },
          },
          {
            text: "Cancel",
            onPress: () => {
              dispatch(clearCart());
              setSaveMsg("SAVE SALE");
            },
            style: "cancel",
          },
        ]);

      })
      .catch((error) => {
        //console.log(error)
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        setIdent("");
        setPro_name("");
        setPro_price("");
        setPro_benefit("");
      });
  };


    //Functions search

    const searchFilter = (text) => {
      if (text) {
        const newData = fetchedProducts.filter((item) => {
          const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
  
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFetchedProducts(newData);
        setSearchQuery(text);
      } else {
        setFetchedProducts(all_products);
        setSearchQuery(text);
      }
    };



    //Functions search customer

    const searchFilterCustomer = (text) => {
      if (text) {
        const newData = fetchedCustomers.filter((item) => {
          const itemData = item.names ? item.names.toUpperCase() : "".toUpperCase();
  
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFetchedCustomers(newData);
        setSearchQuery(text);
      } else {
        setFetchedCustomers(all_customers);
        setSearchQuery(text);
      }
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
      <ScrollView scrollEnabled={false}>
      <NativeBaseProvider>
        {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
        <View style={styles.container}>
          <StatusBar
            backgroundColor={currenttheme.secondary} // Set the background color of the status bar
            barStyle="white" // Set the text color of the status bar to dark
            hidden={false} // Show the status bar
          />

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
                {t('selling')}
              </Text>
            </LinearGradient>
          </View>

          <TouchableOpacity
            onPress={openModal}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 70,
              height: 70,
              backgroundColor: currenttheme.secondary,
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              position: "absolute",
              borderRadius: 100,
              right: 0,
              marginTop: 50,
              marginRight: 10,
              zIndex: 2,
              borderWidth: 3,
              borderColor: "white",
              borderStyle: "solid",
            }}
          >
            <FontAwesome name="plus" size={26} color="white" />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: currenttheme.light,
              width: "100%",
              padding: 10,
              height: "80%",
              borderColor: currenttheme.secondary,
              borderStyle: "solid",
              borderBottomWidth: 3,
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: 12,
                marginTop: 10,
                color: currenttheme.secondary,
                fontFamily: "Poppins-Bold",
                marginLeft: 5,
              }}
            >
             {t('selling-basket')} ({CARTs_array.length}{" "}
              {CARTs_array.length == 1 ? "Item" : "Items"})
            </Text>

            <View style={{
              height:250,
              width:"100%",
            }}>
            <ScrollView>
              <Center>
                {CARTs_array.map((item) => (
                  <View
                    style={{
                      backgroundColor: "white",
                      width: "98%",
                      padding: 10,
                      borderWidth: 1,
                      borderColor: currenttheme.secondary,
                      borderStyle: "solid",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignContent: "center",
                      flexDirection: "row",
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    key={item.id}
                  >
                    <View>
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: 11,
                          color: currenttheme.secondary,
                          fontFamily: "Poppins-Bold",
                          width: 120,
                        }}
                      >
                        {item.id}. {item.name}
                      </Text>
                      
                      <Text  style={{
                          textAlign: "left",
                          fontSize: 11,
                          color: "black",
                          fontFamily: "Poppins-Bold",
                          width: 120,
                        }}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(item.total_amount)}
                      </Text>

                    </View>

                    <View
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignContent: "center",
                        flexDirection: "row",
                        padding: 5,
                        width: 130,
                      }}
                    >
                      <View>
                        <TouchableOpacity onPress={() => decraeseItem(item.id)}>
                          <AntDesign
                            name="minuscircle"
                            size={34}
                            color={currenttheme.secondary}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: 13,
                          color: "black",
                          fontFamily: "Poppins-Bold",
                        }}
                      >
                        {item.qty}
                      </Text>
                      <View>
                        <TouchableOpacity onPress={() => increaseItem(item.id)}>
                          <AntDesign
                            name="pluscircle"
                            size={34}
                            color={currenttheme.secondary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: "red",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        flexDirection: "row",
                        height: 40,
                        borderRadius: 10,
                        width: 40,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          //setCartItemID(parseInt(item.id))

                          Alert.alert(
                            "SELLEASEP",
                            "Are you sure to remove this item",
                            [
                              {
                                text: `${t('cancel')}`,
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                              },
                              {
                                text: `${t('ok')}`,
                                onPress: () => handleRemoveItem(item.id),
                              },
                            ]
                          );
                        }}
                      >
                        <AntDesign name="delete" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </Center>
            </ScrollView>
            </View>


            
              
                <Text
                  style={{
                    marginLeft: 10,
                    textAlign: "left",
                    fontSize: 11,
                    color: "black",
                    fontFamily: "Poppins-Bold",
                  }}
                >
                {t('ispaid')}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    width: 50,
                    justifyContent: "center",
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

                  {/* <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={IssalePaid ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleSwitchToggle}
                    value={IssalePaid}
                  /> */}
                </View>

                <Text
                  style={{
                    marginLeft: 10,
                    marginBottom: 5,
                    fontSize: 11,
                    color: "black",
                    fontFamily: "Poppins-Bold",
                  }}
                >
                   {t('paystat')}:{" "}
                  <Text
                    style={{
                      color: IssalePaid ? "green" : "red",
                    }}
                  >
                    {IssalePaid ? `${t('paid')}` : `${t('no-paid')}`}
                  </Text>
                </Text>
              
            




            <Center>
              <View
                style={{
                  backgroundColor: "white",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignContent: "center",
                  flexDirection: "row",
                  height: 70,
                  borderRadius: 10,
                  width: "98%",
                  borderWidth: 1,
                  borderColor: currenttheme.secondary,
                  borderStyle: "solid",
                  padding: 10,
                }}
              >
                <View
                  style={{
                    width: "30%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      //setCartItemID(parseInt(item.id))

                      Alert.alert(
                        "SELLEASEP",
                        `${t('clearmes')}`,
                        [
                          {
                            text: `${t('cancel')}`,
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: `${t('ok')}`,
                            onPress: () => dispatch(clearCart()),
                          },
                        ]
                      );
                    }}
                    style={{
                      backgroundColor: currenttheme.secondary,
                      height: "90%",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        padding: 2,
                        fontSize: 11,
                      }}
                    >
                     {t('clearbas')} 
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: "70%",
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 16,
                      color: currenttheme.secondary,
                      fontFamily: "Poppins-Bold",
                      marginRight: 5,
                    }}
                  >
                    {t('total')} {" "}
                    <Text
                      style={{
                        textAlign: "left",
                        fontSize: 14,
                        color: "black",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "RWF",
                      }).format(
                        CARTs_array.reduce(
                          (accumulator, arr) => accumulator + arr.total_amount,
                          0
                        )
                      )}
                    </Text>{" "}
                  </Text>

                  {usertype == "BOSS" ? (
                    <Text
                      style={{
                        textAlign: "left",
                        fontSize: 14,
                        color: currenttheme.secondary,
                        fontFamily: "Poppins-Bold",
                        marginRight: 10,
                      }}
                    >
                      {t('benefit')} {" "}
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: 14,
                          color: "black",
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(
                          CARTs_array.reduce(
                            (accumulator, arr) =>
                              accumulator + arr.total_benefit,
                            0
                          )
                        )}
                      </Text>{" "}
                    </Text>
                  ) : (
                    ""
                  )}
                </View>
              </View>
            </Center>
          </View>

          

          {/* <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.normal,
                },
              ]}
            >
              All {all_products.length}{" "}
              {all_products.length == 1 ? "Product" : "Products"} list
            </Text>

            <Center>
              <Input
                w={{
                  base: "94%",
                  md: "25%",
                }}
                onChangeText={(e) => {
                  setSearchQuery(e);
                  dispatch(
                    fetchSearchProductsData(currentCompany, currentSpt, e)
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
                placeholder="Search..."
              />
            </Center> */}
        </View>
        {/* </ScrollView>


        
        {all_products_isLoading ? (
          <View>
            <Center>
              <ActivityIndicator size="large" color={currenttheme.secondary} />
              <Text style={styles.textInGFuc}>Loading Please Wait...</Text>
            </Center>
          </View>
        ) : (
          <FlatList
            style={{
              backgroundColor: "transparent",
            }}
            data={all_products}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ProductView", {
                    id: item.product_id,
                    name: item.name,
                    price: item.price,
                    benefit: item.benefit,
                    quantity:
                      item.current_quantity == 0
                        ? "No Stock"
                        : item.current_quantity,
                    alertQuantity:
                      item.alert_quantity == 0
                        ? "No Stock"
                        : item.alert_quantity,
                    time: timeAgo(item.created_at),
                    status: item.status == 1 ? true : false,
                    description: item.description,
                  })
                }
              >
                <Item
                  name={item.name}
                  id={item.product_id}
                  price={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.price)}
                  benefit={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.benefit)}
                  quantity={
                    item.current_quantity == 0
                      ? "No Stock"
                      : item.current_quantity
                  }
                  alertQuantity={
                    item.alert_quantity == 0 ? "No Stock" : item.alert_quantity
                  }
                  time={timeAgo(item.created_at)}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.product_id}
          />
        )} */}

        <Center
          flex={1}
          px="1"
          style={{
            marginBottom: 20,
          }}
        >
          <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <Text
                style={[
                  styles.textTitle2,
                  {
                    color: currenttheme.normal,
                  },
                ]}
              >
                {t('all')}  {all_products.length}{" "}
                {all_products.length == 1 ? "Product" : "Products"} list
              </Text>

              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: currenttheme.secondary,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  right: 0,
                  top: 0,
                  marginRight: 10,
                  marginTop: 10,
                  borderRadius: 5,
                }}
                onPress={closeModal}
              >
                <MaterialIcons name="cancel" size={26} color="white" />
              </TouchableOpacity>

              <Center>
                <Input
                  w={{
                    base: "94%",
                    md: "25%",
                  }}
                  onChangeText={(text) => searchFilter(text)}
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

              <Text>{""}</Text>
              {all_products_isLoading ? (
                <View>
                  <Center>
                    <ActivityIndicator
                      size="large"
                      color={currenttheme.secondary}
                    />
                    <Text style={styles.textInGFuc}>
                    {t('loading-wait')}
                    </Text>
                  </Center>
                </View>
              ) : (
                <FlatList
                  style={{
                    backgroundColor: "transparent",
                  }}
                  data={fetchedProducts}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible2(true);
                        setIdent(item.product_id);
                        setPro_price(item.price);
                        setPro_benefit(item.benefit);
                        setPro_name(item.name);
                        setPro_cqty(item.current_quantity);
                        setPro_qty(1);
                        setCalcshow(true);
                      }}
                    >
                      <Item
                        name={item.name}
                        id={item.product_id}
                        price={new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(item.price)}
                        benefit={new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(item.benefit)}
                        quantity={
                          item.current_quantity == 0
                            ? `${t('no-stock')}`
                            : item.current_quantity
                        }
                        alertQuantity={
                          item.alert_quantity == 0
                            ? `${t('no-stock')}`
                            : item.alert_quantity
                        }
                        time={timeAgo(item.created_at)}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.product_id}
                />
              )}
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible2}
          >
            <Center
              flex={1}
              px="1"
              style={{
                backgroundColor: "#00000032",
              }}
            >
              <View
                style={{
                  width: "90%",
                  padding: 20,
                  backgroundColor: "white",
                  borderRadius: 10,
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
                <Text
                  style={{
                    fontSize: 15,
                  }}
                >
                 {t('setqty')} {pro_name}
                </Text>

                <FormControl mt="3">
                  <FormControl.Label>{t('quantity')}</FormControl.Label>
                  <Input
                    value={pro_qty}
                    onChangeText={setPro_qty}
                    editable={edit}
                    inputMode="numeric"
                  />
                </FormControl>


                {SwitchType?<FormControl mt="3">
                  <FormControl.Label>Custom price</FormControl.Label>
                  <Input
                    value={Custom_Price}
                    onChangeText={setPro_Custom_Price}
                    editable={edit}
                    inputMode="numeric"
                  />
                </FormControl>:null}
                

                {SwitchType?pro_calcshow ? (
                  <Text
                    style={{
                      color: "green",
                      fontSize:9
                    }}
                  >
                    {t('total')}:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(parseFloat(Custom_Price) * parseFloat(pro_qty))}{", "}
                    Current stock: {pro_cqty},
                    {usertype == "BOSS"
                      ? ` Benefit: ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(
                          ((parseFloat(pro_benefit)/parseFloat(pro_price))*parseFloat(Custom_Price)) * parseFloat(pro_qty)
                        )}`
                      : ""}
                  </Text>
                ) : (
                  ""
                ):
                pro_calcshow ? (
                  <Text
                    style={{
                      color: "green",
                      fontSize:9
                    }}
                  >
                    {t('total')}:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(parseFloat(pro_price) * parseFloat(pro_qty))}{", "}
                    Current stock: {pro_cqty},
                    {usertype == "BOSS"
                      ? ` ${t('benefit')}: ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "RWF",
                        }).format(
                          parseFloat(pro_benefit) * parseFloat(pro_qty)
                        )}`
                      : ""}
                  </Text>
                ) : (
                  ""
                )
                }



                <Text
                  style={{
                    marginLeft: 10,
                    textAlign: "left",
                    fontSize: 11,
                    color: "black",
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  {t('setprice')}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    width: 50,
                    justifyContent: "center",
                  }}
                >
                  <Switch
                offTrackColor="#de003b"
                onTrackColor="#17ab00"
                onThumbColor="#107800"
                offThumbColor="#78002c"
                size="lg"
                value={SwitchType}
                onValueChange={handleSwitchToggleType}
              />





                </View>

                <View
                  style={{
                    marginTop: 20,
                    width: "100%",
                    padding: 5,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={closeModal2}
                    style={{
                      width: "40%",
                      height: 40,
                      backgroundColor: currenttheme.light,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      {t('cancel')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleAddtoList}
                    style={{
                      width: "40%",
                      height: 40,
                      backgroundColor: currenttheme.secondary,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                      }}
                    >
                      {t('add-product')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Center>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible3}
          >
            <Center
              flex={1}
              px="1"
              style={{
                backgroundColor: "#00000032",
              }}
            >
              <View
                style={{
                  width: "90%",
                  padding: 20,
                  backgroundColor: "white",
                  borderRadius: 10,
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
                <Text
                  style={{
                    fontSize: 15,
                  }}
                >
                  {t('setbdt')}
                </Text>

                <FormControl mt="3">
                  <FormControl.Label>{t('custname')}</FormControl.Label>
                  <Input
                    onChangeText={(text) => searchFilterCustomer(text)}
                    value={searchQuery}
                    editable={edit}
                  />
                </FormControl>

                <View style={{
                  height:220, 
                  marginTop:10
                }}>
                <FlatList
                  style={{
                    backgroundColor: "transparent",
                  }}
                  data={fetchedCustomers}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIdent(item.customer_id);
                      }}
                    >

                      <ItemCustomer
                        names={item.names}
                        id={item.customer_id}
                        phone={item.phone}
                        location={item.address}
                      />

                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.customer_id}
                /></View>



                <View
                  style={{
                    marginTop: 20,
                    width: "100%",
                    padding: 5,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={closeModal3}
                    style={{
                      width: "40%",
                      height: 40,
                      backgroundColor: currenttheme.light,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                      }}
                    >
                      {t('cancel')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={Adding_information}
                    style={{
                      width: "40%",
                      height: 40,
                      backgroundColor: currenttheme.secondary,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                      }}
                    >
                      {t('finish')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Center>
          </Modal>

          {/* <Center>
            <Modal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                setIdent("");
                setPro_name("");
                setPro_price("");
                setPro_benefit("");
              }}
              animationDuration={500}
            >
              <Modal.Content maxWidth="500px" width="340px">
                <Modal.CloseButton />
                <Modal.Header>Add New</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <Input
                      value={pro_name}
                      onChangeText={setPro_name}
                      editable={edit}
                    />
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>Price</FormControl.Label>
                    <Input
                      value={pro_price}
                      onChangeText={setPro_price}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="4">
                    <FormControl.Label>Benefit</FormControl.Label>
                    <Input
                      value={pro_benefit}
                      onChangeText={setPro_benefit}
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
                        onPress={Adding_information}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>Add product</Text>
                        )}
                      </Button>
                    </TouchableOpacity>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center> */}
        </Center>
        
        <Center>
            {CARTs_array.length > 0 ? (
              IssalePaid ? (
                <TouchableOpacity
                  onPress={Adding_information}
                  style={{
                    backgroundColor: currenttheme.secondary,
                    width: "80%",
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    flexDirection: "column",
                    bottom: 0,
                    borderRadius: 100,
                    marginTop:-30
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 18,
                      color: "white",
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    {saveMsg}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 13,
                      color: "white",
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(
                      CARTs_array.reduce(
                        (accumulator, arr) => accumulator + arr.total_amount,
                        0
                      )
                    )}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={openModal3}
                  style={{
                    backgroundColor: currenttheme.secondary,
                    width: "80%",
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    flexDirection: "column",
                    bottom: 0,
                    borderRadius: 100,
                    marginTop:-30
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 18,
                      color: "white",
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    {saveMsg}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      fontSize: 13,
                      color: "white",
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(
                      CARTs_array.reduce(
                        (accumulator, arr) => accumulator + arr.total_amount,
                        0
                      )
                    )}
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              ""
            )}
          </Center>
      </NativeBaseProvider>
      </ScrollView>
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
    backgroundColor: "#fff",
    marginTop: 0,
    width: "100%",
    height: "100%",
    //flex: 1,
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
    marginVertical: 3,
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

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});

export default Shopping;
