import React, { useState } from "react";
import { View, Text, Image, AsyncStorage } from "react-native";
// @ts-ignore
import { TextField, Button } from "react-native-ios-kit";

// @ts-ignore
import icon from "../assets/icon.png";
import firebase from "firebase";

// @ts-ignore
export default function Login({ route, navigation }) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  console.log(route.params);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        margin: 20,
      }}
    >
      <Image source={icon} style={{ margin: 20 }} />
      <TextField
        placeholder={"Email"}
        value={email}
        onValueChange={(text: string) => setemail(text)}
        textContentType={"emailAddress"}
      />
      <TextField
        placeholder={"Password"}
        value={password}
        onValueChange={(text: string) => setpassword(text)}
        textContentType={"password"}
        secureTextEntry
      />
      <View style={{ flex: 1, flexDirection: "row", alignContent: "center" }}>
        <Button
          inline
          rounded
          style={{ height: 50, margin: 20 }}
          innerStyle={{ fontSize: 24 }}
          onPress={() => {
            console.log(email, password);
            firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .then((res) => {
                if (res.user?.uid != null) {
                  console.log(res.user);
                  AsyncStorage.setItem("UID", res.user.uid);
                }
              });
          }}
        >
          Login
        </Button>
        <Button
          inline
          rounded
          style={{ height: 50, margin: 20 }}
          innerStyle={{ fontSize: 24 }}
          onPress={() => navigation.navigate("Register")}
        >
          Register
        </Button>
      </View>
    </View>
  );
}
