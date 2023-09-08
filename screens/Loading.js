import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";

import {
  setDataThemeSuccess,
  setDataUsernames,
  setDataUserType,
  setDataUserCompany,
  setDataCurrentCompanyID,
  setDataCurrentSPT,
  setDataUserID,
  setDataAccountUsername,
  setDataUserPhone,
  setDataSptLocation,
  setDataCompanyLogo,
  setDataCompanyColors,
  setUserLanguage
} from "../features/userinfo/userInfos";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { Center, NativeBaseProvider } from "native-base";
import * as Font from "expo-font";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";

export default Loading = ({ navigation }) => {
  const loadImg = require("../assets/go.jpeg");
  const image = require("../assets/go.jpeg");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [usernames, setusernames] = useState();
  const [userstatus, setuserstatus] = useState();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  // const [isLoggedIn, setIsLoggedIn] = useState();
  
  // const checkLoginStatus = async () => {
  //   const loggedInStatus = await AsyncStorage.getItem("isLoggedIn");
  //   setIsLoggedIn(loggedInStatus === "true");
  // };

  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      Regular: require("../assets/fonts/magneto.ttf"),
      Cocogoose: require("../assets/fonts/Cocogoose.ttf"),
    });
    setFontsLoaded(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {


        const company_lgo = await AsyncStorage.getItem("co_default_logo");
        dispatch(setDataCompanyLogo(company_lgo));

        const lang = await AsyncStorage.getItem("language");
        dispatch(setUserLanguage(lang));

        const company_dColor = await AsyncStorage.getItem("co_colors");
        dispatch(setDataCompanyColors(company_dColor));

        const spt_location = await AsyncStorage.getItem("mySpt_location");
        dispatch(setDataSptLocation(spt_location));


        const userTypeData = await AsyncStorage.getItem("userType");
        dispatch(setDataUserType(userTypeData));

        const usern = await AsyncStorage.getItem("username");
        dispatch(setDataAccountUsername(usern));

        const userphone = await AsyncStorage.getItem("phone");
        dispatch(setDataUserPhone(userphone));

        const usernms = await AsyncStorage.getItem("names");
        dispatch(setDataUsernames(usernms));
        setusernames(usernms);

        const usercompany = await AsyncStorage.getItem("co_name");
        dispatch(setDataUserCompany(usercompany));

        const spt = await AsyncStorage.getItem("salepoint_id");
        dispatch(setDataCurrentSPT(spt));

        const MyuserID = await AsyncStorage.getItem("user_id");
        dispatch(setDataUserID(MyuserID));

        const coid = await AsyncStorage.getItem("co_id");
        dispatch(setDataCurrentCompanyID(coid));

        const chooseData = await AsyncStorage.getItem("choose");
        dispatch(setDataThemeSuccess(JSON.parse(chooseData)));


      } catch (error) {
        console.log("Error retrieving data:", error);
      }
    };

    fetchData();
    loadFonts();

    if (isFocused) {
      fetchData();
    }
      setTimeout(() => {
        navigation.navigate("Home");
      }, 2000);

  }, [isFocused, navigation]);

  if (!fontsLoaded) {
    return (
      <NativeBaseProvider>
        <ImageBackground
          source={loadImg}
          resizeMode="cover"
          style={styles.image}
        >
          <Center flex={1} px="3">
            <ActivityIndicator size="large" color="#001935" />
            <Text
              style={{
                color: "#001935",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Loading...
            </Text>
          </Center>
        </ImageBackground>
      </NativeBaseProvider>
    );
  }
  return (
    <NativeBaseProvider>
      <ImageBackground source={loadImg} resizeMode="cover" style={styles.image}>
        <Center
          style={{
            width: "100%",
            height: "100%",
          }}
          px="3"
        >
          <View
            style={{
              width: "90%",
              height: "30%",
              backgroundColor: "#001935",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.8,
              borderWidth: 1,
              borderColor: "#00378f",
              borderStyle: "solid",
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
            <TouchableOpacity
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("Home")}
            >
              <LinearGradient
                colors={["#E6A900", "#002163"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                angle={-40}
                style={{
                  width: "85%",
                  height: 50,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "white",
                  borderStyle: "solid",
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  opacity: 0.8,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "900",
                    fontFamily: "Poppins-Bold",
                    fontSize: 20,
                  }}
                >
                  Continue
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text
              style={{
                color: "white",
                fontFamily: "Poppins-Regular",
                fontSize: 12,
                marginTop: 20,
              }}
            >
              <Text
              style={{
                color: "white",
                fontWeight: "900",
                fontFamily: "Poppins-Bold",
                fontSize: 20,
                marginTop: 20,
              }}
            >As</Text> {usernames}
            </Text>
          </View>
        </Center>
      </ImageBackground>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
