import React from "react";
// import Toast from "react-native-simple-toast";
import * as WebBrowser from "expo-web-browser";
import uuid from "uuid/v1";
import {
  Alert,
  View,
  Platform,
  Text,
  ScrollView,
  StyleSheet,
  Picker,
  Button,
  ActivityIndicator
} from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  Entypo
} from "@expo/vector-icons";
import { Input } from "react-native-elements";
import MainButton from "../components/MainButton";
import Color from "../constants/Color";
import {
  getComplaint,
  changeStatus,
  dropResponsibility,
  markSpam,
  reOpen
} from "../services/complaintService";
import { getCurrentUser } from "../services/authService";
import Card from "../components/common/Card";
import { getConfiguration } from "../services/configService";
import config from "../config.json";
import ConfirmDialog from "../components/ConfirmDialog";

class ComplaintDetailScreen extends React.Component {
  state = {
    complaint: "",
    isChangeStatus: false,
    statusValue: "",
    remarks: "",
    user: "",
    date: "",
    isLoading: false,
    configToken: "",
    isDropConfirmation: false,
    isSpamConfirmation: false,
    isReopenConfirmation: false
  };

  willFocusSub = "";

  async componentDidMount() {
    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      this.fetchComplaint
    );
    this.fetchComplaint();
  }

  componentWillUnmount() {
    this.willFocusSub.remove();
  }

  _handleFileView = async () => {
    await WebBrowser.openBrowserAsync(
      config.apiEndpoint +
        "/api/complainer-complaints/view/image/" +
        this.state.complaint._id
    );
  };

  _handleViewMap = async geolocation => {
    await WebBrowser.openBrowserAsync(
      `https://www.google.com/maps/@${geolocation.lat},${geolocation.lng},15z`
    );
  };

  _handleFileDownload = async () => {
    await WebBrowser.openBrowserAsync(
      config.apiEndpoint +
        "/api/complainer-complaints/download/image/" +
        this.state.complaint._id
    );
  };

  checkDate = complaint => {
    var date = new Date(complaint.timeStamp);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const day = date.getDate();
    const fullDate = `${month} ${day}, ${year}`;
    this.setState({ date: fullDate });
  };

  fetchComplaint = async () => {
    this.setState({ isLoading: true });
    try {
      const user = await getCurrentUser();

      this.setState({ user: user });
      const { data: config } = await getConfiguration(user.companyId);
      this.setState({ configToken: config });
      const complaintId = this.props.navigation.getParam("complaintId");
      const { data: complaint } = await getComplaint(complaintId);
      console.log("complaint detail", complaint);
      this.checkDate(complaint);
      this.setState({ complaint: complaint });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        Alert.alert("Complaint not found");
      }
    }

    this.setState({ isLoading: false });
  };

  // save status
  saveStatus = async complaint => {
    const { statusValue, remarks } = this.state;
    if (!this.state.remarks) {
      return Alert.alert("Please Give Remarks");
    }
    if (this.state.remarks.length < 20) {
      return Alert.alert("Remarks length should be atleast 20.");
    }

    this.setState({ isLoading: true });
    try {
      const { data: newcomplaint } = await changeStatus(
        complaint._id,
        statusValue,
        remarks
      );
      this.setState({
        remarks: "",
        isChangeStatus: false,
        complaint: newcomplaint
      });
    } catch (ex) {
      console.log(ex);
    }

    this.setState({ isLoading: false });
  };

  // dropResponsibility
  drop = async () => {
    this.setState({ isDropConfirmation: false });
    try {
      await dropResponsibility(complaint._id);
      return this.props.navigation.navigate("Home");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        return Alert.alert("Complaint is already closed.");
        // return this.props.navigation.navigate("Home");
      }
    }
  };

  handleSpam = () => {
    this.setState({ isSpamConfirmation: true });
  };

  handleDrop = () => {
    this.setState({ isDropConfirmation: true });
  };

  // mark spam
  spam = async () => {
    this.setState({ isSpamConfirmation: false });
    try {
      await markSpam(this.state.complaint._id, true);
      Alert.alert("Complaint is successfullt signed as spam.");
      return this.props.navigation.navigate({ routeName: "Home" });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        return Alert.alert("Complaint is already closed.");
        // return this.props.navigation.navigate("Complaints");
      }
    }
  };

  handleReopenDialog = () => {
    this.setState({ isReopenConfirmation: true });
  };

  // handleReOpen
  handleReOpen = async complaintId => {
    this.setState({ isReopenConfirmation: false, isLoading: true });

    try {
      const { data: complaint } = await reOpen(complaintId);
      this.setState({ complaint });

      // Toast.show("Complaint is successfully re-opened.", Toast.LONG);
    } catch (ex) {
      // Toast.show("Could not reopen the complaint.", Toast.LONG);
    }
    this.setState({ isLoading: false });
  };

  render() {
    const {
      complaint,
      configToken,
      date,
      isChangeStatus,
      isLoading,
      remarks,
      statusValue,
      user,
      isDropConfirmation,
      isSpamConfirmation,
      isReopenConfirmation
    } = this.state;

    return (
      <View style={styles.screen}>
        <ScrollView>
          {isSpamConfirmation ? (
            <ConfirmDialog
              visible={isSpamConfirmation}
              onCancelPress={() => this.setState({ isSpamConfirmation: false })}
              onConfirmPress={this.spam}
            >
              It will remove complaint from Complaints list and add in Spam List
            </ConfirmDialog>
          ) : null}
          {isDropConfirmation ? (
            <ConfirmDialog
              visible={isDropConfirmation}
              onCancelPress={() => this.setState({ isDropConfirmation: false })}
              onConfirmPress={this.drop}
            />
          ) : null}
          <Card title="Complaint Detail" style={styles.cardContainer}>
            <View>
              {isLoading ? (
                <ActivityIndicator color={Color.primaryColor} />
              ) : (
                <View>
                  {complaint ? (
                    <View>
                      {isReopenConfirmation ? (
                        <ConfirmDialog
                          visible={isReopenConfirmation}
                          onCancelPress={() =>
                            this.setState({ isReopenConfirmation: false })
                          }
                          onConfirmPress={() =>
                            this.handleReOpen(complaint._id)
                          }
                        />
                      ) : null}
                      <Card style={styles.cardContainer2}>
                        <View>
                          <Text style={{ ...styles.label, color: "white" }}>
                            Title
                          </Text>
                          <Text style={{ color: "white" }}>
                            {complaint.title}
                          </Text>

                          <Text style={{ ...styles.label, color: "white" }}>
                            Registered Date
                          </Text>
                          <Text style={{ color: "white" }}>{date}</Text>
                        </View>
                      </Card>

                      <View style={styles.container}>
                        <View>
                          <Text style={styles.label}>Status</Text>
                        </View>
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between"
                            }}
                          >
                            {!isChangeStatus ? (
                              <Text>{complaint.status}</Text>
                            ) : (
                              <View style={{ width: "80%" }}>
                                <Picker
                                  selectedValue={statusValue}
                                  mode="dropdown"
                                  // style={{ height: 50, width: 100 }}
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ statusValue: itemValue })
                                  }
                                >
                                  <Picker.Item
                                    label="in-progress"
                                    value="in-progress"
                                  />
                                  <Picker.Item
                                    label="closed - relief granted"
                                    value="closed - relief granted"
                                  />
                                  <Picker.Item
                                    label="closed - partial relief granted"
                                    value="closed - partial relief granted"
                                  />
                                  <Picker.Item
                                    label="closed - relief can't be granted"
                                    value="closed - relief can't be granted"
                                  />
                                </Picker>
                                <Input
                                  style={{ marginBottom: 10 }}
                                  placeholder="Remarks"
                                  value={remarks}
                                  onChangeText={text =>
                                    this.setState({ remarks: text })
                                  }
                                />
                                <View style={{ marginVertical: 5 }}>
                                  <MainButton
                                    buttonContainer={{
                                      backgroundColor: Color.primaryColor
                                    }}
                                    onPress={() => this.saveStatus(complaint)}
                                  >
                                    Save
                                  </MainButton>
                                </View>
                              </View>
                            )}
                            {user.role === "assignee" && (
                              <MaterialCommunityIcons
                                name="pencil"
                                size={24}
                                color="black"
                                onPress={() =>
                                  this.setState({
                                    isChangeStatus: !isChangeStatus
                                  })
                                }
                              />
                            )}
                          </View>
                        </View>
                      </View>

                      <View>
                        {/* remarks */}

                        {/* remarks */}

                        {complaint.location ? (
                          <View style={styles.container}>
                            <View>
                              <Text style={styles.label}>Location Details</Text>
                            </View>

                            <View>
                              <Text>{complaint.location}</Text>
                            </View>
                          </View>
                        ) : null}

                        <View style={styles.container}>
                          <View>
                            <Text style={styles.label}>Assigned To</Text>
                          </View>

                          {complaint.assignedTo && (
                            <View>
                              <Text>{complaint.assignedTo.name}</Text>
                            </View>
                          )}
                        </View>
                        {user.role === "assignee" ? (
                          <View style={styles.container}>
                            <View>
                              <Text style={styles.label}>Complainer</Text>
                            </View>

                            {complaint.complainer && (
                              <View>
                                <Text>{complaint.complainer.name}</Text>
                              </View>
                            )}
                          </View>
                        ) : null}

                        <View style={styles.container}>
                          <View>
                            <Text style={styles.label}>Category</Text>
                          </View>

                          {complaint.category && (
                            <View>
                              <Text>{complaint.category.name}</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.container}>
                          <View>
                            <Text style={styles.label}>Location</Text>
                          </View>

                          {complaint.locationTag && (
                            <View>
                              <Text>{complaint.locationTag.name}</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.container}>
                          <View>
                            <Text style={styles.label}>Details</Text>
                          </View>

                          <View>
                            <Text>{complaint.details}</Text>
                          </View>
                        </View>

                        {/* remarks */}

                        {complaint ? (
                          <View>
                            {complaint.remarks ? (
                              <View style={styles.container}>
                                <View>
                                  <Text style={styles.label}>Remarks</Text>
                                </View>
                                {complaint.remarks.map(remark => (
                                  <View key={uuid()}>
                                    <View
                                      style={{
                                        padding: 5,
                                        borderColor: "#d0d0d0",
                                        borderWidth: 0.7,
                                        borderRadius: 10,
                                        margin: 5
                                      }}
                                    >
                                      <View
                                        style={{
                                          paddingTop: 5,
                                          paddingBottom: 5
                                        }}
                                      >
                                        <Text style={{ color: "green" }}>
                                          {remark.split(">")[0]}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          paddingTop: 5,
                                          paddingBottom: 5
                                        }}
                                      >
                                        <Text style={{ fontWeight: "600" }}>
                                          {remark.split(">")[1]}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                ))}
                              </View>
                            ) : null}
                          </View>
                        ) : null}

                        {/* remarks end */}

                        {user.role === "assignee" ||
                          (user.role === "complainer" && (
                            <View>
                              {complaint.feedbackRemarks && (
                                <View style={styles.container}>
                                  <View>
                                    <Text style={styles.label}>
                                      Feedback from Complainer
                                    </Text>
                                  </View>

                                  <View>
                                    <Text>{complaint.feedbackRemarks}</Text>
                                  </View>

                                  <View>
                                    <Text
                                      style={{
                                        fontSize: 14,
                                        fontWeight: "500",
                                        color:
                                          complaint.feedbackTags === "satisfied"
                                            ? "green"
                                            : "red"
                                      }}
                                    >
                                      {complaint.feedbackTags}
                                    </Text>
                                  </View>
                                </View>
                              )}
                            </View>
                          ))}
                        <View>
                          {complaint.files ? (
                            <View>
                              <MainButton
                                onPress={this._handleFileView}
                                buttonContainer={{
                                  backgroundColor: Color.primaryColor
                                }}
                              >
                                View File
                              </MainButton>
                            </View>
                          ) : null}
                        </View>
                        {/* <View style={styles.container}>
                <View>
                      <Text style={styles.label}>{}</Text>
                </View>
                
                <View>
                      <Text >{}</Text>
                </View>
  
              </View> */}

                        {/* {(user.role === "assignee" || user.role==='admin') && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        margin: 5
                      }}
                    >
                      <Button
                        title="Drop Responsibility"
                        color={Color.buttonColor}
                        onPress={drop}
                      />
                      <Button
                        title="Mark as Spam"
                        color={Color.secondaryButtonColor}
                        onPress={spam}
                      />
                    </View>
                  )} */}
                        {Platform.OS === "android" && (
                          <View>
                            {complaint.geolocation && (
                              <View style={{ margin: 5 }}>
                                <MainButton
                                  buttonContainer={{
                                    backgroundColor: Color.primaryColor
                                  }}
                                  // onPress={() => {
                                  //   this.props.navigation.navigate({
                                  //     routeName: "Webview",
                                  //     params: {
                                  //       geolocation: complaint.geolocation
                                  //     }
                                  //   });
                                  // }}
                                  onPress={() =>
                                    this._handleViewMap(complaint.geolocation)
                                  }
                                >
                                  {" "}
                                  Map {"      "}
                                  <FontAwesome
                                    name="map-marker"
                                    size={24}
                                    color={"white"}
                                  />
                                </MainButton>
                              </View>
                            )}
                          </View>
                        )}
                        {user.role === "complainer" &&
                        complaint.status !== "in-progress" ? (
                          <View>
                            {configToken.isReopen &&
                            user._id == complaint.complainer._id ? (
                              <View style={{ paddingVertical: 5 }}>
                                <Text
                                  style={{ fontSize: 14, fontWeight: "600" }}
                                >
                                  Not satisfied with Assignee remarks?
                                </Text>

                                <MainButton
                                  buttonContainer={{
                                    backgroundColor: Color.accentColor
                                  }}
                                  onPress={this.handleReopenDialog}
                                >
                                  Re-open{" "}
                                  <Ionicons
                                    name="ios-open"
                                    size={24}
                                    color={"white"}
                                  />
                                </MainButton>
                              </View>
                            ) : null}
                          </View>
                        ) : null}

                        {complaint.spam ? null : (
                          <View>
                            {user.role === "assignee" && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  margin: 5
                                }}
                              >
                                <MainButton
                                  buttonContainer={{
                                    backgroundColor: Color.primaryColor
                                  }}
                                  onPress={this.handleDrop}
                                >
                                  Drop{" "}
                                  <Ionicons
                                    name="md-exit"
                                    size={22}
                                    color="white"
                                  />
                                </MainButton>
                                <MainButton
                                  buttonContainer={{
                                    backgroundColor: Color.accentColor
                                  }}
                                  onPress={this.handleSpam}
                                >
                                  Spam{" "}
                                  <Entypo
                                    name="trash"
                                    size={22}
                                    color={"white"}
                                  />
                                </MainButton>
                              </View>
                            )}
                          </View>
                        )}

                        {/* {user && (
                    <View> */}
                        {user.role === "complainer" && (
                          <View style={{ margin: 5 }}>
                            {complaint.status !== "in-progress" && (
                              <MainButton
                                buttonContainer={{
                                  backgroundColor: Color.accentColor
                                }}
                                onPress={() => {
                                  this.props.navigation.navigate({
                                    routeName: "Feedback",
                                    params: {
                                      complaintId: complaint._id
                                    }
                                  });
                                }}
                              >
                                Give Feedback{" "}
                                <FontAwesome
                                  name="comments-o"
                                  size={22}
                                  color={"white"}
                                />
                              </MainButton>
                            )}
                          </View>
                        )}
                        {/* </View>
                  )} */}
                        {!configToken.isMessaging ? null : (
                          <View>
                            <View>
                              {(user.role === "complainer" ||
                                user.role === "assignee") && (
                                <View style={{ margin: 5 }}>
                                  <MainButton
                                    buttonContainer={{
                                      backgroundColor: Color.accentColor
                                    }}
                                    onPress={() => {
                                      return this.props.navigation.navigate({
                                        routeName: "Chat",
                                        params: {
                                          currentUser: this.props.navigation.getParam(
                                            "currentUser"
                                          ),
                                          receiverId:
                                            user.role === "assignee"
                                              ? complaint.complainer._id
                                              : complaint.assignedTo._id
                                        }
                                      });
                                    }}
                                  >
                                    Message {"  "}{" "}
                                    <Ionicons
                                      name="md-chatboxes"
                                      size={22}
                                      color={"white"}
                                    />
                                  </MainButton>
                                </View>
                              )}
                            </View>
                            <View>
                              {user.role === "admin" &&
                              complaint.assignedTo._id == user._id ? (
                                <View style={{ margin: 5 }}>
                                  <MainButton
                                    buttonContainer={{
                                      backgroundColor: Color.accentColor
                                    }}
                                    onPress={() => {
                                      return this.props.navigation.navigate({
                                        routeName: "Chat",
                                        params: {
                                          currentUser: this.props.navigation.getParam(
                                            "currentUser"
                                          ),
                                          receiverId:
                                            user.role === "admin"
                                              ? complaint.complainer._id
                                              : complaint.assignedTo._id
                                        }
                                      });
                                    }}
                                  >
                                    Message
                                  </MainButton>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

ComplaintDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: "Complaint Details"
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center"
  },
  container: {
    padding: 10,
    margin: 5,
    backgroundColor: "#F8F8F8",
    shadowColor: "#D3D3D3",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: 10
  },
  label: {
    fontWeight: "600",
    fontSize: 18
  },
  cardContainer: {
    backgroundColor: "white",
    shadowColor: "#e4e4e4",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10
  },
  cardContainer2: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: "#16a28f",
    shadowColor: "#e4e4e4",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10
  }
});

export default ComplaintDetailScreen;
