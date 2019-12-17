import React, { useState } from "react";
// import Toast from "react-native-simple-toast";
import {
  View,
  Alert,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import Color from "../constants/Color";
import { giveFeedback } from "../services/complaintService";
import { Card } from "react-native-elements";
import MainButton from "../components/MainButton";

const ComplaintFeedback = props => {
  const [feedbackRemarks, setFeedbackRemarks] = useState("");
  const [feedbackTags, setFeedbackTags] = useState("");
  const [selectedIndex, setSelectedIndex] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const buttons = ["satisfied", "not satisfied"];

  updateSelectedIndex = selectedIndex => {
    setSelectedIndex(selectedIndex);
    if (selectedIndex === 0) {
      setFeedbackTags("satisfied");
    } else if (selectedIndex === 1) {
      setFeedbackTags("not satisfied");
    }
  };

  handleFeedbackRemarks = text => {
    setFeedbackRemarks(text);
  };

  submitFeedback = async () => {
    if (!feedbackRemarks || !feedbackTags) {
      return Alert.alert("Please complete your feedback.");
    }

    if (feedbackRemarks.length < 5) {
      return Alert.alert("Feedback must be atleast 5 characters long.");
    }

    const complaintId = props.navigation.getParam("complaintId");
    const data = {
      feedbackRemarks: feedbackRemarks,
      feedbackTags: feedbackTags
    };

    setIsLoading(true);
    await giveFeedback(complaintId, data);
    setIsLoading(false);
    // Toast.show("Thankyou for your feedback", Toast.LONG);
    return props.navigation.navigate("Complaints");
  };

  return (
    <View style={{ margin: 10 }}>
      <Card title="Please Give your feedback" style={styles.cardContainer}>
        <View>
          {isLoading ? <ActivityIndicator color={Color.primaryColor} /> : null}
          <TextInput
            placeholder="Remarks"
            style={styles.input}
            value={feedbackRemarks}
            onChangeText={handleFeedbackRemarks}
            multiline
          />
          <View style={{ marginTop: 5 }}>
            <ButtonGroup
              buttons={buttons}
              onPress={updateSelectedIndex}
              selectedIndex={selectedIndex}
            />
          </View>

          <View style={{ marginVertical: 5 }}>
            <MainButton
              buttonContainer={{ backgroundColor: Color.primaryColor }}
              onPress={submitFeedback}
            >
              Submit
            </MainButton>
          </View>
        </View>
      </Card>
    </View>
  );
};

ComplaintFeedback.navigationOptions = {
  headerTitle: "New Feedback"
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 5,
    backgroundColor: "white",
    shadowColor: "#e4e4e4",
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 0.7,
    shadowRadius: 10
  },

  input: {
    width: "100%",
    height: 100,
    borderColor: "#e4e4e4",
    borderWidth: 1,
    padding: 1,
    marginBottom: 10
  }
});

export default ComplaintFeedback;
