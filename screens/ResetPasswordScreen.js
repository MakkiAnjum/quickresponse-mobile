import React, { Component } from "react";
import {
  View,
  Image,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Alert
} from "react-native";
import { getCurrentUser } from "../services/authService";
import Card from "../components/common/Card";
import Color from "../constants/Color";
import { resetPassword } from "../services/userService";
import MainButton from "../components/MainButton";

class ResetPassword extends Component {
  state = { currentPassword: "", newPassword: "", confirmNewPassword: "" };

  // reset password
  handlePasswordReset = async () => {
    const user = await getCurrentUser();
    const { currentPassword, newPassword, confirmNewPassword } = this.state;

    if (newPassword != confirmNewPassword) {
      return Alert.alert("Password mismatch");
    }

    const body = {
      id: user._id,
      role: user.role,
      currentPassword: currentPassword,
      newPassword: newPassword
    };
    console.log(body);

    try {
      const { data: response } = await resetPassword(body);
      Alert.alert(response);
      this.props.navigation.navigate("Home");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        Alert.alert("Current Password did not match");
      }
    }
  };

  render() {
    const { confirmNewPassword, newPassword, currentPassword } = this.state;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.screen}>
          <View style={styles.view}>
            <Card style={styles.cardContainer}>
              <View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TextInput
                    placeholder="Current password..."
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={text =>
                      this.setState({ currentPassword: text })
                    }
                    secureTextEntry={true}
                  />
                  <TextInput
                    placeholder="New password..."
                    style={styles.input}
                    value={newPassword}
                    onChangeText={text => this.setState({ newPassword: text })}
                    secureTextEntry={true}
                  />
                  <TextInput
                    placeholder="Confirm new password..."
                    style={styles.input}
                    value={confirmNewPassword}
                    onChangeText={text =>
                      this.setState({ confirmNewPassword: text })
                    }
                    secureTextEntry={true}
                  />
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <View style={{ paddingRight: 5 }}>
                    <MainButton
                      buttonContainer={{ backgroundColor: Color.primaryColor }}
                      onPress={() => this.props.navigation.navigate("Home")}
                    >
                      Cancel
                    </MainButton>
                  </View>
                  <View>
                    <MainButton
                      buttonContainer={{ backgroundColor: Color.accentColor }}
                      onPress={this.handlePasswordReset}
                    >
                      Reset
                    </MainButton>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

ResetPassword.navigationOptions = navData => {
  return {
    headerTitle: "Reset Password"
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    backgroundColor: "#f8f8f8"
  },
  view: {
    justifyContent: "center",
    alignItems: "center"
  },
  cardContainer: {
    backgroundColor: "white",
    shadowColor: "#e4e4e4",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    margin: 10,
    width: "90%"
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
    borderRadius: 7,
    fontSize: 18
  }
});

export default ResetPassword;
