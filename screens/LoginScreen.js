import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import theme from "../constants/themes";
import { useSelector } from "react-redux";
const LoginScreen = ({ navigation }) => {
  const [webUrl, setWebUrl] = useState(
    useSelector((state) => state.userInfos.currentWebUrl)
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Message, setMessage] = useState("");
  const [edit, setEdit] = useState(true);
  const [isLoading, setIsLoading] = useState();

  const handleLogin = async () => {
    setMessage("");
    setEdit(false);
    setIsLoading(true);
    const data = {
      username: email,
      password: password,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(webUrl + "functions/user/userlogin.php", data, config)
      .then(async (response) => {
        if (response.data.status === "0") {
          alert("You are not allowed to use system Please ask administrator");
          setEdit(true);
          setIsLoading(false);
        } else {
          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("language", 'en');
          await AsyncStorage.setItem("email", response.data.email);
          await AsyncStorage.setItem("user_id", response.data.id);

          await AsyncStorage.setItem("co_name", response.data.company_name);
          await AsyncStorage.setItem("username", response.data.username);
          await AsyncStorage.setItem("names", response.data.names);
          await AsyncStorage.setItem("phone", response.data.phone);

          await AsyncStorage.setItem("co_id", response.data.company_ID);

          await AsyncStorage.setItem("co_colors", response.data.default_color);

          await AsyncStorage.setItem("status", response.data.status);

          await AsyncStorage.setItem(
            "co_default_logo",
            response.data.company_logo
          );

          await AsyncStorage.setItem(
            "salepoint_id",
            response.data.salepoint_id
          );
          await AsyncStorage.setItem(
            "mySpt_location",
            response.data.salepoint_location
          );

          await AsyncStorage.setItem("userType", response.data.userType);

          const jsonData = JSON.stringify({
            bar: response.data.theme_bar,
            light: response.data.theme_ligth,
            normal: response.data.theme_normal,
            primary: response.data.theme_primary,
            secondary: response.data.theme_secondary,
          });

          await AsyncStorage.setItem("choose", jsonData);

          setEdit(true);
          setIsLoading(false);
          //console.log(response.data);
          navigation.navigate("Loading");
        }
      })
      .catch((error) => {
        setMessage("Login failed please check username and password");
        setEdit(true);
        setIsLoading(false);

        // setTimeout(() => {
        //   setMessage("");
        // }, 3000);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.mangoTheme.bar} // Set the background color of the status bar
        barStyle={theme.white} // Set the text color of the status bar to dark
        hidden={false} // Show the status bar
      />
      <Image style={styles.tinyLogo} source={require("../assets/icon.png")} />

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setEmail}
        value={email}
        editable={edit}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
        editable={edit}
      />

      <TouchableOpacity onPress={handleLogin}>
        <LinearGradient colors={["#FF890A", "#FD1F26"]} style={styles.button}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text
        style={{
          color: "red",
          fontSize: 10,
        }}
      >
        {Message}
      </Text>
      {isLoading && <ActivityIndicator size="large" color="orange" />}
      <Text
        style={{
          color: "black",
          fontSize: 10,
          marginTop: 20,
          textAlign: "center",
        }}
      >
        If you don't have account Click {"\n"}{" "}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text
            style={{
              color: "orange",
              fontWeight: "bold",
              marginTop: 10,
              fontSize: 16,
            }}
          >
            Register here
          </Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 2,
    padding: 12,
    marginTop: 15,
    borderRadius: 5,
  },

  button: {
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    backgroundColor: theme.mangoTheme.secondary,
    width: 300,
    alignItems: "center",
  },

  tinyLogo: {
    width: 130,
    height: 130,
    borderRadius: 10,
    marginBottom: 55,
  },
});

export default LoginScreen;
