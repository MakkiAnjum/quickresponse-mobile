import React from "react";
import uuid from "uuid/v1";
import * as WebBrowser from "expo-web-browser";
import {
  Alert,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
  ScrollView,
  TextInput,
  StyleSheet
} from "react-native";

import config from "../config.json";
import openSocket from "socket.io-client";
import authService from "../services/authService";
import { getAllMessages, sendMessage } from "../services/messageService";

import Color from "../constants/Color.js";
import { YellowBox } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import ImgPicker from "../components/ImagePicker.js";
import CameraImgPicker from "../components/CameraImagePicker.js";
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);

const socket = openSocket(config.apiEndpoint);

class ChatScreen extends React.Component {
  state = {
    message: "",
    allMessages: [],
    selectedFile: null,
    sender: ""
  };
  willFocusSub = "";
  isActive = false;

  async componentDidMount() {
    this.isActive = true;
    const currentUser = await authService.getCurrentUser();

    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      this.getAllMessages
    );

    this.setState({ sender: currentUser._id });
    this.getAllMessages();
    this.socketCheck();

    this.refs.scrollView.scrollToEnd();
  }

  componentWillUnmount() {
    this.isActive = false;
    this.willFocusSub.remove();
  }

  getAllMessages = async () => {
    if (this.isActive) {
      console.log("getAllMessages called");
      const data = {
        sender: this.state.sender,
        receiver: this.props.navigation.getParam("receiverId")
      };

      const { data: msgs } = await getAllMessages(data);

      msgs.sort((a, b) => {
        return a.createdAt.localeCompare(b.createdAt);
      });

      this.setState({ allMessages: msgs });
      // console.log(msgs);
    }
    // this.scroll.current.scrollIntoView();
  };

  socketCheck = async () => {
    socket.on("msg", data => {
      if (
        (data.sender == this.props.navigation.getParam("receiverId") &&
          data.receiver == this.state.sender) ||
        (data.sender == this.state.sender &&
          data.receiver == this.props.navigation.getParam("receiverId"))
      ) {
        this.setState(prevState => {
          const allMessages = [...prevState.allMessages];
          allMessages.push(data);
          return { allMessages: allMessages };
        });
      }
    });
  };

  handleMessageChange = msg => {
    if (this.isActive) this.setState({ message: msg });
  };

  handleImageTaken = async image => {
    if (!image.cancelled) {
      this.setState({ message: "attachment", selectedFile: image });
    }
  };

  handleSend = async () => {
    if (this.isActive) {
      if (this.state.message === "") {
        return Alert.alert("Please write some message");
      }
      const formData = new FormData();

      if (this.state.selectedFile) {
        formData.append("mobileFile", this.state.selectedFile.base64);
        formData.append("sender", this.state.sender);
        formData.append(
          "receiver",
          this.props.navigation.getParam("receiverId")
        );

        await sendMessage(formData);
        this.setState({ message: "" });
      } else {
        formData.append("messageBody", this.state.message);
        formData.append("sender", this.state.sender);
        formData.append(
          "receiver",
          this.props.navigation.getParam("receiverId")
        );

        await sendMessage(formData);
        this.setState({ message: "" });
      }

      // const data = {
      //   messageBody: this.state.message,
      //   sender: this.state.sender,
      //   receiver: this.props.navigation.getParam("receiverId")
      // };
    }
    // this.scroll.current.scrollIntoView();
  };

  _handleViewFile = async msg => {
    await WebBrowser.openBrowserAsync(
      `${config.apiUrl}/messages/file/${msg._id}/${msg.messageBody}`
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView ref="scrollView">
          {this.state.allMessages.length > 0 ? (
            <View>
              {this.state.allMessages.map(message => (
                <View
                  key={uuid()}
                  style={{
                    padding: 8,
                    margin: 5,
                    alignSelf:
                      this.props.navigation.getParam("currentUser")._id ==
                      message.sender
                        ? "flex-end"
                        : "flex-start",
                    backgroundColor:
                      this.props.navigation.getParam("currentUser")._id ==
                      message.sender
                        ? "#049cfc"
                        : "#f4ecf4",
                    borderRadius: 8
                  }}
                >
                  <Text
                    style={{
                      color:
                        this.props.navigation.getParam("currentUser")._id ==
                        message.sender
                          ? "white"
                          : "black",
                      fontSize: 18
                    }}
                  >
                    {message.messageBody.includes("cmp-") ? (
                      <FontAwesome
                        name="file-text-o"
                        size={22}
                        color={
                          this.props.navigation.getParam("currentUser")._id ==
                          message.sender
                            ? "white"
                            : "black"
                        }
                        onPress={() => this._handleViewFile(message)}
                      />
                    ) : (
                      <Text>{message.messageBody}</Text>
                    )}
                    {/* {message.messageBody} */}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text>No Previous chat found.</Text>
            </View>
          )}
        </ScrollView>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={130}>
          <View style={styles.inputBar}>
            <TextInput
              placeholder="write something..."
              style={styles.textBox}
              value={this.state.message}
              onChangeText={this.handleMessageChange}
            />
            <ImgPicker onImageTaken={this.handleImageTaken}>
              <View style={{ paddingLeft: 8, paddingTop: 8 }}>
                <AntDesign
                  name="picture"
                  size={22}
                  color={Color.primaryColor}
                />
              </View>
            </ImgPicker>
            <CameraImgPicker onImageTaken={this.handleImageTaken}>
              <View style={{ paddingLeft: 8, paddingTop: 8 }}>
                <AntDesign name="camera" size={22} color={Color.primaryColor} />
              </View>
            </CameraImgPicker>

            <TouchableOpacity style={styles.sendBtn}>
              <Text style={{ color: "#fff" }} onPress={this.handleSend}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

ChatScreen.navigationOptions = navData => {
  return {
    headerTitle: "Chat"
    // tabBarVisible: false
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  inputBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8"
  },
  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    fontSize: 14,
    paddingHorizontal: 10,
    flex: 1,
    paddingVertical: 5
  },
  sendBtn: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginLeft: 5,
    borderColor: "blue",
    backgroundColor: Color.primaryColor
  }
});

export default ChatScreen;
