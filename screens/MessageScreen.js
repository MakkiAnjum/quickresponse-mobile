import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import uuid from "uuid/v3";
import { getCurrentUser } from "../services/authService";
import {
  getComplaints,
  getAssigneeComplaints,
  getAdminComplaints,
  getAdminAssignedComplaints
} from "../services/complaintService";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";
import { getConfiguration } from "../services/configService";
import Color from "../constants/Color";

class MessageScreen extends Component {
  state = { receivers: [], user: "", configToken: "", isLoading: false };
  willFocusSub = "";

  Touch = "";

  getComplaintsandReceivers = async () => {
    this.setState({ isLoading: true });
    try {
      const user = await getCurrentUser();
      const { data } = await getConfiguration(user.companyId);
      this.setState({ user, configToken: data });
      if (!data.isMessaging) {
        return;
      }
      let arr = [];
      if (user.role === "complainer") {
        const { data: complaints } = await getComplaints();
        for (let i = 0; i < complaints.length; i++) {
          if (complaints[i].assignedTo) {
            arr.push(complaints[i].assignedTo);
          }
        }
        const uniqueAssignees = _.unionBy(arr, function(o) {
          return o._id;
        });

        this.setState({ receivers: uniqueAssignees });
      } else if (user.role === "assignee") {
        const { data: complaints } = await getAssigneeComplaints();

        for (let i = 0; i < complaints.length; i++) {
          arr.push(complaints[i].complainer);
        }

        const uniqueComplainers = _.unionBy(arr, function(o) {
          return o._id;
        });

        this.setState({ receivers: uniqueComplainers });
      } else if (user.role === "admin") {
        const { data: complaints } = await getAdminAssignedComplaints();
        for (let i = 0; i < complaints.length; i++) {
          arr.push(complaints[i].complainer);
        }

        const uniqueComplainers = _.unionBy(arr, function(o) {
          return o._id;
        });

        this.setState({ receivers: uniqueComplainers });
      }
    } catch (err) {
      return;
    }

    this.setState({ isLoading: false });
  };

  async componentDidMount() {
    this.Touch = TouchableOpacity;
    if (Platform.OS === "android") {
      this.Touch = TouchableWithoutFeedback;
    }

    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      this.getComplaintsandReceivers
    );
    this.getComplaintsandReceivers();
  }

  componentWillUnmount() {
    this.willFocusSub.remove();
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            {!this.state.user ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 30
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                  Please Authenticate youself
                </Text>
              </View>
            ) : (
              <View>
                {this.state.isLoading && this.state.configToken.isMessaging ? (
                  <ActivityIndicator color={Color.primaryColor} />
                ) : null}
                {!this.state.configToken.isMessaging ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: 30
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "600" }}>
                      Messaging Feature is not enabled
                    </Text>
                  </View>
                ) : (
                  <View>
                    {this.state.receivers.length > 0 ? (
                      <View>
                        {this.state.receivers.map(receiver => (
                          <this.Touch
                            key={receiver._id}
                            onPress={() => {
                              this.props.navigation.navigate({
                                routeName: "Chat",
                                params: {
                                  currentUser: this.state.user,
                                  receiverId: receiver._id
                                }
                              });
                            }}
                          >
                            <View style={styles.listItem}>
                              <View style={{ width: "95%" }}>
                                <Text
                                  style={{ fontSize: 16, fontWeight: "500" }}
                                >
                                  {receiver.name}
                                </Text>
                              </View>
                              {this.state.user && (
                                <Ionicons
                                  name="ios-arrow-forward"
                                  size={30}
                                  color="black"
                                  onPress={() => {
                                    this.props.navigation.navigate({
                                      routeName: "Chat",
                                      params: {
                                        currentUser: this.state.user,
                                        receiverId: receiver._id
                                      }
                                    });
                                  }}
                                />
                              )}
                            </View>
                          </this.Touch>
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
                          No Conversations
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

MessageScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Conversations"
    // headerLeft: (
    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item
    //       title="Menu"
    //       iconName="ios-menu"
    //       onPress={() => {
    //         navData.navigation.toggleDrawer();
    //       }}
    //     />
    //   </HeaderButtons>
    // )
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
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
  },
  title: {
    fontSize: 16,
    color: "#000"
  }
});

export default MessageScreen;
