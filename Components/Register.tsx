import React, { useState } from "react";
import { View, Text, Image, AsyncStorage } from "react-native";
// @ts-ignore
import { TextField, Button, useTheme } from "react-native-ios-kit";

// @ts-ignore
import icon from "../assets/icon.png";
import * as firebase from "firebase";
import color from "color";

export default function Register({ route }) {
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
      <View style={{ padding: 20, alignSelf: "stretch" }}>
        <Button
          inverted
          rounded
          style={{ height: 50, margin: 10 }}
          innerStyle={{ fontSize: 24 }}
          onPress={() => {
            console.log(email, password);
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then((res) => {
                console.log(res);
                if (res.user?.uid != null) {
                  AsyncStorage.setItem("UID", res.user.uid);
                  route.params.setUID(res.user.uid);
                }
              });
          }}
        >
          Register
        </Button>
      </View>
    </View>
  );
}
