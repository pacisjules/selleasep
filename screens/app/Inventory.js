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

import { useSelector, useDispatch } from "react-redux";

import {
  fetchAllInventoryData,
  fetchSearchInventoryData,
} from "../../features/getallinventory/getallinventory";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Inventory = ({ navigation }) => {
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
  const [pro_Alertqty, setPro_Alertqty] = useState(0);

  //Infos
  const [pro_name, setPro_name] = useState("");
  const [edit, setEdit] = useState(true);

  //Notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //For search products
  const [searchQuery, setSearchQuery] = useState("");

  //Sales Data

  const { all_inventory, all_inventory_isLoading, all_inventory_error } =
    useSelector((state) => state.getallinventory);

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
    dispatch(fetchAllInventoryData(currentCompany, currentSpt));
    // perform your refresh logic here
    setRefreshing(false);
  };

  useEffect(() => {
    loadFonts();
    dispatch(fetchAllInventoryData(currentCompany, currentSpt));
    if (isFocused) {
      dispatch(fetchAllInventoryData(currentCompany, currentSpt));
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
    id,
    name,
    description,
    Current_quantity,
    alert_quantity,
    last_updated,
    sales_point_id,
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
              fontFamily: "Poppins-Regular",
            }}
          >
            Status: {(status = 1 ? "Active" : "No Active")} {"  "}
            Alert Qty: {alert_quantity}
          </Text>
        </View>

        <View
          style={{
            width: "30%",
            flexDirection: "column",
          }}
        >
          <Text style={styles.title2}> {Current_quantity} Qty</Text>
          <Text
            style={{
              fontSize: 12,
              color: currenttheme.normal,
              textAlign: "right",
              fontFamily: "Poppins-Bold",
            }}
          >
            {last_updated}
          </Text>
        </View>
      </View>
    </Center>
  );

  const deleteProduct = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      product_id: parseInt(SelectedID),
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/inventory/deleteinventory.php",
        data,
        config
      )
      .then((response) => {
        //console.log(response);
        setNotMessage(`This Inventory of ${SelectedName} has been deleted`);
        schedulePushNotification();
        setIsLoading(false);
        Vibration.vibrate();
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAllInventoryData(currentCompany, currentSpt));
      })
      .catch((error) => {
        console.log(error);
        setNotMessage(
          `This Inventory of ${SelectedName} has failed to be deleted`
        );
        Vibration.vibrate();
        setIsLoading(false);
        setSelectedName(null);
        setSelectedID(null);
        setIsOpen(false);
        dispatch(fetchAllInventoryData(currentCompany, currentSpt));
      });
  };

  //Adding Command
  const Update_information = async () => {
    setEdit(false);
    setIsLoading(true);

    const data = {
      product_id: parseInt(SelectedID),
      salespt_id:currentSpt,
      user_id:cuser,
      quantity: pro_qty,
      alert_quantity: pro_Alertqty
      
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(
        "https://www.selleasep.shop/functions/inventory/updateinventory.php",
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
        dispatch(fetchAllInventoryData(currentCompany, currentSpt));
        setPro_qty(0);
        setPro_Alertqty(0);
      })
      .catch((error) => {
        setEdit(true);
        setShowModal(false);
        Vibration.vibrate();
        setPro_qty(0);
        setPro_Alertqty(0);
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

            <Text
              style={[
                styles.textTitle2,
                {
                  color: currenttheme.normal,
                },
              ]}
            >
              All {all_inventory.length}{" "}
              {all_inventory.length == 1 ? "item" : "items"} list
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
                    fetchSearchInventoryData(currentCompany, currentSpt, e)
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

        {all_inventory_isLoading ? (
          <View>
            <Center>
              <ActivityIndicator size="large" color={currenttheme.secondary} />
              <Text style={styles.textInGFuc}>Loading Please Wait...</Text>
            </Center>
          </View>
        ) : (
          <FlatList
            style={{
              backgroundColor: "white",
            }}
            data={all_inventory}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedID(item.product_id);
                  setSelectedName(item.name);
                  setIsOpenAlert(true);
                  setPro_Alertqty(item.alert_quantity);
                  setPro_qty(item.Current_quantity);
                }}
              >
                <Item
                  name={item.name}
                  id={item.id}
                  Current_quantity={item.Current_quantity}
                  alert_quantity={item.alert_quantity}
                  last_updated={timeAgo(item.last_updated)}
                  remainqty={item.remain_stock}
                  sales_point_id={item.sales_point_id}
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

                  <FormControl mt="3">
                    <FormControl.Label>Alert Quantity</FormControl.Label>
                    <Input
                      value={pro_Alertqty}
                      onChangeText={setPro_Alertqty}
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
                          <Text style={{ color: "white" }}>Edit Inventory</Text>
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
                <AlertDialog.Header>Inventory Quick Actions</AlertDialog.Header>
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
                  <Text>
                    Are you sure to delete {SelectedName} Inventory now ?
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
                        <Text style={{ color: "gray" }}>Please wait..</Text>
                      ) : (
                        <Text style={{ color: "gray" }}>Cancel</Text>
                      )}
                    </Button>
                    <Button colorScheme="danger" onPress={deleteProduct}>
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

export default Inventory;
