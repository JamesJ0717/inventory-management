import React, { useEffect, useState } from "react";
import { AppRegistry, AsyncStorage, Button } from "react-native";
// @ts-ignore
import { DefaultTheme, ThemeProvider } from "react-native-ios-kit";
import { NavigationContainer, BaseRouter } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase";

import Home from "./Components/Home";
import ItemView from "./Components/ItemView";
import Scanner from "./Components/Scanner";
import Login from "./Components/Login";
import Register from "./Components/Register";

const theme = {
  ...DefaultTheme,
};

export default function App() {
  const Stack = createStackNavigator();
  const [UID, setUID] = useState<string | undefined>(undefined);

  const firebaseConfig = {
    apiKey: "AIzaSyCObo48py8sJC-78SFBQSaqKut5iqh6eRc",
    authDomain: "inventory-manager-6d6a3.firebaseapp.com",
    databaseURL: "https://inventory-manager-6d6a3.firebaseio.com",
    projectId: "inventory-manager-6d6a3",
    storageBucket: "inventory-manager-6d6a3.appspot.com",
  };

  if (!firebase.apps.length) {
    console.log(firebase.apps);

    console.log("Initialize");
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    let f = async () => {
      let uid = await AsyncStorage.getItem("UID");
      if (uid != null) setUID(uid);
    };
    f();
  });

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            safeAreaInsets: {
              top: 50,
              bottom: 50,
            },
            headerStyle: { backgroundColor: theme.barColor },
            headerTitleStyle: { fontSize: 30 },
          }}
        >
          {UID == undefined ? (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={(route) => ({
                  title: "Inventory Management",
                })}
              />
              <Stack.Screen
                name="Details"
                component={ItemView}
                /** @ts-ignore */
                options={({ route }) => ({ title: route.params.item.name })}
              />
              <Stack.Screen name="Scanner" component={Scanner} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

AppRegistry.registerComponent("stock-management", () => App);
