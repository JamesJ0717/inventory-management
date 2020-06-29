import React, { useState } from "react";
import { View, Text, Image, AsyncStorage } from "react-native";
// @ts-ignore
import { TextField, useTheme, Button } from "react-native-ios-kit";

// @ts-ignore
import icon from "../assets/icon.png";
import firebase from "firebase";
import color from "color";

// @ts-ignore
export default function Login({ route, navigation }) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <Image source={icon} style={{ margin: 20 }} />
      <TextField
        containerStyle={{ backgroundColor: color(theme.backgroundColor).lighten(0.5).string() }}
        placeholder={"Email"}
        value={email}
        onValueChange={(text: string) => setemail(text)}
        textContentType={"emailAddress"}
      />
      <TextField
        containerStyle={{ backgroundColor: color(theme.backgroundColor).lighten(0.5).string() }}
        placeholder={"Password"}
        value={password}
        onValueChange={(text: string) => setpassword(text)}
        textContentType={"password"}
        secureTextEntry
      />
      <View style={{ flex: 1, padding: 20, alignSelf: "stretch" }}>
        <Button
          rounded
          inverted
          innerStyle={{ fontSize: 24 }}
          style={{ height: 50, backgroundColor: theme.primaryColor, margin: 10 }}
          onPress={() => {
            console.log(email, password);
            firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .then((res) => {
                if (res.user?.uid != null) {
                  AsyncStorage.setItem("UID", res.user.uid);
                  route.params.setUID(res.user.uid);
                }
              });
          }}
        >
          Login
        </Button>
        <Button
          rounded
          inverted
          innerStyle={{ fontSize: 24 }}
          style={{ height: 50, backgroundColor: theme.primaryColor, margin: 10 }}
          onPress={() => navigation.navigate("Register")}
        >
          Register
        </Button>
      </View>
    </View>
  );
}
