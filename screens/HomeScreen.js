import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
// import Toast from "react-native-simple-toast";
import HeaderButton from "../components/HeaderButton";
import DisplayCard from "../components/displayCard";

import authService from "../services/authService";
import {
  getAssigneeComplaints,
  getComplaints,
  getAdminComplaints
} from "../services/complaintService";
import Color from "../constants/Color";
import NewHeaderButton from "../components/NewHeaderButton";
import { Ionicons } from "@expo/vector-icons";
import { getConfiguration } from "../services/configService";

class HomeScreen extends Component {
  state = {
    count: 0,
    user: "",
    complaints: [],
    resolved: [],
    inprogress: [],
    isRefreshing: false,
    isLoading: false,
    configToken: "",
    positiveFeedbackComplaints: [],
    negativeFeedbackComplaints: [],
    delayedComplaints: []
  };
  willFocusSub = "";

  getComplaintsAndStore = async () => {
    this.setState({ isLoading: true });
    const user = await authService.getCurrentUser();

    try {
      const { data: configToken } = await getConfiguration(user.companyId);
      this.setState({ configToken: configToken });

      if (user.role === "assignee") {
        const { data } = await getAssigneeComplaints();
        console.log("Assignee", data.length);
        const resolved = data.filter(
          cmp =>
            cmp.status === "closed - relief granted" ||
            cmp.status === "closed - partial relief granted" ||
            cmp.status === "closed - relief can't be granted"
        );
        const inprogress = data.filter(cmp => cmp.status === "in-progress");
        this.setState({ complaints: data });
        this.gettingComplaints(resolved, inprogress);
        //
      }
      if (user.role === "complainer") {
        console.log("complainer");
        const { data } = await getComplaints();
        const resolved = data.filter(
          cmp =>
            cmp.status === "closed - relief granted" ||
            cmp.status === "closed - partial relief granted" ||
            cmp.status === "closed - relief can't be granted"
        );
        const inprogress = data.filter(cmp => cmp.status === "in-progress");
        // setComplaints(oldComplaints => [...oldComplaints, ...data]);
        this.setState({ complaints: data });
        this.gettingComplaints(resolved, inprogress);
        //
      }
      if (user.role === "admin") {
        const { data } = await getAdminComplaints();
        // console.log("admin", data.length);
        const resolved = data.filter(
          cmp =>
            cmp.status === "closed - relief granted" ||
            cmp.status === "closed - partial relief granted" ||
            cmp.status === "closed - relief can't be granted"
        );
        const inprogress = data.filter(cmp => cmp.status === "in-progress");
        this.setState({ complaints: data });
        // setComplaints(oldComplaints => [...oldComplaints, ...data]);
        this.gettingComplaints(resolved, inprogress);
        //
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        Alert.alert("Error");
        console.log(ex.response);
      }
    }

    this.setState({ isLoading: false });
    this.countFeedback();
  };

  async componentDidMount() {
    this.focusLitener = this.props.navigation.addListener("didFocus", () => {
      this.setState({ count: this.state.count++ });
    });

    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      this.getComplaintsAndStore
    );

    this.props.navigation.setParams({
      handleNewComplaintHeaderButton: this._handleNewComplaintHeaderButton
    });
    this.setState({ isRefreshing: true });
    this.getComplaintsAndStore();
    this.setState({ isRefreshing: false });
  }

  async componentWillUnmount() {
    this.willFocusSub.remove();
  }

  gettingComplaints = async (resolved, inprogress) => {
    this.setState({
      resolved: resolved,
      inprogress: inprogress
    });
  };

  componentWillUnmount() {
    this.focusLitener.remove();
  }

  _handleNewComplaintHeaderButton = async () => {
    const user = await authService.getCurrentUser();
    if (user.role === "admin" || user.role === "assignee") {
      // console.log("handle new button", user.role);
      return;
      //  Toast.show(
      //   "You are not allowed to make new Complaint. Please login as Complainer",
      //   Toast.LONG
      // );
    }
    this.props.navigation.navigate({ routeName: "NewComplaint" });
  };

  navigateToAllComplaints = async () => {
    const user = await authService.getCurrentUser();
    this.props.navigation.navigate({
      routeName: "Complaints",
      params: {
        complaints: this.state.complaints,
        user: user
      }
    });
  };

  handleInProgressPress = async () => {
    const user = await authService.getCurrentUser();
    this.props.navigation.navigate({
      routeName: "Complaints",
      params: {
        complaints: this.state.inprogress,
        user: user
      }
    });
  };

  handleResolvedPress = async () => {
    const user = await authService.getCurrentUser();
    this.props.navigation.navigate({
      routeName: "Complaints",
      params: {
        complaints: this.state.resolved,
        user: user
      }
    });
  };

  handleDelayedPress = async () => {
    // console.log("handleDelayedPress");
    const user = await authService.getCurrentUser();
    this.props.navigation.navigate({
      routeName: "Complaints",
      params: {
        complaints: this.state.delayedComplaints,
        user: user
      }
    });
  };

  handlePositiveFeedbackPress = async () => {
    console.log("handlePositiveFeedbackPress");
    const user = await authService.getCurrentUser();
    this.props.navigation.navigate({
      routeName: "Complaints",
      params: {
        complaints: this.state.positiveFeedbackComplaints,
        user: user
      }
    });
  };

  handleNegativeFeedbackPress = async () => {
    console.log("handleNegativeFeedbackPress");
    const user = await authService.getCurrentUser();
    this.props.navigation.navigate({
      routeName: "Complaints",
      params: {
        complaints: this.state.negativeFeedbackComplaints,
        user: user
      }
    });
  };

  // calculate days
  calculateDays = stamp => {
    var date = new Date(stamp);
    let d = new Date();
    let days =
      Math.ceil(Math.abs(d.getTime() - date.getTime()) / (1000 * 3600 * 24)) -
      1;
    return days;
  };

  // count feedback and delayed complaints
  countFeedback = async () => {
    const { configToken: config, complaints } = this.state;
    let delayedDays = 5;
    if (config.delayedDays) delayedDays = +config.delayedDays;
    let positiveFeedback = [],
      delayed = [],
      negativeFeedback = [];

    complaints.forEach(complaint => {
      let days = this.calculateDays(complaint.timeStamp) + 1;
      if (days > delayedDays) {
        delayed.push(complaint);
      }
      if (complaint.feedbackTags) {
        if (complaint.feedbackTags === "satisfied")
          positiveFeedback.push(complaint);
        else negativeFeedback.push(complaint);
      }
    });
    this.setState({
      positiveFeedbackComplaints: positiveFeedback,
      negativeFeedbackComplaints: negativeFeedback,
      delayedComplaints: delayed
    });
  };

  render() {
    const { isRefreshing, isLoading } = this.state;
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.getComplaintsAndStore}
            />
          }
        >
          {isLoading && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ActivityIndicator color={Color.primaryColor} />
            </View>
          )}
          {this.state.complaints.length ? (
            <DisplayCard
              totalComplaints={this.state.complaints}
              inprogress={this.state.inprogress}
              resolved={this.state.resolved}
              onPress={this.navigateToAllComplaints}
              onInProgressPress={this.handleInProgressPress}
              onResolvedPress={this.handleResolvedPress}
              positiveFeedback={this.state.positiveFeedbackComplaints}
              onPositiveFeedbackPress={this.handlePositiveFeedbackPress}
              negativeFeedback={this.state.negativeFeedbackComplaints}
              onNegativeFeedbackPress={this.handleNegativeFeedbackPress}
              delayed={this.state.delayedComplaints}
              onDelayedPress={this.handleDelayedPress}
            />
          ) : // <DisplayCard
          //   totalComplaints={this.state.complaints}
          //   inprogress={this.state.inprogress}
          //   resolved={this.state.resolved}
          //   onPress={this.navigateToAllComplaints}
          //   onInProgressPress={this.handleInProgressPress}
          //   onResolvedPress={this.handleResolvedPress}
          //   positiveFeedback={this.state.positiveFeedbackComplaints}
          //   onPositiveFeedbackPress={this.handlePositiveFeedbackPress}
          //   negativeFeedback={this.state.negativeFeedbackComplaints}
          //   onNegativeFeedbackPress={this.handleNegativeFeedbackPress}
          //   delayed={this.state.delayedComplaints}
          //   onDelayedPress={this.handleDelayedPress}
          // />
          null}
        </ScrollView>
        {/* {renderFloatingButton()} */}
      </SafeAreaView>
    );
  }
}

HomeScreen.navigationOptions = navData => {
  return {
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      // <View>
      //   {navData.navigation.state.params.user && (
      //     <View>
      //       {navData.navigation.state.params.user.role === "complainer" && (
      <HeaderButtons HeaderButtonComponent={NewHeaderButton}>
        <Item
          title="NewComplaint"
          iconName="plus"
          onPress={navData.navigation.getParam(
            "handleNewComplaintHeaderButton"
          )}
        />
      </HeaderButtons>
      //       )}
      //     </View>
      //   )}
      // </View>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

export default HomeScreen;
