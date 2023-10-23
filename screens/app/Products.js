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
} from "react-native";
import * as Font from "expo-font";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import {
  Button,
  Modal,
  FormControl,
  Input,
  Center,
  NativeBaseProvider,
  useToast,
  Icon,
} from "native-base";

import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllProductsData,
  fetchSearchProductsData,
  search_AllProductsData

} from "../../features/getfullproducts/getallproducts";

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

const Products = ({ navigation }) => {
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState([useSelector((state) => state.all_products.all_products)]);


  //Get All products from redux array
  const { all_product_error, all_products, all_products_isLoading } =
    useSelector((state) => state.all_products);

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

  const [usertype, setusertype] = useState(
    useSelector((state) => state.userInfos.currentUserType)
  );


  
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
  const [notMessage, setNotMessage] = React.useState("");
  const [companyName, setCompanyName] = useState(
    useSelector((state) => state.userInfos.currentUserCompany)
  );

  //Infos
  const [ident, setIdent] = useState("");
  const [pro_name, setPro_name] = useState("");
  const [pro_price, setPro_price] = useState("");
  const [pro_benefit, setPro_benefit] = useState("");
  const [edit, setEdit] = useState(true);
  const [pro_message, setPro_message] = useState("");

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
  const [themeset, setthemeset] = useState("");

  //For search products
  const [searchQuery, setSearchQuery] = useState("");

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
    setFetchedProducts(all_products);
    dispatch(fetchAllProductsData(currentCompany, currentSpt));
    // perform your refresh logic here
    setRefreshing(false);
  };

  useEffect(() => {
    loadFonts();
    dispatch(fetchAllProductsData(currentCompany, currentSpt));
    
    setFetchedProducts(all_products);
    
    if (isFocused) {
      dispatch(fetchAllProductsData(currentCompany, currentSpt));
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
            {t('quantity')}: {quantity} {t('alert')}: {alertQuantity}
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

  //Adding Command
  const Adding_information = async () => {

    if(pro_name===""){
      setPro_message("Please add product name");
    }else if(pro_price===""){
      setPro_message("Please add product unit price");
    }else if(pro_benefit===""){
      setPro_message("Please add product unit benefit");
    }
    else{
      setEdit(false);
    setIsLoading(true);

    const data = {
      name: pro_name,
      price: pro_price,
      benefit: pro_benefit,
      company_ID: currentCompany,
      sales_point_id: currentSpt,
      status: 1,
      description: "New Product added",
      barcode: "NONE",
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/product/addnewproduct.php",
        data,
        config
      )
      .then((response) => {
        setNotMessage(`New product ${pro_name} has been saved Successfully`);
        schedulePushNotification();
        
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        dispatch(fetchAllProductsData(currentCompany, currentSpt));
        setFetchedProducts(all_products);
        setIdent("");
        setPro_name("");
        setPro_price("");
        setPro_benefit("");
      })
      .catch((error) => {
        setNotMessage(`New product ${pro_name} has been saved Successfully`);
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        setIdent("");
        setPro_name("");
        setPro_price("");
        setPro_benefit("");
      });
    }
    
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

            <View style={styles.header}>
              {usertype == "BOSS" ? (
                <TouchableOpacity
                  style={[
                    styles.itemBtn,
                    {
                      backgroundColor: currenttheme.secondary,
                      borderColor: currenttheme.secondary,
                    },
                  ]}
                  onPress={() => setShowModal(true)}
                >
                  <MaterialIcons name="add-to-photos" size={24} color="white" />
                  <Text style={styles.itemBtnText}>{t('add-new-product')}</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.normal,
                },
              ]}
            >
              {t('all')} {all_products.length}{" "}
              {all_products.length == 1 ? `${t('product')}` : `${t('products')}`} {t('list')}
            </Text>

            <Center>


              <Input
                w={{
                  base: "94%",
                  md: "25%",
                }}
                onChangeText={(text)=>searchFilter(text)}

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

        {all_products_isLoading ? (
          <View>
            <Center>
              <ActivityIndicator size="large" color={currenttheme.secondary} />
              <Text style={styles.textInGFuc}>{t('loading-wait')}</Text>
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
                onPress={() =>
                  navigation.navigate("ProductView", {
                    id: item.product_id,
                    name: item.name,
                    price: item.price,
                    benefit: item.benefit,
                    quantity:
                      item.current_quantity == 0
                        ? `${t('no-stock')}`
                        : item.current_quantity,
                    alertQuantity:
                      item.alert_quantity == 0
                        ? `${t('no-stock')}`
                        : item.alert_quantity,
                    time: timeAgo(item.created_at),
                    status: item.status == 1 ? true : false,
                    description: item.description,
                    barcode: item.barcode,
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
                      ? `${t('no-stock')}`
                      : item.current_quantity
                  }
                  alertQuantity={
                    item.alert_quantity == 0 ? `${t('no-stock')}` : item.alert_quantity
                  }
                  time={timeAgo(item.created_at)}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.product_id}
          />
        )}

        <Center flex={1} px="3">
          <Center>
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
                <Modal.Header>{t('add-new')}</Modal.Header>
                <Modal.Body>
                  <FormControl>
                    <FormControl.Label>{t('name')}</FormControl.Label>
                    <Input
                      value={pro_name}
                      onChangeText={setPro_name}
                      editable={edit}
                    />
                  </FormControl>
                  <FormControl mt="3">
                    <FormControl.Label>{t('price')}</FormControl.Label>
                    <Input
                      value={pro_price}
                      onChangeText={setPro_price}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="4">
                    <FormControl.Label>{t('benefit')}</FormControl.Label>
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
                        <Text style={{ color: "gray" }}>{t('loading-wait')}</Text>
                      ) : (
                        <Text style={{ color: "gray" }}>{t('cancel')}</Text>
                      )}
                    </Button>

                    {usertype === "BOSS" ? (
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
                            <Text style={{ color: "white" }}>{t('add-product')}</Text>
                          )}
                        </Button>
                        <Text style={{
                          color:"red",
                          fontSize:10,
                        }}>{pro_message}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
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
    marginVertical: 3,
    borderRadius: 10,
    width: "95%",
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

export default Products;
