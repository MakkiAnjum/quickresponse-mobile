import React from "react";
import {
  TextInput,
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  Picker,
  ActivityIndicator
} from "react-native";
import Card from "../components/common/Card";

import MainButton from "../components/MainButton";
import Color from "../constants/Color";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import {
  getCategories,
  getSentimentCategory,
  saveComplaint
} from "../services/complaintService";
import CategoryModal from "../components/categoryModal";
import ImgPicker from "../components/ImagePicker";
import LocationPicker from "../components/LocationPicker";
import { getCurrentUser } from "../services/authService";
import { getConfiguration } from "../services/configService";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getLocations } from "../services/locationService";
import LocationModal from "../components/locationModal";
import CameraImgPicker from "../components/CameraImagePicker";

class ComplaintFormScreen extends React.Component {
  state = {
    title: "",
    location: "",
    details: "",
    categoryId: "",
    locationId: "",
    longitude: "",
    latitude: "",
    selectedFile: null,
    categories: [],
    locations: [],
    sentimentCategory: "",

    selectedCategory: "",
    selectedLocation: "",
    openCategoryModal: false,
    openLocationModal: false,
    titleError: "",
    detailsError: "",
    locationError: "",
    categoryError: "",
    configToken: "",
    severity: "",
    isLoading: false
  };

  webFocusSubs = "";

  async componentDidMount() {
    this.getAllDetails();

    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      this.getAllDetails
    );
  }

  async componentWillUnmount() {
    this.willFocusSub.remove();
  }

  getAllDetails = async () => {
    const user = await getCurrentUser();
    const { data: config } = await getConfiguration(user.companyId);
    const { data: cateogories } = await getCategories();
    const { data: locations } = await getLocations();
    console.log("locations", locations);
    const selectedCategory = cateogories.find(cate => cate.name === "General");
    const selectedLocation = locations.find(cate => cate.name === "Other");

    this.setState({
      categories: cateogories,
      locations: locations,
      configToken: config,
      selectedCategory,
      selectedLocation,
      categoryId: selectedCategory._id,
      locationId: selectedLocation._id
    });
  };

  handleOnDetailsBlur = async () => {
    const details = { details: this.state.details };
    const { data: category } = await getSentimentCategory(details);

    this.setState({ sentimentCategory: category, categoryId: category._id });
  };

  openModal = () => {
    this.setState({ openCategoryModal: true });
  };

  openLocationModal = () => {
    this.setState({ openLocationModal: true });
  };

  doSubmit = async () => {
    const { title, details, location, categoryId, locationId } = this.state;
    if (!title || !details || !categoryId || !locationId) {
      return Alert.alert("Please fill all required inputs.");
    }
    if (this.state.configToken.isSeverity && !this.state.severity) {
      return Alert.alert("Please fill all required inputs.");
    }
    if (title.length < 5) {
      return Alert.alert("Title must be atleast 5 characters.");
    }

    if (details.length < 30) {
      return Alert.alert("Details must be atleast 30 characters.");
    }

    this.setState({ isLoading: true });
    const data = new FormData();
    data.append("title", this.state.title);
    data.append("details", this.state.details);
    data.append("location", this.state.location);
    data.append("categoryId", this.state.categoryId);
    data.append("locationId", this.state.locationId);
    data.append("latitude", this.state.latitude);
    data.append("longitude", this.state.longitude);
    if (this.state.configToken.isSeverity) {
      data.append("severity", this.state.severity);
    }

    if (this.state.selectedFile) {
      data.append("mobileFile", this.state.selectedFile.base64);
    }

    try {
      await saveComplaint(data);
      this.setState({ isLoading: true });
      Alert.alert("Complaint is successfully registered.");
    } catch (ex) {
      return Alert.alert(ex.response);
    }

    return this.props.navigation.navigate({ routeName: "Home" });
  };

  closeModal = () => {
    this.setState({
      openCategoryModal: !this.state.openCategoryModal
    });
  };

  closeLocationModal = () => {
    this.setState({
      openLocationModal: !this.state.openLocationModal
    });
  };

  handleImageTaken = async document => {
    if (!document.cancelled) this.setState({ selectedFile: document });
  };

  onCategorySelection = categoryId => {
    const categories = this.state.categories;
    const category = categories.find(c => c._id === categoryId);

    if (category) {
      this.setState({
        // sentimentCategory: category,
        selectedCategory: category,
        categoryId: categoryId
      });
    }
  };

  onLocationSelection = locationId => {
    const locations = this.state.locations;
    const location = locations.find(c => c._id === locationId);

    if (location) {
      this.setState({
        // sentimentCategory: category,
        selectedLocation: location,
        locationId: locationId
      });
    }
  };

  handleGPSLocationTaken = async position => {
    this.setState({
      latitude: position.coords.latitude + "",
      longitude: position.coords.longitude + ""
    });
  };

  render() {
    const {
      title,
      details,
      location,
      sentimentCategory,
      openCategoryModal,
      categoryId,
      isLoading
    } = this.state;

    return (
      <ScrollView style={styles.screen}>
        {isLoading ? (
          <View style={styles.spinner}>
            <ActivityIndicator color={Color.primaryColor} />
          </View>
        ) : (
          <View>
            {openCategoryModal && (
              <CategoryModal
                visible={openCategoryModal}
                closeModal={this.closeModal}
                onCategorySelection={this.onCategorySelection}
              />
            )}
            {this.openLocationModal && (
              <LocationModal
                visible={this.state.openLocationModal}
                closeModal={this.closeLocationModal}
                onLocationSelection={this.onLocationSelection}
              />
            )}
            <Card title="Register New Complaint" style={styles.cardContainer}>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Title *"
                  value={title}
                  onChangeText={text => this.setState({ title: text })}
                />

                <TextInput
                  placeholder="Details *"
                  style={styles.detailInput}
                  value={details}
                  onChangeText={text => this.setState({ details: text })}
                  multiline
                  onBlur={this.handleOnDetailsBlur}
                />

                {/* <View style={styles.categoryContainer}>
                  {sentimentCategory ? (
                    <View style={styles.categoryRow}>
                      <Text style={{ fontSize: 18 }}>
                        {sentimentCategory.name}{" "}
                      </Text>

                      <MaterialCommunityIcons
                        name="pencil"
                        size={15}
                        color="black"
                        onPress={this.openModal}
                      />
                    </View>
                  ) : (
                    <Text style={{ fontSize: 14, color: "#b0b0b0" }}>
                      Enter details for automatic selection of category
                    </Text>
                  )}
                </View> */}
                <View
                  style={{
                    marginVertical: 10,
                    borderColor: "#e4e4e4",
                    borderWidth: 0.5,
                    padding: 5,
                    borderRadius: 10
                  }}
                >
                  <Text style={{ color: "#a9a9a9" }}>Category</Text>
                  {this.state.selectedCategory ? (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={{ ...styles.categoryRow, marginVertical: 10 }}
                      onPress={this.openModal}
                    >
                      <Text style={{ fontSize: 18 }}>
                        {this.state.selectedCategory.name}{" "}
                      </Text>

                      <MaterialCommunityIcons
                        name="pencil"
                        size={15}
                        color="black"
                        onPress={this.openModal}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* location */}

                <View
                  style={{
                    marginVertical: 10,
                    borderColor: "#e4e4e4",
                    borderWidth: 0.5,
                    padding: 5,
                    borderRadius: 10
                  }}
                >
                  <Text style={{ color: "#a9a9a9" }}>Location</Text>
                  {this.state.selectedLocation ? (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={{ ...styles.categoryRow, marginVertical: 10 }}
                      onPress={this.openLocationModal}
                    >
                      <Text style={{ fontSize: 18 }}>
                        {this.state.selectedLocation.name}
                      </Text>

                      <MaterialCommunityIcons
                        name="pencil"
                        size={15}
                        color="black"
                        onPress={this.openLocationModal}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* location end */}

                {this.state.configToken.isSeverity ? (
                  <View
                    style={{
                      marginVertical: 10,
                      borderColor: "#e4e4e4",
                      borderWidth: 0.5,
                      padding: 5,
                      borderRadius: 10
                    }}
                  >
                    <Text style={{ color: "#a9a9a9" }}>Severity</Text>
                    <Picker
                      selectedValue={this.state.severity}
                      mode="dropdown"
                      // style={{ height: 50, width: 100 }}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ severity: itemValue })
                      }
                    >
                      {/* <Picker.Item
                        label="Choose Severity *"
                        value=""
                        enabled={false}
                      /> */}
                      <Picker.Item label="Low" value="1" />
                      <Picker.Item label="Medium" value="2" />
                      <Picker.Item label="High" value="3" />
                    </Picker>
                  </View>
                ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={location}
                  onChangeText={text => this.setState({ location: text })}
                />

                <LocationPicker onLocationTaken={this.handleGPSLocationTaken} />

                <View>
                  <ImgPicker onImageTaken={this.handleImageTaken}>
                    <MainButton
                      buttonContainer={{ backgroundColor: Color.primaryColor }}
                    >
                      Choose from Gallery {"  "}
                      <AntDesign name="picture" size={22} color="white" />
                    </MainButton>
                  </ImgPicker>

                  <CameraImgPicker onImageTaken={this.handleImageTaken}>
                    <MainButton
                      buttonContainer={{ backgroundColor: Color.accentColor }}
                    >
                      Take Photo {"  "}
                      <AntDesign name="camera" size={22} color="white" />
                    </MainButton>
                  </CameraImgPicker>
                </View>

                {/* <Picker /> */}

                <MainButton
                  onPress={this.doSubmit}
                  buttonContainer={{ backgroundColor: Color.primaryColor }}
                >
                  Register
                </MainButton>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#e4e4e4",
    flex: 1
    // justifyContent: "center"
  },
  spinner: {
    flex: 1
  },
  cardContainer: {
    backgroundColor: "white",
    shadowColor: "#e4e4e4",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    margin: 10
  },
  detailInput: {
    width: "100%",
    fontSize: 18,
    height: 100,
    borderColor: "#F0F0F0",
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
    borderRadius: 7
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
  },
  categoryContainer: {
    paddingVertical: 5,
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
    marginVertical: 10
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  image: {
    width: "100%",
    height: 100,
    opacity: 0.5
  }
});

export default ComplaintFormScreen;
