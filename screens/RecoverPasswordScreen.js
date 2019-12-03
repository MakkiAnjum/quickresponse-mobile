import React, { Component } from "react";
import {
  View,
  Alert,
  Text,
  Picker,
  TextInput,
  Button,
  StyleSheet
} from "react-native";
import Companies from "../components/companies";
import Card from "../components/common/Card";
import Color from "../constants/Color";
import { recoverPassword } from "../services/userService";
import MainButton from "../components/MainButton";

class RecoverPasswordScreen extends Component {
  state = { displayCompanyModal: false, email: "", role: "", companyId: "" };

  handleDisplayCompaniesModal = async () => {
    this.setState({ displayCompanyModal: true });
  };

  handleCompaniesModal = () => {
    this.setState({ displayCompanyModal: !this.state.displayCompanyModal });
  };

  handleCompany = companyId => {
    this.setState({ displayCompanyModal: false, companyId: companyId });
  };

  handleSearch = async () => {
    const { companyId, email, role } = this.state;
    // if (!companyId) return Alert.alert("You must choose compnay.");
    if (!email || !role || !companyId)
      return Alert.alert("Please enter email/role/company.");

    const body = {
      role: role,
      email: email.trim(),
      companyId: companyId
    };

    try {
      const { data: response } = await recoverPassword(body);
      Alert.alert("Password has been sent to your email address");
      return this.props.navigation.navigate("Auth");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return Alert.alert("Role and companyId is required");
      } else if (err.response && err.response.status === 404) {
        return Alert.alert(
          `There is no user with given Id and under the role ${role}`
        );
      }
    }
  };

  render() {
    const { displayCompanyModal, email, role } = this.state;
    return (
      <View style={styles.screen}>
        {displayCompanyModal && (
          <Companies
            visible={displayCompanyModal}
            onModalClosed={this.handleCompaniesModal}
            onCompanyChoosed={this.handleCompany}
          />
        )}
        <Card style={styles.cardContainer}>
          <View>
            <TextInput
              placeholder="Email to search your account *"
              style={styles.input}
              value={email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Picker
              selectedValue={role}
              mode="dropdown"
              // style={{ height: 50, width: 100 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ role: itemValue })
              }
            >
              <Picker.Item label="Choose Role *" value="" enabled={false} />
              <Picker.Item label="Complainer" value="complainer" />
              <Picker.Item label="Assignee" value="assignee" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                paddingVertical: 10
              }}
            >
              <View style={{ paddingRight: 5 }}>
                <MainButton
                  buttonContainer={{ backgroundColor: Color.primaryColor }}
                  onPress={this.handleSearch}
                >
                  Search
                </MainButton>
              </View>
              <View>
                <MainButton
                  buttonContainer={{ backgroundColor: Color.accentColor }}
                  onPress={this.handleDisplayCompaniesModal}
                >
                  Choose Company
                </MainButton>
              </View>
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
    // justifyContent: "center"
    // alignItems: "center"
  },
  cardContainer: {
    backgroundColor: "white",
    shadowColor: "#e4e4e4",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    margin: 10
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
export default RecoverPasswordScreen;
