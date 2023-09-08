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
  //Modal,
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
  fetchAllServicesData,
  fetchSearchServicesData,
} from "../../features/getallservices/getallservices";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Services = ({ navigation }) => {
  const dispatch = useDispatch();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  //Get All products from redux array
  const { 
    all_service_error,
    all_Services,
    all_Services_isLoading } =
    useSelector((state) => state.getallservices);

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

  //Normal
  const [refreshing, setRefreshing] = useState(false);
  const [datas, setDatas] = useState([]);
  const isFocused = useIsFocused();
  const toast = useToast();

  //Modals
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Infos
  const [ident, setIdent] = useState("");
  const [pro_name, setPro_name] = useState("");
  const [pro_price, setPro_price] = useState("");
  const [pro_benefit, setPro_benefit] = useState("");
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
  const [usertype, setusertype] = useState(null);
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
    dispatch(fetchAllServicesData(currentCompany, currentSpt));
    // perform your refresh logic here
    setRefreshing(false);
  };

  useEffect(() => {
    loadFonts();
    dispatch(fetchAllServicesData(currentCompany, currentSpt));
    if (isFocused) {
      dispatch(fetchAllServicesData(currentCompany, currentSpt));
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
        body: `You've add new service ${pro_name}`,
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
    status,
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
              fontSize: 14,
              color: "white",
              fontFamily: "Poppins-Bold",
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 11,
              fontFamily: "Poppins-Bold",
            }}
          >
            Status: {status}
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
    setEdit(false);
    setIsLoading(true);

    const data = {
      service_name: pro_name,
      description: "New Service added",
      price: pro_price,
      service_type: "NONE",
      area_measure:0,
      company_ID: currentCompany,
      sales_point_id: currentSpt,
      status: 1,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/service/addnewservice.php",
        data,
        config
      )
      .then((response) => {
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        dispatch(fetchAllServicesData(currentCompany, currentSpt));
        setIdent("");
        setPro_name("");
        setPro_price("");
      })
      .catch((error) => {
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        setIdent("");
        setPro_name("");
        setPro_price("");
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

            <View style={styles.header}>
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
                <Text style={styles.itemBtnText}>Add New Service</Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.normal,
                },
              ]}
            >
              All {all_Services.length}{" "}
              {all_Services.length == 1 ? "Service" : "Services"} list
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
                    fetchSearchServicesData(currentCompany, currentSpt, e)
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
            </Center>
          </View>
        </ScrollView>

        {all_Services_isLoading ? (
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
            data={all_Services}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ServiceView", {
                    id: item.service_id,
                    name: item.service_name,
                    price: item.price,
                    time: timeAgo(item.created_at),
                    status: item.status == 1 ? true : false,
                    description: item.description,
                  })
                }
              >
                <Item
                  name={item.service_name}
                  id={item.service_id}
                  price={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.price)}
                  benefit={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                  }).format(item.area_measure)}
                  status={item.status == 0 ? "Not Active" : "Active"}
                  time={timeAgo(item.created_at)}
                />

              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.service_id}
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
    width: "90%",
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

export default Services;
