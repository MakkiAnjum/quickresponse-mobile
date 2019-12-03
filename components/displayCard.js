import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";

import Card from "./common/Card";
import Color from "../constants/Color";

const DisplayCard = props => {
  return (
    <View style={styles.screen}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <View>
          <Ionicons name="ios-chatboxes" size={54} color={Color.primaryColor} />
        </View>
        <View>
          <Text style={{ fontWeight: "600", fontSize: 28, color: "#808080" }}>
            Complaints
          </Text>
        </View>
      </View>
      <Card
        style={{
          width: "80%",
          maxWidth: "80%",
          backgroundColor: "#16a28f"
        }}
        onPress={props.onPress}
      >
        {props.totalComplaints && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <View>
                <Text
                  style={{ fontWeight: "600", fontSize: 28, color: "white" }}
                >
                  {" "}
                  {props.totalComplaints.length > 0 ? (
                    <Text>{props.totalComplaints.length}</Text>
                  ) : (
                    <Text>0</Text>
                  )}{" "}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 20, color: "white" }}>
                  Total Complaints{" "}
                </Text>
              </View>
            </View>

            <View style={{ justifyContent: "flex-end", alignItems: "center" }}>
              <Entypo name="box" size={28} color="white" />
            </View>
          </View>
        )}
      </Card>
      <Card
        style={{
          width: "80%",
          maxWidth: "80%",
          backgroundColor: "#30839f",
          marginTop: 10
        }}
        onPress={props.onDelayedPress}
      >
        {props.delayed && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <View>
                <Text
                  style={{ fontWeight: "600", fontSize: 28, color: "white" }}
                >
                  {" "}
                  {props.delayed.length > 0 ? (
                    <Text>{props.delayed.length}</Text>
                  ) : (
                    <Text>0</Text>
                  )}{" "}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 20, color: "white" }}>
                  Delayed Complaints{" "}
                </Text>
              </View>
            </View>

            <View style={{ justifyContent: "flex-end", alignItems: "center" }}>
              <Feather name="pause-circle" size={28} color="white" />
            </View>
          </View>
        )}
      </Card>

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignContent: "space-between"
        }}
      >
        <Card
          style={{
            width: "40%",
            backgroundColor: "#b65599"
          }}
          onPress={props.onInProgressPress}
        >
          {props.inprogress && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <View>
                  <Text
                    style={{ fontWeight: "600", fontSize: 22, color: "white" }}
                  >
                    {" "}
                    {props.inprogress.length > 0 ? (
                      <Text>{props.inprogress.length}</Text>
                    ) : (
                      <Text>0</Text>
                    )}{" "}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: "white" }}>
                    In-Progress{" "}
                  </Text>
                </View>
              </View>

              <View
                style={{ justifyContent: "flex-end", alignItems: "center" }}
              >
                <Feather name="user-check" size={24} color="white" />
              </View>
            </View>
          )}
        </Card>
        <Card
          style={{
            width: "40%",
            marginLeft: 4,
            backgroundColor: "#009d00"
          }}
          onPress={props.onResolvedPress}
        >
          {props.resolved && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <View>
                  <Text
                    style={{ fontWeight: "600", fontSize: 22, color: "white" }}
                  >
                    {" "}
                    {props.resolved.length > 0 ? (
                      <Text>{props.resolved.length}</Text>
                    ) : (
                      <Text>0</Text>
                    )}{" "}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: "white" }}>
                    Resolved{" "}
                  </Text>
                </View>
              </View>

              <View
                style={{ justifyContent: "flex-end", alignItems: "center" }}
              >
                <Feather name="check-circle" size={24} color="white" />
              </View>
            </View>
          )}
        </Card>
      </View>

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignContent: "space-between"
        }}
      >
        {/* postitive complaints */}

        <Card
          style={{
            width: "40%",
            marginLeft: 4,
            backgroundColor: "green"
          }}
          onPress={props.onPositiveFeedbackPress}
        >
          {props.positiveFeedback && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <View>
                  <Text
                    style={{ fontWeight: "600", fontSize: 22, color: "white" }}
                  >
                    {" "}
                    {props.positiveFeedback.length > 0 ? (
                      <Text>{props.positiveFeedback.length}</Text>
                    ) : (
                      <Text>0</Text>
                    )}{" "}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: "white" }}>
                    PositiveFeedback{" "}
                  </Text>
                </View>
              </View>

              <View
                style={{ justifyContent: "flex-end", alignItems: "center" }}
              >
                <Feather name="thumbs-up" size={24} color="white" />
              </View>
            </View>
          )}
        </Card>
        {/* postitive complaints */}
        {/* negativeFeedback complaints */}

        <Card
          style={{
            width: "40%",
            marginLeft: 4,
            backgroundColor: "red"
          }}
          onPress={props.onNegativeFeedbackPress}
        >
          {props.negativeFeedback && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <View>
                  <Text
                    style={{ fontWeight: "600", fontSize: 22, color: "white" }}
                  >
                    {" "}
                    {props.negativeFeedback.length > 0 ? (
                      <Text>{props.negativeFeedback.length}</Text>
                    ) : (
                      <Text>0</Text>
                    )}{" "}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: "white" }}>
                    Negative Feedback{" "}
                  </Text>
                </View>
              </View>

              <View
                style={{ justifyContent: "flex-end", alignItems: "center" }}
              >
                <Feather name="thumbs-down" size={24} color="white" />
              </View>
            </View>
          )}
        </Card>
        {/* negativeFeedback complaints */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10
  }
});

export default DisplayCard;
