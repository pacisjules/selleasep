import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Entry from "./app/Entry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Swiper from 'react-native-swiper';

import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Entypo,
  FontAwesome5
} from "@expo/vector-icons";

import { AntDesign } from '@expo/vector-icons'; 
import * as Font from "expo-font";
import { useSelector, useDispatch } from "react-redux";
import i18next, {languageResources} from '..';
import {useTranslation} from 'react-i18next';


function CustomDrawerContent({ navigation }) {
  const [user, setUser] = useState(AsyncStorage.getItem("username"));
  const [company, setCompany] = useState(AsyncStorage.getItem("co_name"));

  const [usertype, setusertype] = useState(
    useSelector((state) => state.userInfos.currentUserType)
  );


  const [C_logo, setC_logo] = useState(
    useSelector((state) => state.userInfos.Companylogo)
  );



  const {t} = useTranslation();
  const changeLng = lng => {
    i18next.changeLanguage(lng);
    setVisible(false);
  };
  const username = user._j;
  //const uppercaseText = username.toUpperCase();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      magneto: require("../assets/fonts/magneto.ttf"),
      Cocogoose: require("../assets/fonts/Cocogoose.ttf"),

      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    });

    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <Image
      source={require("../assets/go.jpeg")}
        style={{ width: "100%", height: 300 }}
      />
    );
  }

  return (
    <View style={{ flex: 1, marginBottom:50 }}>
      <Swiper autoplay={true} autoplayTimeout={3000}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: C_logo }}
            style={{ width: "100%", height: 200 }}
            resizeMode="cover"
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "100%", height: 200 }}
            source={require("../assets/go.jpeg")}
            resizeMode="cover"
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "100%", height: 200 }}
            source={require("../assets/sellbg.jpg")}
            resizeMode="cover"
          />
        </View>
      </Swiper>

      {/* <Image
        source={{uri:C_logo,}}
        style={{ width: "100%", height: 300 }}
      /> */}

      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        onPress={() => navigation.navigate("Entry")}
      >
        <Image
          source={{ uri: C_logo }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        <Text style={{ fontSize: 10, fontFamily: "Poppins-SemiBold" }}>
        {`${t('user')}: ${username}\n${t('shop')}: ${company._j}`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Inventory")}
      >
        <MaterialIcons name="inventory" size={20} color="#00074a" />
        <Text
          style={{
            fontSize: 11,
            marginLeft: 15,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          {t('my-inventory')}
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Customer")}
      >
        <AntDesign name="team" size={20} color="#00074a" />
        <Text
          style={{
            fontSize: 11,
            marginLeft: 15,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          {t('customer')}
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Entry")}
      >
        <Ionicons name="restaurant-sharp" size={20} color="#e84105" />
        <Text
          style={{
            fontSize: 11,
            marginLeft: 15,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          My Restaurant
        </Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Aboutus")}
      >
        <Entypo name="info-with-circle" size={20} color="#00074a" />
        <Text
          style={{
            fontSize: 11,
            marginLeft: 15,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          {t('about-us')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Themechooseb")}
      >
        <Ionicons name="color-palette" size={20} color="#00074a" />
        <Text
          style={{
            fontSize: 11,
            marginLeft: 15,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          {t('themes')}
        </Text>
      </TouchableOpacity>

      {usertype == "BOSS" ? (
        <TouchableOpacity
          style={{
            width: "100%",
            padding: 10,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("SystemSetting")}
        >
          <Ionicons name="settings" size={20} color="#00074a" />
          <Text
            style={{
              fontSize: 11,
              marginLeft: 15,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            {t('settings')}
          </Text>
        </TouchableOpacity>
      ) : (
        ""
      )}

      {usertype == "BOSS" ? (
        <TouchableOpacity
          style={{
            width: "100%",
            padding: 10,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Allemployees")}
        >
          <FontAwesome5 name="user-friends" size={20} color="#00074a" />
          <Text
            style={{
              fontSize: 11,
              marginLeft: 15,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            {t('users')}
          </Text>
        </TouchableOpacity>
      ) : (
        ""
      )}

      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("LoginScreen");
          AsyncStorage.removeItem("user_id");
          AsyncStorage.setItem("isLoggedIn", "false");
          AsyncStorage.removeItem("co_id");
          AsyncStorage.removeItem("salepoint_id");
        }}
      >
        <FontAwesome name="sign-out" size={20} color="#fc7e00" />
        <Text
          style={{
            fontSize: 11,
            marginLeft: 15,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          {t('sign-out')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Article() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Article Screen</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Feed"
        component={Entry}
        options={{
          title: " Sales",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#ff00a6",
          },
          headerTitleStyle: {
            color: "white",
            fontSize: 11,
          },
        }}
      />

      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
  );
}

function HomeScreen() {
  return <MyDrawer />;
}

export default HomeScreen;
