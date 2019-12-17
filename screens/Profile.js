import React from "react";
import { encode, decode } from "base64-arraybuffer";
import {
  View,
  ActivityIndicator,
  TextInput,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { getCurrentUser } from "../services/authService";
import HeaderButton from "../components/HeaderButton";
import Color from "../constants/Color";
import { getUserInfo, updateUser } from "../services/userService";
import Card from "../components/common/Card";
import MainButton from "../components/MainButton";
import ImgPicker from "../components/ImagePicker";
import { Foundation, Entypo } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

class ProfileScreen extends React.Component {
  state = {
    user: "",
    _id: "",
    name: "",
    email: "",
    companyId: "",
    phone: "",
    password: "",
    profilePath: null,
    profilePicture: null,
    responsibilities: [],
    profilePictureBase64: "",
    selectedFile: "",
    isLoading: false
  };

  willFocusSub = "";

  handleImageTaken = async image => {
    if (!image.cancelled) {
      console.log("ok");
      this.setState({
        selectedFile: image.base64,
        profilePictureBase64: image.base64
      });
    }
  };

  componentWillUnmount() {
    this.willFocusSub.remove();
  }

  gettingAllData = async () => {
    this.setState({ isLoading: true });
    const user = await getCurrentUser();
    this.setState({ user });

    const { data } = await getUserInfo(user._id, user.role);
    this.setState({ isLoading: false });
    if (data.profilePicture) {
      const profilePictureBase64 = encode(data.profilePicture.data);
      this.setState({ profilePictureBase64 });
    }

    if (user.role === "assignee") {
      return this.setState({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyId: data.companyId,
        password: data.password,
        profilePath: data.profilePath,
        profilePicture: data.profilePicture,
        responsibilities: data.responsibilities
      });
    }
    this.setState({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyId: data.companyId,
      password: data.password,
      profilePath: data.profilePath,
      profilePicture: data.profilePicture
    });
  };

  handleRemoveProfilePicture = async () => {
    this.setState({
      profilePictureBase64: "",
      selectedFile: "",
      profilePath: ""
    });
  };

  // component did mount
  async componentDidMount() {
    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      this.gettingAllData
    );
    this.gettingAllData();
  }

  //handleProfileUpdate
  handleProfileUpdate = async () => {
    const {
      name,
      email,
      companyId,
      password,
      phone,
      profilePath,
      profilePicture,
      responsibilities,
      user
    } = this.state;

    if (name.length < 5) {
      return Alert.alert("Name must be atleast 5 characters long.");
    }
    if (password.length < 8) {
      return Alert.alert("Password must be atleast 8 characters long.");
    }
    if (phone.length < 9) {
      return Alert.alert("Phone must be atleast 9 characters long.");
    }

    let fd = "";
    fd = new FormData();

    if (this.state.user.role === "assignee") {
      fd.append("name", name);
      fd.append("email", email);
      fd.append("password", password);
      fd.append("phone", phone);
      fd.append("profilePath", profilePath);
      fd.append("responsibilities", responsibilities);
      fd.append("companyId", companyId);
      if (this.state.selectedFile) {
        console.log("in mobile first");
        fd.append("mobileFile", this.state.selectedFile);
      }

      try {
        this.setState({ isLoading: true });
        await updateUser(user._id, fd, "assignee");
        this.setState({ isLoading: false });
        this.props.navigation.navigate("Home");
      } catch (ex) {
        console.log(ex);
      }
      return;
    }

    fd.append("name", name);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("phone", phone);
    fd.append("profilePath", profilePath);
    fd.append("companyId", companyId);
    if (this.state.selectedFile) {
      fd.append("mobileFile", this.state.selectedFile);
    }
    try {
      this.setState({ isLoading: true });
      if (user.role === "complainer") {
        await updateUser(user._id, fd, "complainer");
      }
      if (user.role === "admin") {
        await updateUser(user._id, fd, "admin");
      }
      this.setState({ isLoading: false });
      this.props.navigation.navigate("Home");
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    const { user, isLoading, name, email, phone } = this.state;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.screen}>
          <View>
            <Card style={styles.cardContainer}>
              <View>
                {isLoading ? (
                  <ActivityIndicator color={Color.primaryColor} />
                ) : (
                  <View>
                    {user ? (
                      <View>
                        <View
                          style={{
                            height: 150,
                            marginTop: 20,
                            backgroundColor: "white",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center"
                          }}
                        >
                          <View>
                            {this.state.profilePictureBase64 ? (
                              <Image
                                source={{
                                  uri: `data:image/png;base64,${this.state.profilePictureBase64}`
                                }}
                                style={{
                                  height: 120,
                                  width: 120,
                                  borderRadius: 60
                                }}
                              />
                            ) : (
                              <Image
                                source={require("../assets/userprofile.jpg")}
                                style={{
                                  height: 120,
                                  width: 120,
                                  borderRadius: 60
                                }}
                              />
                            )}
                          </View>
                          <View>
                            <TouchableWithoutFeedback
                              onPress={this.handleRemoveProfilePicture}
                            >
                              <Entypo
                                name="circle-with-cross"
                                size={22}
                                color={Color.primaryColor}
                              />
                            </TouchableWithoutFeedback>
                            <ImgPicker onImageTaken={this.handleImageTaken}>
                              <View style={{ paddingVertical: 5 }}>
                                <Foundation
                                  name="pencil"
                                  size={22}
                                  color={Color.primaryColor}
                                />
                              </View>
                            </ImgPicker>
                          </View>
                        </View>
                        <TextInput
                          style={styles.input}
                          value={name}
                          onChangeText={text => this.setState({ name: text })}
                        />

                        <TextInput
                          style={styles.input}
                          value={email}
                          onChangeText={text => this.setState({ email: text })}
                        />

                        <TextInput
                          style={styles.input}
                          value={phone}
                          onChangeText={text => this.setState({ phone: text })}
                        />

                        <View style={{ marginVertical: 10 }}>
                          {user.role === "assignee" ? (
                            <View>
                              {this.state.responsibilities.length > 0 ? (
                                <View>
                                  <Text
                                    style={{ fontSize: 18, fontWeight: "600" }}
                                  >
                                    Assignee Responsibilities
                                  </Text>
                                  <ScrollView>
                                    {this.state.responsibilities.map(
                                      responsibility => (
                                        <View
                                          key={responsibility._id}
                                          style={{
                                            backgroundColor: "#f0f0f0",
                                            padding: 10,
                                            margin: 5,
                                            width: "100%"
                                          }}
                                        >
                                          <Text>{responsibility.name}</Text>
                                        </View>
                                      )
                                    )}
                                  </ScrollView>
                                </View>
                              ) : null}
                            </View>
                          ) : null}
                        </View>
                      </View>
                    ) : null}
                  </View>
                )}

                <MainButton
                  buttonContainer={{ backgroundColor: Color.primaryColor }}
                  onPress={this.handleProfileUpdate}
                >
                  Update
                </MainButton>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

ProfileScreen.navigationOptions = navData => {
  return {
    headerTitle: "Profile",
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
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e8e8e8"
    // justifyContent: "center",
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
  },
  image: {
    width: "100%",
    height: 100
  }
});

export default ProfileScreen;
