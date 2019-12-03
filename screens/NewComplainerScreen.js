import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Button,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Platform
} from "react-native";

import Card from "../components/common/Card";
import Color from "../constants/Color";
import { AddNewComplainer } from "../services/userService";
import MainButton from "../components/MainButton";

class NewComplainerScreen extends React.Component {
  state = { name: "", email: "", password: "", phone: "" };

  async componentDidMount() {
    console.log("New Complainer Screen.");
  }

  // handleAdd
  handleAdd = async () => {
    const { email, name, password, phone } = this.state;
    if (
      !this.state.name ||
      !this.state.email ||
      !this.state.password ||
      !this.state.phone
    ) {
      return Alert.alert("Please fill all required inputs.");
    }

    if (name.length < 5) {
      return Alert.alert("Name must be atleast 5 characters long.");
    }
    if (password.length < 8) {
      return Alert.alert("Password must be atleast 8 characters long.");
    }
    if (phone.length < 9) {
      return Alert.alert("Phone must be atleast 9 characters long.");
    }

    const data = new FormData();
    data.append("name", this.state.name);
    data.append("email", this.state.email);
    data.append("password", this.state.password);
    data.append("phone", this.state.phone);

    try {
      await AddNewComplainer(data);
      return this.props.navigation.navigate("Auth");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        return Alert.alert("User already found.");
      }
    }
  };

  render() {
    const { name, email, password, phone } = this.state;
    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View style={styles.screen}>
            <Card style={styles.cardContainer}>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Name *"
                  value={name}
                  onChangeText={text => this.setState({ name: text })}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Email *"
                  value={email}
                  onChangeText={text => this.setState({ email: text })}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password *"
                  value={password}
                  onChangeText={text => this.setState({ password: text })}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Phone *"
                  value={phone}
                  onChangeText={text => this.setState({ phone: text })}
                  keyboardType={"number-pad"}
                />
                {/* <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          > */}

                <MainButton
                  buttonContainer={{ backgroundColor: Color.primaryColor }}
                  onPress={this.handleAdd}
                >
                  Add
                </MainButton>

                <View style={{ paddingVertical: 10 }}>
                  <MainButton
                    buttonContainer={{ backgroundColor: Color.primaryColor }}
                    onPress={() => this.props.navigation.navigate("Auth")}
                  >
                    Login
                  </MainButton>
                </View>
                {/* </View> */}
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

NewComplainerScreen.navigationOptions = navData => {
  return {
    headerTitle: "Add New Complainer"
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    borderColor: "#F0F0F0",
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
    borderRadius: 7,
    fontSize: 18
  }
});

export default NewComplainerScreen;
