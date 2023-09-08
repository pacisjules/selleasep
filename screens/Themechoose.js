import React, { useState, useEffect } from "react";
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
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../constants/themes";

const Themechoose = ({ navigation }) => {
  const [choose, setChoose] = useState(null);

  //   const setTheme =()=>{
  //     AsyncStorage.setItem("userTheme", choose);
  //     // navigation.navigate("LoginScreen");
  //   }

  useEffect(() => {
    // Load the saved theme from local storage on app startup
    //loadTheme();
  }, []);

  useEffect(() => {
    // Save the selected theme to local storage whenever it changes
    saveTheme();
  }, [choose]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("choose");
      if (savedTheme) {
        setChoose(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.log("Error loading theme:", error);
    }
  };

  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem("choose", choose);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const handleThemeSelection = (theme) => {
    AsyncStorage.removeItem("choose")
    const jsonData = JSON.stringify(theme);
    setChoose(jsonData);
    Alert.alert("Save theme", `Are you sure to save this theme ?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.mangoTheme.bar} // Set the background color of the status bar
        barStyle="white" // Set the text color of the status bar to dark
        hidden={false} // Show the status bar
      />

      <TouchableOpacity
        onPress={() =>
          handleThemeSelection({
            bar: "#00376E",
            light: "#94D4FF",
            normal: "#00C2FF",
            primary: "#007BA2",
            secondary: "#00376E",
          })
        }
      >
        <View
          style={{
            width: "80%",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            borderColor: "#00CBFF",
            borderStyle: "solid",
            borderWidth: 3,
            padding: 5,
            marginBottom: 20,
          }}
        >
          <LinearGradient
            colors={["#00C2FF", "#0044FF"]}
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
            }}
          ></LinearGradient>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Ocean Theme
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.oceanTheme.light,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.oceanTheme.normal,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.oceanTheme.primary,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.oceanTheme.secondary,
                    borderRadius: 10,
                  }}
                ></View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          handleThemeSelection({
            bar: "#076E00",
            light: "#D6FFD4",
            normal: "#64CC45",
            primary: "#009705",
            secondary: "#076E00",
          })
        }
      >
        <View
          style={{
            width: "80%",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            borderColor: "#00920A",
            borderStyle: "solid",
            borderWidth: 3,
            padding: 5,
            marginBottom: 20,
          }}
        >
          <LinearGradient
            colors={["#07CE00", "#00AC29"]}
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
            }}
          ></LinearGradient>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Forest Theme
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.forestTheme.light,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.forestTheme.normal,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.forestTheme.primary,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.forestTheme.secondary,
                    borderRadius: 10,
                  }}
                ></View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          handleThemeSelection({
            bar: "#001935",
            light: "#FF9F0A",
            normal: "#F15A24",
            primary: "#ED1C24",
            secondary: "#001935",
          })
        }
      >
        <View
          style={{
            width: "80%",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            borderColor: "#001935",
            borderStyle: "solid",
            borderWidth: 3,
            padding: 5,
            marginBottom: 20,
          }}
        >
          <LinearGradient
            colors={["#001935", "#FF9100"]}
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
            }}
          ></LinearGradient>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Dark Theme
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.darkTheme.light,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.darkTheme.normal,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.darkTheme.primary,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.darkTheme.secondary,
                    borderRadius: 10,
                  }}
                ></View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          handleThemeSelection({
            bar: "#8A0077",
            light: "#FFF2FB",
            normal: "#FF00CC",
            primary: "#C900B6",
            secondary: "#8A0077",
          })
        }
      >
        <View
          style={{
            width: "80%",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            borderColor: theme.roseTheme.secondary,
            borderStyle: "solid",
            borderWidth: 3,
            padding: 5,
            marginBottom: 20,
          }}
        >
          <LinearGradient
            colors={[theme.roseTheme.secondary, theme.roseTheme.normal]}
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
            }}
          ></LinearGradient>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Rose Theme
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.roseTheme.light,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.roseTheme.normal,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.roseTheme.primary,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.roseTheme.secondary,
                    borderRadius: 10,
                  }}
                ></View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          handleThemeSelection({
            bar: "#8A2A00",
            light: "#FFEFCE",
            normal: "#C97F00",
            primary: "#C97F00",
            secondary: "#8A2A00",
          })
        }
      >
        <View
          style={{
            width: "80%",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            borderColor: theme.mangoTheme.secondary,
            borderStyle: "solid",
            borderWidth: 3,
            padding: 5,
            marginBottom: 20,
          }}
        >
          <LinearGradient
            colors={[theme.mangoTheme.secondary, theme.mangoTheme.normal]}
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
            }}
          ></LinearGradient>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Mango Theme
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.mangoTheme.light,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.mangoTheme.normal,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.mangoTheme.primary,
                    borderRadius: 10,
                  }}
                ></View>

                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: theme.mangoTheme.secondary,
                    borderRadius: 10,
                  }}
                ></View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={setTheme}>
        <LinearGradient colors={["#FF890A", "#FD1F26"]} style={styles.button}>
          <Text
            style={{
              color: "white",
              fontSize:16,
              fontWeight:"bold"
            }}
          >
            Finish
          </Text>
        </LinearGradient>
      </TouchableOpacity> */}
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
    marginBottom: 55,
  },
});

export default Themechoose;
