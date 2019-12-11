import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Platform,
  ScrollView
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import Color from "../constants/Color";
import openSocket from "socket.io-client";
import config from "../config.json";

const socket = openSocket(config.apiEndpoint);

const ComplaintScreen = props => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let Touch = TouchableOpacity;
  if (Platform.OS === "android") {
    Touch = TouchableWithoutFeedback;
  }

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

  useEffect(() => {
    setIsLoading(true);
    const allcomplaints = props.navigation.getParam("complaints");
    const reversed = allcomplaints.reverse();
    console.log(reversed);
    setComplaints(oldComplaints => [...oldComplaints, ...reversed]);
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView onScrollEndDrag={() => console.log("i am ended")}>
        {isLoading && complaints.length != 0 && (
          <ActivityIndicator color={Color.primaryColor} />
        )}
        {complaints.length != 0 ? (
          <View>
            {complaints.map(cmp => (
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
                  <View style={{ width: "85%", marginLeft: 10 }}>
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
                          overflow: "hidden",
                          color: "white"
                        }}
                      >
                        {cmp.status}
                      </Text>
                    </View>
                    {props.navigation.getParam("user").role === "assignee" && (
                      <View>
                        {cmp.complainer && <Text>{cmp.complainer.name}</Text>}
                      </View>
                    )}
                    {props.navigation.getParam("user").role ===
                      "complainer" && (
                      <View>
                        <View>
                          {cmp.assignedTo == null ? (
                            <Text>
                              <Text style={{ fontWeight: "600" }}>
                                Assigned To {"  "}
                              </Text>
                              Admin
                            </Text>
                          ) : (
                            <Text>
                              <Text style={{ fontWeight: "600" }}>
                                Assigned To {"  "}
                              </Text>
                              {cmp.assignedTo.name}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                    {props.navigation.getParam("user").role === "admin" && (
                      <View>
                        <View>
                          {cmp.complainer && (
                            <Text>
                              <Text style={{ fontWeight: "600" }}>
                                Complainer{"  "}
                              </Text>
                              {cmp.complainer.name}
                            </Text>
                          )}
                        </View>
                        <View>
                          {cmp.assignedTo == null ? (
                            <Text>
                              <Text style={{ fontWeight: "600" }}>
                                Assigned To {"  "}
                              </Text>
                              Admin
                            </Text>
                          ) : (
                            <Text>
                              <Text style={{ fontWeight: "600" }}>
                                Assigned To {"  "}
                              </Text>
                              {cmp.assignedTo.name}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>

                  <Ionicons
                    name="ios-arrow-forward"
                    size={30}
                    color="black"
                    onPress={() => {
                      props.navigation.navigate({
                        routeName: "ComplaintDetail",
                        params: {
                          complaintId: cmp._id,
                          currentUser: props.navigation.getParam("user")
                        }
                      });
                    }}
                  />
                </View>
              </Touch>
            ))}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 30
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              There are no Complaints
            </Text>
          </View>
        )}
        <View>
          <AntDesign
            name="reload1"
            size={22}
            color={Color.primaryColor}
            onPress={() => console.log("i am pressed")}
          />
        </View>
      </ScrollView>
      {/* {renderFloatingButton()} */}
    </View>
  );
};

ComplaintScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Complaints",
    headerRight: (
      <View>
        {navData.navigation.getParam("user").role == "assignee" && (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Spam"
              iconName={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              onPress={() => {
                navData.navigation.navigate({
                  routeName: "Spam",
                  params: { user: navData.navigation.getParam("user") }
                });
              }}
            />
          </HeaderButtons>
        )}
      </View>
    )
  };
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
    // marginLeft: 16,
    // marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 4
  },
  title: {
    fontSize: 16,
    color: "#000"
  }
});

export default ComplaintScreen;

// <FlatList
//   data={complaints}
//   renderItem={itemData => (
//     <View>
//       {itemData.item.value.map(a => (
//         <TouchableOpacity
//           style={styles.listItem}
//           key={a._id}
//           onPress={() => {
//             props.navigation.navigate({
//               routeName: "ComplaintDetail",
//               params: {
//                 complaintId: a._id
//               }
//             });
//           }}
//         >
//           <ListItem
//             key={a._id}
//             title={a.title}
//             subtitle={a.title}
//           ></ListItem>
//         </TouchableOpacity>
//       ))}
//     </View>
//   )}
// />
