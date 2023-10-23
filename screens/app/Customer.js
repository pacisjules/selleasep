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

import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import i18next, { languageResources } from "./services/i18next";
import { useTranslation } from "react-i18next";

import { useSelector, useDispatch } from "react-redux";

import { fetchallCustomersData } from "../../features/getallcustomers/getallcustomers";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Customer = ({ navigation }) => {
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
  const { t } = useTranslation();
  const changeLng = (lng) => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };
  //Normal
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const toast = useToast();

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
  const [pro_Phone, setPro_Phone] = useState("");
  const [pro_Address, setPro_Address] = useState("");
  const [modalVisible5, setModalVisible5] = useState(false);

  //const [user, setUser] = useState(null);
  const [CustNames, setCust_Names] = useState("");
  const [CustPhone, setCustPhone] = useState("");
  const [CustAddress, setCustAddress] = useState("");

  const closeModal5 = () => {
    setModalVisible5(false);
    setCust_Names("");
    setCustPhone(null);
    setCustAddress("");
  };

  //Infos
  const [pro_name, setPro_name] = useState("");
  const [edit, setEdit] = useState(true);

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //Get All inventory from redux array
  const { all_customers_error, all_customers, all_customers_isLoading } =
    useSelector((state) => state.getallcustomers);

  //For search inventory
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedCustomers, setFetchedCustomers] = useState([
    useSelector((state) => state.getallcustomers.all_customers),
  ]);

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
    dispatch(fetchallCustomersData(currentSpt));
    // perform your refresh logic here
    setRefreshing(false);
    setFetchedCustomers(all_customers);
  };

  //Functions search

  const searchFilter = (text) => {
    if (text) {
      const newData = fetchedCustomers.filter((item) => {
        const itemData = item.names ? item.name.toUpperCase() : "".toUpperCase();

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

  useEffect(() => {
    loadFonts();
    dispatch(fetchallCustomersData(currentSpt));
    setFetchedCustomers(all_customers);
    if (isFocused) {
      dispatch(fetchallCustomersData(currentSpt));
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
        title: `Selleasep sales system`,
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

  const Item = ({ id, name, phone, address }) => (
    <Center px="1">
      <View
        style={[
          styles.item,
          {
            borderColor: currenttheme.secondary,
            borderStyle: "solid",
            borderWidth: 1,
          },
        ]}
      >
        <View
          style={{
            width: "100%",
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
            {t("phone")}: {phone}
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontFamily: "Poppins-Regular",
            }}
          >
            {t("location")}: {address}
          </Text>
        </View>
      </View>
    </Center>
  );

  //Adding Command
  const Adding_customer = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      names: CustNames,
      phone: CustPhone,
      address: CustAddress,
      spt: parseInt(currentSpt),
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://selleasep.shop/functions/customer/insertcustomer.php",
        data,
        config
      )
      .then((response) => {
        //console.log(response);
        dispatch(fetchallCustomersData(currentSpt));
        setFetchedCustomers(all_customers);
        schedulePushNotification();
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);

        setModalVisible5(false);
        setCust_Names("");
        setCustPhone(null);
        setCustAddress("");
        //setDataSwitchType(false);
      })
      .catch((error) => {
        //console.log(error)
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setIsLoading(false);
        dispatch(fetchallCustomersData(currentSpt));
        setFetchedCustomers(all_customers);

        setModalVisible5(false);
        setCust_Names("");
        setCustPhone(null);
        setCustAddress("");
      });
  };

  const deleteProduct = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      customer_id: parseInt(SelectedID),
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://selleasep.shop/functions/customer/removecustomer.php",
        data,
        config
      )
      .then((response) => {
        //console.log(response);
        setFetchedCustomers([]);
        setNotMessage(`This Customer ${SelectedName} has been deleted`);
        schedulePushNotification();
        setIsLoading(false);
        Vibration.vibrate();
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        //dispatch(fetchallCustomersData(currentSpt));;
      })
      .catch((error) => {
        console.log(error);
        setNotMessage(
          `This Customer of ${SelectedName} has failed to be deleted`
        );
        Vibration.vibrate();
        setIsLoading(false);
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        //dispatch(fetchallCustomersData(currentSpt));;
      });
  };

  //Adding Command
  const Update_information = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      customer_id: parseInt(SelectedID),
      names: SelectedName,
      phone: pro_Phone,
      address: pro_Address,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/customer/updatecustomer.php",
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

        dispatch(fetchallCustomersData(currentSpt));
        setFetchedCustomers(all_customers);
      })
      .catch((error) => {
        dispatch(fetchallCustomersData(currentSpt));
        setFetchedCustomers(all_customers);
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
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
      return `${diffSeconds} ${t("secago")}`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${t("minago")}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${t("hago")}`;
    } else {
      return `${diffDays} ${t("dayago")}`;
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

            {/* <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.normal,
                },
              ]}
            >
                
              {t('all')} {all_customers.length}{" "}
              {all_customers.length == 1 ? `${t('customer')}` : `${t('customers')}`} {t('list')}
            </Text> */}

            <Text
              style={{
                fontFamily: "Regular",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 5,
                color: "#a8006e",
              }}
            >
              {t("all")} {all_customers.length}{" "}
              {all_customers.length == 1
                ? `${t("customer")}`
                : `${t("customers")}`}{" "}
              {t("list")}
            </Text>

            <View style={styles.header}>
              <TouchableOpacity
                style={[
                  styles.itemBtn,
                  {
                    backgroundColor: currenttheme.secondary,
                    borderColor: currenttheme.secondary,
                  },
                ]}
                onPress={() => {
                  setModalVisible5(true);
                }}
              >
                <MaterialIcons name="add-to-photos" size={24} color="white" />
                <Text style={styles.itemBtnText}>{t("add-new")}</Text>
              </TouchableOpacity>
            </View>

            <Center
              style={{
                marginTop: 20,
              }}
            >
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
                placeholder={t("search")}
              />
            </Center>
          </View>
        </ScrollView>

        {all_customers_isLoading ? (
          <View>
            <Center>
              <ActivityIndicator size="large" color={currenttheme.secondary} />
              <Text style={styles.textInGFuc}>{t("loading-wait")}</Text>
            </Center>
          </View>
        ) : (
          <FlatList
            style={{
              backgroundColor: "white",
            }}
            data={fetchedCustomers}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedID(item.customer_id);
                  setSelectedName(item.names);
                  setPro_Phone(item.phone);
                  setPro_Address(item.address);
                  setIsOpenAlert(true);
                  //
                }}
              >
                <Item
                  name={item.names}
                  id={item.customer_id}
                  phone={item.phone}
                  address={item.address}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        )}

        <Modal
          isOpen={modalVisible5}
          onClose={() => {
            setModalVisible5(false);
          }}
          animationDuration={500}
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
                width: "85%",
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
                {t("addnew-cutms")}
              </Text>

              <View
                style={{
                  height: 210,
                  marginTop: 10,
                }}
              >
                <FormControl>
                  <Input
                    w={{
                      base: "94%",
                      md: "25%",
                    }}
                    style={{
                      marginTop: 5,
                    }}
                    onChangeText={setCust_Names}
                    value={CustNames}
                    placeholder={t("Customer names")}
                  />
                </FormControl>

                <FormControl>
                  {" "}
                  <Input
                    w={{
                      base: "94%",
                      md: "25%",
                    }}
                    style={{
                      marginTop: 5,
                    }}
                    onChangeText={setCustPhone}
                    value={CustPhone}
                    placeholder={t("Phone number")}
                    inputMode="numeric"
                  />
                </FormControl>

                <FormControl>
                  {" "}
                  <Input
                    w={{
                      base: "94%",
                      md: "25%",
                    }}
                    style={{
                      marginTop: 5,
                    }}
                    onChangeText={setCustAddress}
                    value={CustAddress}
                    placeholder={t("Address")}
                  />
                </FormControl>
              </View>

              <View
                style={{
                  width: "100%",
                  padding: 5,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={closeModal5}
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
                    {t("cancel")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={Adding_customer}
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
                    {t("finish")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Center>
        </Modal>

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
                <Modal.Header>{t("edit")}</Modal.Header>
                <Modal.Body>
                  <FormControl mt="3">
                    <FormControl.Label>{t("name")}</FormControl.Label>
                    <Input
                      value={SelectedName}
                      onChangeText={setSelectedName}
                      editable={edit}
                      
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>{t("phone")}</FormControl.Label>
                    <Input
                      value={pro_Phone}
                      onChangeText={setPro_Phone}
                      editable={edit}
                      inputMode="numeric"
                    />
                  </FormControl>

                  <FormControl mt="3">
                    <FormControl.Label>{t("location")}</FormControl.Label>
                    <Input
                      value={pro_Address}
                      onChangeText={setPro_Address}
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
                          backgroundColor: currenttheme.secondary,
                        }}
                        onPress={Update_information}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={{ color: "white" }}>{t("edit")}</Text>
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
                <AlertDialog.Header>{t("invquick")}</AlertDialog.Header>
                <AlertDialog.Body>
                  <Text>
                    {t("invmes")} {SelectedName}.
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
                        <Text style={{ color: "gray" }}>
                          {t("loading-wait")}
                        </Text>
                      ) : (
                        <Text style={{ color: "gray" }}>{t("cancel")}</Text>
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
                        <Text style={{ color: "white" }}>{t("edit")}</Text>
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
                        <Text style={{ color: "white" }}>{t("remove")}</Text>
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
                <AlertDialog.Header>{t("delete")}</AlertDialog.Header>
                <AlertDialog.Body>
                  <Text>
                    {t("are-you-sure-to-delete-now")} {SelectedName} ?
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
  },

  itemBtnText: {
    color: "white",
    marginLeft: 10,
  },
});

export default Customer;
