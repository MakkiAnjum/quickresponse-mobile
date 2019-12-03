import React, { useEffect, useState } from "react";
import {
  View,
  Picker,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Alert
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { AsyncStorage } from "react-native";

import MainButton from "../components/MainButton";
import Colors from "../constants/Color";
import Card from "../components/common/Card";
import authService from "../services/authService";
import http from "../services/httpService";
import Companies from "../components/companies";
import { getConfiguration } from "../services/configService";
import { TextInput } from "react-native-paper";
import LinkButton from "../components/LinkButton";

const AuthScreen = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [displayCompanyModal, setDisplayCompanyModal] = useState(false);
  const [configToken, setConfigToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    retrieveInfo();
  }, []);

  // handleNewComplainer
  const handleNewComplainer = () => {
    return props.navigation.navigate("NewComplainer");
  };

  // retreive information
  const retrieveInfo = async () => {
    try {
      const user = await authService.getCurrentUser();
      // console.log(user);

      if (user) {
        const { data } = await getConfiguration(user.companyId);
        // console.log("config token in authScreen", data);
        setConfigToken(data);
        return props.navigation.navigate("Complaint");
      }
    } catch (ex) {}
  };

  const Authenticate = async () => {
    if (!companyId) {
      return Alert.alert("You must choose Company before Login.");
    }

    if (!role) {
      return Alert.alert("Please choose your role.");
    }

    try {
      const { headers } = await authService.login(
        email.trim().toLowerCase(),
        password,
        companyId,
        `/auth-${role}`
      );
      AsyncStorage.setItem("token", headers["x-auth-token"], () => {
        authService
          .getJwt()
          .then(token => {
            http.setJwt(token);
          })
          .catch(err => console.log("Err"));
        console.log("in asc");
        return props.navigation.navigate({
          routeName: "Home"
        });
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        Alert.alert("Login Error", ex.response.data);
      }
    }
  };

  const handleCompaniesModal = () => {
    setDisplayCompanyModal(!displayCompanyModal);
  };

  const handleCompany = companyId => {
    console.log(companyId);
    setDisplayCompanyModal(false);
    setCompanyId(companyId);
  };

  const handleChooseCompany = () => {
    setDisplayCompanyModal(true);
  };

  const HandleForgetPassword = async () => {
    console.log("HandleForgetPassword");
  };

  return (
    // <KeyboardAvoidingView behavior="position">
    // <View>
    <View style={styles.screen}>
      {displayCompanyModal && (
        <Companies
          visible={displayCompanyModal}
          onModalClosed={handleCompaniesModal}
          onCompanyChoosed={handleCompany}
        />
      )}
      <Card style={styles.cardContainer}>
        <View>
          {/* <ImgPicker onImageTaken={handleImageTaken} /> */}

          <TextInput
            style={styles.input}
            placeholder="Email..."
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password..."
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />

          <View
          // style={{
          //   flexDirection: "row",
          //   justifyContent: "flex-end"
          // }}
          >
            <Picker
              selectedValue={role}
              mode="dropdown"
              // style={{ height: 50, width: 100 }}
              onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
            >
              <Picker.Item
                label="Choose Role *"
                value=""
                enabled={false}
              ></Picker.Item>
              <Picker.Item label="Complainer" value="complainer" />
              <Picker.Item label="Assignee" value="assignee" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>

            <View
              style={{
                marginVertical: 10,
                flexDirection: "row",
                justifyContent: "flex-end"
              }}
            >
              <MainButton
                onPress={handleChooseCompany}
                buttonContainer={{ backgroundColor: Colors.accentColor }}
                // buttonTextContainer={{}}
              >
                Choose Company ->
                {/* <AntDesign name="arrowright" size={22} color="white" /> */}
              </MainButton>
            </View>
            <View style={{ paddingRight: 5 }}>
              <MainButton
                buttonContainer={{ backgroundColor: Colors.primaryColor }}
                onPress={Authenticate}
              >
                Login
              </MainButton>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginVertical: 10
            }}
          >
            <View>
              <LinkButton
                buttonTextContainer={{
                  borderBottomColor: "blue",
                  borderBottomWidth: 0.5
                }}
                onPress={() => props.navigation.navigate("Recoverpassword")}
              >
                Forget Password ->
              </LinkButton>
            </View>
          </View>
          {!configToken.isAccountCreation ? (
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <LinkButton
                onPress={handleNewComplainer}
                buttonContainer={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
                buttonTextContainer={{ fontSize: 14 }}
              >
                Register new complainer
              </LinkButton>
            </View>
          ) : null}
        </View>
      </Card>
    </View>
    /* </ScrollView> */
    // </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Login to Continue"
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    // padding: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  cardContainer: {
    backgroundColor: "white",
    shadowColor: "#e4e4e4",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
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
    fontSize: 18,
    backgroundColor: "white"
  }
});

export default AuthScreen;
