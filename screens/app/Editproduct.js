import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
  Alert,
  Vibration,
} from "react-native";
import { useFonts } from "expo-font";
import {
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Fontisto,
  FontAwesome5,
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const Editproduct = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [datas, setDatas] = useState([]);

  const route = useRoute();
  const params = route.params;

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
  ];

  const PATTERN_DESC =
    Platform.OS === 'android'
      ? 'wait 1s, vibrate 2s, wait 3s'
      : 'wait 1s, vibrate, wait 2s, vibrate, wait 3s';

  return (
    <SafeAreaView style={styles.containerer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <StatusBar
            backgroundColor="#ff00a6" // Set the background color of the status bar
            barStyle="white" // Set the text color of the status bar to dark
            hidden={false} // Show the status bar
          />

          <View style={styles.header}></View>
          <Text style={styles.item}>Edit {"\n"}{params.name}</Text>

            

          <Text style={styles.title2}>
            Price:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "RWF",
            }).format(params.price)}{" "}
            Benefit:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "RWF",
            }).format(params.benefit)}
          </Text>
        </View>

        <View style={styles.fuc}>
          <TouchableOpacity style={styles.update}>
            <FontAwesome5
              name="edit"
              size={15}
              color="white"
              style={{
                marginRight: 10,
              }}
            />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.delete}
            onPress={() =>
              Alert.alert(`Alert Title`, `Are sure you want to delete  ${params.name} product ?`, [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "YES", onPress: () => {
                  alert("Deleted"); 
                  Vibration.vibrate();   
                }},
              ])
            }
          >
            <MaterialCommunityIcons
              name="delete-empty"
              size={20}
              color="white"
              style={{
                marginRight: 10,
              }}
            />
            <Text style={styles.btnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    marginTop: 0,
    width: "100%",
    height: "100%",
    flex: 1,
  },

  containerer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },

  header: {
    backgroundColor: "white",
    height: 60,
    width: "100%",
  },
  textTitle2: {
    fontFamily: "Regular",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    marginLeft: 5,
    color: "#a8006e",
  },
  item: {
    backgroundColor: "#a8006e",
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 5,
    width: "94%",
    height: 70,
    textAlign: "center",
    alignItems: "center",
    borderColor: "#a8006e",
    borderStyle: "solid",
    borderWidth: 2,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    flexDirection: "row",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  title2: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
    fontWeight: "900",
    width: "100%",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  fuc: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  update: {
    width: "45%",
    height: 50,
    backgroundColor: "#00960a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  delete: {
    width: "45%",
    height: 50,
    backgroundColor: "#b30000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "white",
  },
});

export default Editproduct;
