import React, { Component } from "react";

import { View, Text, ActivityIndicator, Modal, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import { getAllCompanies } from "../services/companyService";
import Color from "../constants/Color";
import MainButton from "./MainButton";

class Companies extends Component {
  state = {
    companies: [],
    isLoading: false
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { data } = await getAllCompanies();
    this.setState({ companies: data, isLoading: false });
  }

  handleClick = companyId => {
    this.props.onCompanyChoosed(companyId);
  };

  render() {
    const { companies, isLoading } = this.state;
    const { visible, onModalClosed } = this.props;

    return (
      <Modal animationType="slide" visible={visible}>
        <View style={styles.container}>
          <Card title="Choose Company" style={styles.cardContainer}>
            <View>
              {isLoading ? (
                <ActivityIndicator color={Color.primaryColor} />
              ) : (
                <View>
                  {companies.length > 0 && (
                    <View>
                      {companies.map(company => (
                        <Text
                          style={styles.categoryDetail}
                          onPress={() => this.handleClick(company._id)}
                          key={company._id}
                        >
                          {company.name}
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
                    onPress={onModalClosed}
                  >
                    Close
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

export default Companies;
