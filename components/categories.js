import React, { Component } from "react";
import { View, Text } from "react-native";
import { getCategoriesWithNoParent } from "../services/categoryService";

class Categories extends Component {
  state = {
    categories: [],
    isLoading: true,
    isOpen: false
  };

  async componentDidMount() {
    const { data: categories } = await getCategoriesWithNoParent();

    this.setState({ categories });
    console.log(categories);
  }

  render() {
    return (
      <View>
        <Text>hye</Text>
      </View>
    );
  }
}

export default Categories;
