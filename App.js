import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { useScreens } from "react-native-screens";

import { registerForPushNotificationsAsync } from "./utils/PushNotifications";
import ComplaintsNavigator from "./navigation/ComplaintsNavigator";

import authService from "./services/authService";
import config from "./config.json";
import openSocket from "socket.io-client";

const socket = openSocket(config.apiEndpoint);

useScreens();

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf")
  });
};

export default class App extends React.Component {
  state = { fontLoaded: false };

  async componentDidMount() {
    const user = await authService.getCurrentUser();
    socket.on("msg", data => {
      if (data.receiver == user._id) {
        registerForPushNotificationsAsync("New Message", data.messageBody);
      }
    });

    socket.on("complaints", data => {
      if (data.notification.companyId == user.companyId) {
        if (data.action === "new complaint") {
          if (
            user._id === data.complaint.assignedTo._id &&
            user.companyId == data.notification.companyId
          ) {
            registerForPushNotificationsAsync(
              "New Complaint",
              "You have been assigned new complaint"
            );
          }
        }

        if (data.action === "feedback") {
          if (
            user._id === data.complaint.assignedTo._id &&
            user.companyId == data.notification.companyId
          ) {
            registerForPushNotificationsAsync(
              "Complaint feedback",
              "Feedback is given of your assigned complaint."
            );
          }
        }

        if (data.action === "status changed") {
          if (
            user._id === data.complaint.complainer._id &&
            user.companyId == data.notification.companyId
          ) {
            registerForPushNotificationsAsync(
              "Status changed",
              "Complaint status is changed."
            );
          }
        }

        if (data.action === "reopened") {
          if (
            user._id === data.complaint.assignedTo._id &&
            user.companyId == data.notification.companyId
          ) {
            registerForPushNotificationsAsync(
              "Complaint Reopened",
              "Complaint is reopened."
            );
          }
        }

        if (data.action === "drop") {
          if (
            (user._id !== data.complaint.assignedTo._id ||
              user._id !== data.complaint.complainer._id) &&
            user.companyId == data.notification.companyId
          ) {
            registerForPushNotificationsAsync(
              "Complaint Dropped",
              "Complaint is dropped from responsibility."
            );
          }
        }

        if (data.action === "status changed") {
          if (
            user._id === data.complaint.complainer._id &&
            user.companyId == data.notification.companyId
          ) {
            registerForPushNotificationsAsync(
              "Complaint status changed",
              "Your Complaint's status is changed."
            );
          }
        }

        if (data.action === "task assigned") {
          if (
            user._id === data.complaint.assignedTo._id &&
            user.companyId == data.notification.companyId
          ) {
            registerForPushNotificationsAsync(
              "New Complaint",
              "You have been assigned new complaint."
            );
          }
        }
      }
    });
  }

  render() {
    if (!this.state.fontLoaded) {
      return (
        <AppLoading
          startAsync={fetchFonts}
          onFinish={() => this.setState({ fontLoaded: true })}
        />
      );
    }

    return <ComplaintsNavigator />;
  }
}
