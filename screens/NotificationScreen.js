import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity
} from "react-native";
import { getAllNotifications } from "../services/messageService";
import authService from "../services/authService";
import config from "../config.json";
import openSocket from "socket.io-client";

const socket = openSocket(config.apiEndpoint);

class NotificationScreen extends Component {
  state = { notifications: [], user: "" };

  checkSocketConnection = async () => {
    try {
      const user = await authService.getCurrentUser();

      socket.on("msg", data => {
        // if (data.notification.companyId == user.companyId) {
        // if (data.msg.receiver === user._id || data.msg.sender === user._id) {
        // }
        // }
      });

      socket.on("complaints", data => {
        if (data.notification.companyId == user.companyId) {
          if (data.action === "new complaint") {
            if (
              user._id === data.complaint.assignedTo._id &&
              user.companyId == data.notification.companyId
            ) {
              this.setState(prevState => {
                const allNotifications = [...prevState.notifications];
                allNotifications.unshift(data.notification);
                return { notifications: allNotifications };
              });
            }
          }

          if (data.action === "feedback") {
            if (
              user._id === data.complaint.assignedTo._id &&
              user.companyId == data.notification.companyId
            ) {
              this.setState(prevState => {
                const allNotifications = [...prevState.notifications];
                allNotifications.unshift(data.notification);
                return { notifications: allNotifications };
              });
            }
          }

          if (data.action === "status changed") {
            if (
              user._id === data.complaint.assignedTo._id &&
              user.companyId == data.notification.companyId
            ) {
              this.setState(prevState => {
                const allNotifications = [...prevState.notifications];
                allNotifications.unshift(data.notification);
                return { notifications: allNotifications };
              });
            }
          }

          if (data.action === "drop") {
            if (
              (user._id !== data.complaint.assignedTo._id ||
                user._id !== data.complaint.complainer._id) &&
              user.companyId == data.notification.companyId
            ) {
              this.setState(prevState => {
                const allNotifications = [...prevState.notifications];
                allNotifications.unshift(data.notification);
                return { notifications: allNotifications };
              });
            }
          }

          if (data.action === "status changed") {
            if (
              user._id === data.complaint.complainer._id &&
              user.companyId == data.notification.companyId
            ) {
              this.setState(prevState => {
                const allNotifications = [...prevState.notifications];
                allNotifications.unshift(data.notification);
                return { notifications: allNotifications };
              });
            }
          }

          if (data.action === "task assigned") {
            if (
              user._id === data.complaint.assignedTo._id &&
              user.companyId == data.notification.companyId
            ) {
              this.setState(prevState => {
                const allNotifications = [...prevState.notifications];
                allNotifications.unshift(data.notification);
                return { notifications: allNotifications };
              });
            }
          }
        }
      });
    } catch (err) {
      console.log("Error -->", err);
    }
  };

  async componentDidMount() {
    this.checkSocketConnection();
    try {
      const user = await authService.getCurrentUser();
      if (user == null) return;
      const { data } = await getAllNotifications();
      console.log("notification", data.length);
      this.setState({ notifications: data, user: user });
    } catch (ex) {
      // console.log(ex.response);
      return Alert.alert("Something went wrong.");
    }
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
                {this.state.notifications.length > 0 ? (
                  <View>
                    {this.state.notifications.map(notification => (
                      <View key={notification._id}>
                        {this.state.user ? (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                              this.props.navigation.navigate({
                                routeName: "ComplaintDetail",
                                params: {
                                  complaintId: notification.complaintId,
                                  currentUser: this.state.user
                                }
                              });
                            }}
                          >
                            <View style={styles.listItem}>
                              <View style={{ width: "95%" }} onPres>
                                <Text
                                  style={{ fontSize: 16, fontWeight: "600" }}
                                >
                                  {notification.msg}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ) : null}
                      </View>
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
                      No Notifications
                    </Text>
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

NotificationScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Notifications"
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
    marginTop: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "#F8F8F8",
    elevation: 4
  },
  title: {
    fontSize: 16,
    color: "#000"
  }
});

export default NotificationScreen;
