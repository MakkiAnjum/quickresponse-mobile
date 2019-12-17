import React from "react";
import { Button, Modal, View, Text, Alert, StyleSheet } from "react-native";

import {
  getlocationsWithNoParent,
  getChildsOf,
  getSiblingsOf
} from "../services/locationService";

import { Card } from "react-native-elements";
import Color from "../constants/Color";
import MainButton from "./MainButton";
import { ActivityIndicator } from "react-native-paper";
// import Card from "./common/Card";

class LocationModal extends React.Component {
  state = {
    locations: [],
    isLoading: false,
    isOpen: true,
    selectedLocation: ""
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const { data: locations } = await getlocationsWithNoParent();

      this.setState({ locations });
      this.setState({ isLoading: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        return Alert.alert(ex.response.data);
      }
    }
  }

  // handle category go back
  handleGoBack = async () => {
    console.log(this.state.selectedLocation);
    this.setState({ isLoading: true });
    try {
      const { data: siblings } = await getSiblingsOf(
        this.state.selectedLocation
      );
      console.log("siblings", siblings);
      if (siblings && siblings[0]) this.setState({ locations: siblings });
      this.setState({ isLoading: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        Alert.alert("Something wrong.");
      }
    }
  };

  // handle on category selected
  handleClick = async locationId => {
    this.setState({ selectedLocation: locationId });
    console.log(locationId);
    try {
      const { data: locations } = await getChildsOf(locationId);
      console.log(locations);

      if (locations.length > 0) {
        this.setState({ locations });
        return;
      }

      //   this.props.onCategorySelection(locationId);
      this.props.onLocationSelection(locationId);
      return this.props.closeModal();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        return Alert.alert(ex.response.data);
      }
    }
  };

  render() {
    const { visible, closeModal } = this.props;
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Card title="Choose Location" style={styles.cardContainer}>
            {/* <View style={styles.container}> */}
            <View>
              {this.state.isLoading ? (
                <ActivityIndicator color={Color.primaryColor} />
              ) : (
                <View>
                  {this.state.locations.length > 0 && (
                    <View>
                      {this.state.locations.map(category => (
                        <Text
                          style={styles.categoryDetail}
                          onPress={() => this.handleClick(category._id)}
                          key={category._id}
                        >
                          {category.name}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                <View style={{ marginRight: 5 }}>
                  <MainButton
                    buttonContainer={{ backgroundColor: Color.primaryColor }}
                    onPress={closeModal}
                  >
                    Close
                  </MainButton>
                </View>
                <View>
                  <MainButton
                    buttonContainer={{ backgroundColor: Color.accentColor }}
                    onPress={this.handleGoBack}
                  >
                    Go Back
                  </MainButton>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // justifyContent: "center",
    // alignItems: "center"
  },

  categoryDetail: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#16a28f",
    borderWidth: 1,
    marginVertical: 10,
    borderColor: "#808080",
    // width: "40%",
    color: "white",
    borderRadius: 5
  },
  cardContainer: {
    // justifyContent: "center",
    // alignItems: "center",
    margin: 15,
    backgroundColor: "white",
    shadowColor: "#e4e4e4",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10
  }
});

export default LocationModal;
