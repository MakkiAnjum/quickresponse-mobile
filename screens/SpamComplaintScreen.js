import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSpamList, removeSpam } from "../services/complaintService";
import Color from "../constants/Color";

const SpamComplaintScreen = props => {
  const [allComplaints, setAllComplaints] = useState([]);

  let Touch = TouchableOpacity;
  if (Platform.OS === "android") {
    Touch = TouchableWithoutFeedback;
  }

  useEffect(() => {
    getSpamComplaints();
  }, []);

  const getSpamComplaints = async () => {
    const { data } = await getSpamList();
    console.log("spam complaints", data);
    setAllComplaints(oldComplaints => [...oldComplaints, ...data]);
  };

  const handleRemoveSpam = async complaintId => {
    const response = await removeSpam(complaintId);
    Alert.alert(response.data);
    return props.navigation.navigate("Home");
  };

  const checkDate = complaint => {
    var date = new Date(complaint.timeStamp);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "April",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const day = date.getDate();

    return (
      <View
        style={{
          borderRightColor: "#e4e4e4",
          borderRightWidth: 1,
          marginRight: 3,
          paddingRight: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View>
          <Text style={{ fontWeight: "800", fontSize: 18 }}>{day}</Text>
        </View>
        <View>
          <Text
            style={{
              color: "#16a28f"
              //  paddingRight:10
            }}
          >
            {month}
          </Text>
        </View>
        <View>
          <Text style={{ color: "#16a28f" }}>{year}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView>
        {allComplaints.length != 0 ? (
          <View>
            {allComplaints.map(cmp => (
              <Touch
                key={cmp._id}
                onPress={() => {
                  props.navigation.navigate({
                    routeName: "ComplaintDetail",
                    params: {
                      complaintId: cmp._id,
                      currentUser: props.navigation.getParam("user")
                    }
                  });
                }}
              >
                <View style={styles.listItem}>
                  {checkDate(cmp)}
                  <View style={{ width: "80%", marginLeft: 10 }}>
                    <View>
                      <Text style={{ fontWeight: "600", fontSize: 18 }}>
                        {cmp.title}
                      </Text>
                    </View>
                    <View style={{ marginVertical: 5 }}>
                      <Text
                        style={{
                          fontWeight: "100",
                          fontSize: 14,
                          padding: 10,
                          backgroundColor: "#16a28f",
                          alignSelf: "flex-start",
                          borderRadius: 10,
                          color: "white"
                        }}
                      >
                        {cmp.status}
                      </Text>
                    </View>

                    <View>
                      {cmp.complainer && <Text>{cmp.complainer.name}</Text>}
                    </View>
                  </View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Ionicons
                      name="md-close"
                      size={28}
                      color={Color.accentColor}
                      onPress={() => handleRemoveSpam(cmp._id)}
                    />
                  </View>
                </View>
              </Touch>
            ))}
          </View>
        ) : (
          <View style={styles.spamText}>
            <Text style={{ fontSize: 24, color: "#000" }}>
              There are no Spam complaints
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

SpamComplaintScreen.navigationOptions = {
  headerTitle: "Spam Complaints"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F8F8"
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",

    padding: 30,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 4
  },
  title: {
    fontSize: 16,
    color: "#000"
  },
  spamText: {
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SpamComplaintScreen;
