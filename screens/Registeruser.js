import React, { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import theme from "../constants/themes";
import { useSelector} from "react-redux";

const Registeruser = ({ navigation }) => {
  const [webUrl, setWebUrl] = useState(
    useSelector((state) => state.userInfos.currentWebUrl)
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [Message, setMessage] = useState("");
  const [edit, setEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const add_user = async () => {
    setMessage("");
    setEdit(false);
    setIsLoading(true);

    const data = {
      username: username,
      email: email,
      password: password,
      company_name: "Igurire Shami Boutique",
      company_ID: 5,
      salepoint_id: 3,
      userType: 'Manager',
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(
        webUrl+"functions/user/insertuser.php",
        data,
        config
      )
      .then((response) => {
        //alert("Sign up success in system Please Login");
        navigation.navigate("Themechoose");

        setEdit(true);
        setIsLoading(false);
      })
      .catch((error) => {
        setMessage("Login failed please check username and password");
        setEdit(true);
        setIsLoading(false);
        setTimeout(() => {
          setMessage("");
          // Handle login success or failure here
        }, 3000);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.mangoTheme.bar} // Set the background color of the status bar
        barStyle="white" // Set the text color of the status bar to dark
        hidden={false} // Show the status bar
      />
      <Image style={styles.tinyLogo} source={require("../assets/icon.png")} />

      <TextInput
        placeholder="Username"
        value={username}
        style={styles.input}
        onChangeText={(text) => setUsername(text)}
        editable={edit}
      />
      <TextInput
        placeholder="Email"
        value={email}
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        editable={edit}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        editable={edit}
      />

      <TouchableOpacity onPress={add_user}>
        <LinearGradient colors={["#FF890A", "#FD1F26"]} style={styles.button}>
          <Text
            style={{
              color: "white",
              fontSize:16,
              fontWeight:"bold"
            }}
          >
            Signup
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color={theme.mangoTheme.secondary} />}
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
    backgroundColor: "#ff00a6",
    width: 300,
    alignItems: "center",
  },

  tinyLogo: {
    width: 130,
    height: 130,
    borderRadius: 10,
    marginBottom:55
  },
});

export default Registeruser;
