import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";

import {
  StyleSheet,
  Text,
  ActivityIndicator,
  ImageBackground,
  LogBox,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import Registeruser from "./screens/Registeruser";
import HomeScreen from "./screens/HomeScreen";
import Entry from "./screens/app/Entry";
import Products from "./screens/app/Products";
import ProductView from "./screens/app/ProductView";
import Sales from "./screens/app/Sales";
import Reports from "./screens/app/Reports";
import Yesterday from "./screens/app/Yesterday";
import RedPick from "./screens/app/RedPick";
import Expenses from "./screens/app/Expenses";
import Themechoose from "./screens/Themechoose";
import Themechooseb from "./screens/Themechooseb";
import Loading from "./screens/Loading";
import Inventory from "./screens/app/Inventory";
import Weekreport from "./screens/app/Weekreport";
import FromTo from "./screens/app/FromTo";
import MonthReport from "./screens/app/MonthReport";
import YearReport from "./screens/app/YearReport";
import Services from "./screens/app/Services";
import ServiceView from "./screens/app/ServiceView";
import Debts from "./screens/app/Debts";
import IncidentalReport from "./screens/app/IncidentalReport";
import InventoryIn from "./screens/app/InventoryIn";
import AlertInventory from "./screens/app/AlertInventory";
import Aboutus from "./screens/app/Aboutus";
import SystemSetting from "./screens/app/SystemSetting";
import Shopping from "./screens/app/Shopping";
import Viewdebts from "./screens/app/Viewdebts";
import Allemployees from "./screens/app/Allemployees";
import Getusers from "./screens/app/Getusers";
import Getsalesbyuser from "./screens/app/Getsalesbyuser";
import SetSPT from "./screens/app/SetSPT";
import SetLanguage from "./screens/app/SetLanguage";

import * as FileSystem from "expo-file-system";
import { Center, NativeBaseProvider } from "native-base";
import { useSelector, useDispatch } from "react-redux";

import * as Font from "expo-font";
import theme from "./constants/themes";

//Add redux provider
import { store } from "./store/store";
import { Provider } from "react-redux";

export default function App() {
  LogBox.ignoreAllLogs();
  const loadImg = require("./assets/afroGril.jpg");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState();

  const clearAppCache = async () => {
    try {
      // Clear file cache
      await FileSystem.deleteAsync(FileSystem.cacheDirectory, {
        idempotent: true,
      });
    } catch (error) {}
  };

  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    });

    setFontsLoaded(true);
  }

  //Load application user data

  const checkLoginStatus = async () => {
    const loggedInStatus = await AsyncStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedInStatus === "true");
  };

  useEffect(() => {
    clearAppCache();
    checkLoginStatus();
    loadFonts();
  }, []);

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
            <ActivityIndicator size="large" color="#ff8400" />
            <Text
              style={{
                color: "#ff8400",
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              Loading...
            </Text>
          </Center>
        </ImageBackground>
      </NativeBaseProvider>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="Loading"
              component={Loading}
              options={{
                title: "Select Theme",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: " Sales Shop",
                headerShown: false,
              }}
            />

            <Stack.Screen name="Register" component={Registeruser} />
            <Stack.Screen
              name="Entry"
              options={{
                title: "Fill user information",
                headerShown: false,
              }}
              component={Entry}
            />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen
              name="ProductView"
              component={ProductView}
              title="View information"
            />
            <Stack.Screen name="Sales" component={Sales} title="Sales" />
            <Stack.Screen name="Reports" component={Reports} title="Reports" />
            <Stack.Screen
              name="Yesterday"
              component={Yesterday}
              title="Yesterday report"
            />
            <Stack.Screen name="RedPick" component={RedPick} title="Report" />
            <Stack.Screen
              name="Expenses"
              component={Expenses}
              title="Expenses"
            />

            <Stack.Screen
              name="Themechoose"
              component={Themechoose}
              title="Theme Choose"
            />

            <Stack.Screen
              name="Themechooseb"
              component={Themechooseb}
              title="Theme Choose"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Inventory"
              component={Inventory}
              title="Inventory"
            />

            <Stack.Screen
              name="Weekreport"
              component={Weekreport}
              title="Weekly Report"
            />

            <Stack.Screen
              name="FromTo"
              component={FromTo}
              title="From To Report"
            />

            <Stack.Screen
              name="MonthReport"
              component={MonthReport}
              title="Month Report"
            />

            <Stack.Screen
              name="YearReport"
              component={YearReport}
              title="Year Report"
            />

            <Stack.Screen
              name="Services"
              component={Services}
              title="Services"
            />

            <Stack.Screen
              name="ServiceView"
              component={ServiceView}
              title="Service View"
            />

            <Stack.Screen
              name="IncidentalReport"
              component={IncidentalReport}
              title="Incidental Report"
            />

            <Stack.Screen
              name="InventoryIn"
              component={InventoryIn}
              title="InventoryIn Report"
            />

            <Stack.Screen
              name="AlertInventory"
              component={AlertInventory}
              title="Alert Inventory Report"
            />

            <Stack.Screen
              name="Aboutus"
              component={Aboutus}
              title="About us"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="SystemSetting"
              component={SystemSetting}
              title="System Setting"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Shopping"
              component={Shopping}
              title="Shopping"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Viewdebts"
              component={Viewdebts}
              title="Viewdebts"
              options={{
                headerShown: true,
              }}
            />

            <Stack.Screen
              name="Allemployees"
              component={Allemployees}
              title="Allemployees"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Getusers"
              component={Getusers}
              title="Get Users"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Getsalesbyuser"
              component={Getsalesbyuser}
              title="Get Sales by Users"
              options={{
                headerShown: true,
              }}
            />

            <Stack.Screen
              name="SetSPT"
              component={SetSPT}
              title="Set SPT"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="SetLanguage"
              component={SetLanguage}
              title="SetLanguage"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                title: "Please login or register",
                headerShown: true,
                headerStyle: {
                  backgroundColor: theme.mangoTheme.secondary,
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 15,
                },
              }}
            />

            <Stack.Screen name="Debts" component={Debts} title="Debts" />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                title: "Please login or register",
                headerShown: true,
                headerStyle: {
                  backgroundColor: theme.mangoTheme.secondary,
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 15,
                },
              }}
            />

            <Stack.Screen
              name="Register"
              component={Registeruser}
              options={{
                title: "Fill user information",
                headerShown: true,
                headerStyle: {
                  backgroundColor: theme.mangoTheme.secondary,
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 15,
                },
                headerTintColor: theme.white,
              }}
            />

            <Stack.Screen
              options={{
                title: "Fill user information",
                headerShown: false,
              }}
              name="Entry"
              component={Entry}
            />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen
              name="ProductView"
              component={ProductView}
              title="View information"
            />
            <Stack.Screen name="Sales" component={Sales} title="Sales" />
            <Stack.Screen name="Reports" component={Reports} title="Reports" />
            <Stack.Screen
              name="Yesterday"
              component={Yesterday}
              title="Yesterday report"
            />
            <Stack.Screen name="RedPick" component={RedPick} title="Report" />
            <Stack.Screen
              name="Expenses"
              component={Expenses}
              title="Expenses"
            />
            <Stack.Screen
              name="Themechoose"
              component={Themechoose}
              options={{
                title: "Select Theme",
                headerShown: false,
                headerStyle: {
                  backgroundColor: theme.mangoTheme.secondary,
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 15,
                },
                headerTintColor: theme.white,
              }}
            />

            <Stack.Screen
              name="Themechooseb"
              component={Themechooseb}
              title="Theme Choose"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Loading"
              component={Loading}
              options={{
                title: "Select Theme",
                headerShown: false,
                headerStyle: {
                  backgroundColor: theme.mangoTheme.secondary,
                },
                headerTitleStyle: {
                  color: "white",
                  fontSize: 15,
                },
                headerTintColor: theme.white,
              }}
            />

            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: " Sales Shop",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Inventory"
              component={Inventory}
              title="Inventroy"
            />

            <Stack.Screen
              name="Weekreport"
              component={Weekreport}
              title="Weekly Report"
            />

            <Stack.Screen
              name="FromTo"
              component={FromTo}
              title="From To Report"
            />

            <Stack.Screen
              name="MonthReport"
              component={MonthReport}
              title="Month Report"
            />

            <Stack.Screen
              name="YearReport"
              component={YearReport}
              title="Year Report"
            />

            <Stack.Screen
              name="Services"
              component={Services}
              title="Services"
            />

            <Stack.Screen
              name="ServiceView"
              component={ServiceView}
              title="Service View"
            />

            <Stack.Screen
              name="IncidentalReport"
              component={IncidentalReport}
              title="Incidental Report"
            />

            <Stack.Screen
              name="InventoryIn"
              component={InventoryIn}
              title="InventoryIn Report"
            />

            <Stack.Screen
              name="Aboutus"
              component={Aboutus}
              title="About us"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="SystemSetting"
              component={SystemSetting}
              title="System Setting"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen name="Debts" component={Debts} title="Debts" />

            <Stack.Screen
              name="Shopping"
              component={Shopping}
              title="Shopping"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Viewdebts"
              component={Viewdebts}
              title="Viewdebts"
              options={{
                headerShown: true,
              }}
            />

            <Stack.Screen
              name="Allemployees"
              component={Allemployees}
              title="Allemployees"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Getusers"
              component={Getusers}
              title="Get Users"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Getsalesbyuser"
              component={Getsalesbyuser}
              title="Get Sales by Users"
              options={{
                headerShown: true,
              }}
            />

            <Stack.Screen
              name="SetSPT"
              component={SetSPT}
              title="Set SPT"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="SetLanguage"
              component={SetLanguage}
              title="SetLanguage"
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },
});
