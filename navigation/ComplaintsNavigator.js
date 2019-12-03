import React from "react";
import {
  createStackNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  createAppContainer,
  DrawerItems
} from "react-navigation";

import {
  View,
  Platform,
  Text,
  Image,
  SafeAreaView,
  ScrollView
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  SimpleLineIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import Colors from "../constants/Color";
import ComplaintScreen from "../screens/ComplaintScreen";
import ComplaintDetailScreen from "../screens/ComplaintDetailScreen";
import ComplaintFeedback from "../screens/ComplaintFeedback";
import ComplaintFormScreen from "../screens/FormScreen";
import ChatScreen from "../screens/ChatScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/Profile";
import AuthScreen from "../screens/AuthScreen";
import Logout from "../screens/logout";
import SpamComplaintScreen from "../screens/SpamComplaintScreen";
import MessageScreen from "../screens/MessageScreen";
import NewComplainerScreen from "../screens/NewComplainerScreen";
import Webview from "../screens/WebView";
import NotificationScreen from "../screens/NotificationScreen";
import ResetPassword from "../screens/ResetPasswordScreen";
import RecoverPasswordScreen from "../screens/RecoverPasswordScreen";

const defaultOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primaryColor : ""
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primaryColor,
  headerTitleStyle: {
    fontFamily: "open-sans",
    textAlign: "center",
    alignSelf: "center"
  }
};

const ComplaintsNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerTitle: "Home"
      }
    },
    NewComplaint: {
      screen: ComplaintFormScreen,
      navigationOptions: {
        headerTitle: "New Complaint"
      }
    },

    Complaints: {
      screen: ComplaintScreen
    },

    Spam: {
      screen: SpamComplaintScreen
    },

    ComplaintDetail: {
      screen: ComplaintDetailScreen
    },

    Chat: {
      screen: ChatScreen
      // navigationOptions: {
      //   tabBarVisible: false
      // }
    },

    Feedback: {
      screen: ComplaintFeedback
    },

    Webview: {
      screen: Webview
    }
  },
  {
    defaultNavigationOptions: defaultOptions
  }
);

// const

const ProfileNavigator = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen
    }
  },
  {
    defaultNavigationOptions: defaultOptions
  }
);

const MessagesNavigator = createStackNavigator(
  {
    Messages: {
      screen: MessageScreen
    }
  },
  {
    defaultNavigationOptions: defaultOptions
  }
);

const NotificationNavigator = createStackNavigator(
  {
    Notification: {
      screen: NotificationScreen
    }
  },
  {
    defaultNavigationOptions: defaultOptions
  }
);

const CustomeDrawerComponent = props => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          height: 150,
          marginTop: 50,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={require("../assets/logo.jpg")}
          style={{ height: 120, width: 120, borderRadius: 60 }}
        />
      </View>
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    </SafeAreaView>
  );
};

const ResetPasswordNavigator = createStackNavigator(
  {
    Reset: {
      screen: ResetPassword
    }
  },
  {
    defaultNavigationOptions: defaultOptions
  }
);

const MainNavigator = createDrawerNavigator(
  {
    Home: {
      screen: ComplaintsNavigator,
      navigationOptions: {
        drawerLabel: "Home",
        drawerIcon: ({ tintColor }) => (
          <Ionicons name="md-home" size={24} color={Colors.primaryColor} />
        )
      }
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        drawerLabel: "Profile",
        drawerIcon: ({ tintColor }) => (
          <FontAwesome name="user" size={24} color={Colors.primaryColor} />
        )
      }
    },
    ResetPassword: {
      screen: ResetPasswordNavigator,
      navigationOptions: {
        drawerLabel: "Reset Password",
        drawerIcon: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="lock-reset"
            size={24}
            color={Colors.primaryColor}
          />
        )
      }
    },
    Logout: {
      screen: Logout,
      navigationOptions: {
        drawerLabel: "Logout",
        drawerIcon: ({ tintColor }) => (
          <SimpleLineIcons
            name="logout"
            size={24}
            color={Colors.primaryColor}
          />
        )
      }
    }
    // Messages: MessagesNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.accentColor,
      labelStyle: {
        fontFamily: "open-sans-bold"
      }
    },
    contentComponent: CustomeDrawerComponent
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: { screen: AuthScreen },
    Recoverpassword: {
      screen: RecoverPasswordScreen,
      navigationOptions: {
        headerTitle: "Recover Your Password"
      }
    }
  },
  {
    defaultNavigationOptions: defaultOptions
  }
);

const NewComplainerNavigator = createStackNavigator(
  {
    NewComplainer: NewComplainerScreen
  },
  {
    defaultNavigationOptions: defaultOptions
  }
);

const nav = createSwitchNavigator({
  Auth: AuthNavigator,
  NewComplainer: NewComplainerNavigator,
  Complaint: MainNavigator
});

const tabScreenConfig = {
  Main: {
    screen: nav,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Ionicons name="md-home" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primaryColor
    }
  },
  Messages: {
    screen: MessagesNavigator,
    navigationOptions: navData => {
      // console.log(navData);
      return {
        tabBarIcon: tabInfo => {
          return (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Ionicons
                name="ios-chatboxes"
                size={25}
                color={tabInfo.tintColor}
              />
              {/* <Text
                style={{
                  color: "white",
                  paddingHorizontal: 5,
                  paddingBottom: 10,
                  fontWeight: "600"
                }}
              >
                1
              </Text> */}
            </View>
          );
        },
        tabBarColor: Colors.primaryColor
      };
    }
  },
  Notification: {
    screen: NotificationNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return (
          <Ionicons
            name="md-notifications"
            size={25}
            color={tabInfo.tintColor}
          />
        );
      },
      tabBarColor: Colors.primaryColor
    }
  }
};

const TabNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeTintColor: Colors.primaryColor,
        shifting: true
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          activeTintColor: Colors.primaryColor
        }
      });

export default createAppContainer(TabNavigator);
