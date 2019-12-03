import React from "react";
import { WebView } from "react-native-webview";

class Webview extends React.Component {
  state = {};

  componentDidMount() {
    console.log(this.props.navigation.getParam("geolocation"));
  }

  render() {
    const latitude = this.props.navigation.getParam("geolocation").lat;
    const longitude = this.props.navigation.getParam("geolocation").lng;
    return (
      <WebView
        style={{ flex: 1, marginTop: 22 }}
        source={{
          uri: `https://www.google.com/maps/@${latitude},${longitude},15z`
        }}
        // onMessage={msg => console.log("onMsg", msg)}
        // onNavigationStateChange={navEvent => onNavState(navEvent)}
      />
    );
  }
}

export default Webview;
