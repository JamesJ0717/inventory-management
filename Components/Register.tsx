import React, { useState } from "react";
import { View, Text, Image, AsyncStorage } from "react-native";
// @ts-ignore
import { TextField, Button } from "react-native-ios-kit";

// @ts-ignore
import icon from "../assets/icon.png";
import * as firebase from "firebase";

export default function Register() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

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
      <Button
        inline
        rounded
        style={{ height: 50, margin: 20 }}
        innerStyle={{ fontSize: 24 }}
        onPress={() => {
          console.log(email, password);
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
              console.log(res);
              if (res.user != null) AsyncStorage.setItem("UID", res.user.uid);
            });
        }}
      >
        Register
      </Button>
    </View>
  );
}
