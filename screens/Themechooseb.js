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
import { setDataThemeSuccess } from "../features/userinfo/userInfos";
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  Modal,
  FormControl,
  Input,
  Center,
  NativeBaseProvider,
  AlertDialog,
  useToast,
  TextArea,
  Switch,
} from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../constants/themes";
import * as Font from "expo-font";
import { useSelector, useDispatch } from "react-redux";
const Themechooseb = ({ navigation }) => {
  const dispatch = useDispatch();
  const [choose, setChoose] = useState(null);
  const [currenttheme, setcurrenttheme] = useState(
    useSelector((state) => state.userInfos.current_theme)
  );

  const [currentthemes, setcurrentthemes] = useState(
    useSelector((state) => state.userInfos.current_theme)
  );


  const [currentCompanyname, setcurrentCompanyname] = useState(
    useSelector((state) => state.userInfos.currentUserCompany)
  );


  const [currentCompanytheme, setcurrentCompanytheme] = useState(
    useSelector((state) => state.userInfos.current_theme)
  );

  //   const setTheme =()=>{
  //     AsyncStorage.setItem("userTheme", choose);
  //     // navigation.navigate("LoginScreen");
  //   }

  //Load fonts
  async function loadFonts() {
    await Font.loadAsync({
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    });

    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
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
    AsyncStorage.removeItem("choose");
    const jsonData = JSON.stringify(theme);
    setChoose(jsonData);
    Alert.alert("Save theme", `Are you sure to save this theme ?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => navigation.navigate("Loading") },
    ]);
  };

  return (
    <View style={styles.container}>
      <NativeBaseProvider>
      <View
        style={{
          height: 65,
          width: "100%",
          marginTop:-1,
        }}
      >
        <LinearGradient
          colors={[currenttheme.secondary, currenttheme.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          angle={-45}
          style={{
            height: 65,
            backgroundColor: "blue",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 45,
            borderBottomRightRadius: 45,
            justifyContent: "flex-start",
            alignContent: "center",
            flexDirection: "row",
            paddingTop: 10,
            paddingLeft: 20,
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
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <Ionicons name="caret-back" size={35} color="white" />
          </TouchableOpacity>

          <Text
            style={{
              textAlign: "left",
              fontSize: 23,
              color: "white",
              marginLeft: 75,
              fontFamily: "Poppins-Bold",
            }}
          >
            Set Theme
          </Text>
        </LinearGradient>
      </View>

      <StatusBar
        backgroundColor={currenttheme.bar} // Set the background color of the status bar
        barStyle="white" // Set the text color of the status bar to dark
        hidden={false} // Show the status bar
      />

<ScrollView
          style={{
            backgroundColor: "#f5f5f5",
            width: "100%",
            height: "100%",
          }}
        >
      <Center px="3" style={{
        marginTop:30
      }}>





        <TouchableOpacity
          onPress={() =>
            handleThemeSelection({
              bar: currentCompanytheme.bar,
              light: currentCompanytheme.light,
              normal: currentCompanytheme.normal,
              primary: currentCompanytheme.primary,
              secondary: currentCompanytheme.secondary,
            })
          }
        >
          <View
            style={{
              width: 300,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",

              borderColor: currentCompanytheme.secondary,
              borderStyle: "solid",
              borderWidth: 3,
              padding: 5,
              marginBottom: 20,
            }}
          >
            <LinearGradient
              colors={[currentCompanytheme.primary, currentCompanytheme.normal]}
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
                    fontSize: 12,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  {currentCompanyname} Theme
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
                      backgroundColor: currentCompanytheme.light,
                      borderRadius: 10,
                    }}
                  ></View>

                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: currentCompanytheme.normal,
                      borderRadius: 10,
                    }}
                  ></View>

                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: currentCompanytheme.primary,
                      borderRadius: 10,
                    }}
                  ></View>

                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: currentCompanytheme.secondary,
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
              bar: "#00376E",
              light: "#d4eeff",
              normal: "#00C2FF",
              primary: "#007BA2",
              secondary: "#00376E",
            })
          }
        >
          <View
            style={{
              width: 300,
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
              light: "#e4ffe3",
              normal: "#64CC45",
              primary: "#009705",
              secondary: "#076E00",
            })
          }
        >
          <View
            style={{
              width: 300,
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
              light: "#ffdfc4",
              normal: "#F15A24",
              primary: "#ED1C24",
              secondary: "#001935",
            })
          }
        >
          <View
            style={{
              width: 300,
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
              width: 300,
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
              width: 300,
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
      </Center>
      </ScrollView>
      </NativeBaseProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    marginTop: StatusBar.currentHeight || 0,
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

export default Themechooseb;
