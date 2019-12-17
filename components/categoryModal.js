import React from "react";
import { Button, Modal, View, Text, Alert, StyleSheet } from "react-native";
import {
  getCategoriesWithNoParent,
  getChildsOf,
  getSiblingsOf
} from "../services/categoryService";
import { Card } from "react-native-elements";
import Color from "../constants/Color";
import MainButton from "./MainButton";
import { ActivityIndicator } from "react-native-paper";
// import Card from "./common/Card";

class CategoryModal extends React.Component {
  state = {
    categories: [],
    isLoading: false,
    isOpen: true,
    selectedCategory: ""
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const { data: categories } = await getCategoriesWithNoParent();

      this.setState({ categories });
      this.setState({ isLoading: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        return Alert.alert(ex.response.data);
      }
    }
  }

  // handle category go back
  handleGoBack = async () => {
    console.log(this.state.selectedCategory);
    try {
      this.setState({ isLoading: true });

      const { data: siblings } = await getSiblingsOf(
        this.state.selectedCategory
      );
      if (siblings && siblings[0]) this.setState({ categories: siblings });
      this.setState({ isLoading: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        Alert.alert("Something wrong.");
      }
    }
  };

  // handle on category selected
  handleClick = async categoryId => {
    this.setState({ selectedCategory: categoryId });
    console.log(categoryId);

    try {
      const { data: categories } = await getChildsOf(categoryId);
      console.log(categories);

      if (categories.length > 0) {
        this.setState({ categories });
        return;
      }

      this.props.onCategorySelection(categoryId);
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
          <Card title="Choose Category" style={styles.cardContainer}>
            {/* <View style={styles.container}> */}

            <View>
              {this.state.isLoading ? (
                <ActivityIndicator color={Color.primaryColor} />
              ) : (
                <View>
                  {this.state.categories.length > 0 && (
                    <View>
                      {this.state.categories.map(category => (
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

export default CategoryModal;
