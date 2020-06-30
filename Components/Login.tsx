import React, { useState } from "react";
import { View, Text, Image, AsyncStorage, Alert } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import firebase from "firebase";
import color from "color";

// @ts-ignore
import { TextField, useTheme, Button } from "react-native-ios-kit";

// @ts-ignore
import icon from "../assets/icon.png";

// @ts-ignore
export default function Login({ route, navigation }) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  let loginWithApple = async () => {
    const csrf = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      state: csrf,
      nonce: hashedNonce,
    });

    const { identityToken } = appleCredential;

    if (identityToken) {
      const provider = new firebase.auth.OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });
      setLoading(true);

      await firebase
        .auth()
        .signInWithCredential(credential)
        .then(
          (result) => {
            if (result.user) {
              setLoading(false);
              Alert.alert("Successfully logged in!");
              AsyncStorage.setItem("UID", result.user.uid);
              route.params.setUID(result.user.uid);
            }
          },
          (err) => {
            if (err) console.error(err);
          }
        );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <Image source={icon} style={{ margin: 20, height: 256, width: 256 }} />
      <View style={{ flex: 1, padding: 20, alignSelf: "stretch" }}>
        <View style={{ padding: 10 }}>
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
        </View>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={5}
          style={{ height: 50, margin: 10 }}
          onPress={loginWithApple}
        />
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
                  console.log(res.user);
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
