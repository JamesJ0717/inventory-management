import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, AsyncStorage } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Axios from "axios";
import firebase from "firebase";
import { Item } from "../Models/Item";

// @ts-ignore
export default function Scanner({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [UID, setUID] = useState<string>();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      let uid = await AsyncStorage.getItem("UID");
      if (uid != null) setUID(uid);
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    if (!type.includes("QR"))
      Axios.get(`https://api.upcitemdb.com/prod/trial/lookup?upc=${data}`).then(async (res) => {
        if (res.data.items.length == 0) {
          return Alert.alert("Uh-oh!", "The item you scanned is not in the database!", [
            { text: "Ok", onPress: () => navigation.navigate("Home") },
          ]);
        } else {
          await firebase
            .database()
            .ref(`${UID}/items/`)
            .once("value", async (a) => {
              let item: Item = {
                ...res.data.items[0],
                quantity: 1,
              };
              if (a.hasChild(item.upc) == false) {
                await firebase
                  .database()
                  .ref(`${UID}/items/${item.upc}/`)
                  .set(item, (err: Error | null) => {
                    if (err) console.error(err);
                  });
                Alert.alert("Success", `${item.title} added`, [
                  { text: "OK", onPress: () => navigation.navigate("Home") },
                ]);
              } else {
                await firebase
                  .database()
                  .ref(`${UID}/items/`)
                  .child(item.upc)
                  .once("value", (res) => (item.quantity = res.toJSON()?.quantity));
                await firebase
                  .database()
                  .ref(`${UID}/items/${item.upc}/`)
                  .update(item, (err: Error | null) => {
                    if (err) console.error(err);
                  });
                Alert.alert("Success", `Quantity of ${item.title} increased`, [
                  { text: "OK", onPress: () => navigation.navigate("Home", { thing: "help" }) },
                ]);
              }
            });
        }
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <BarCodeScanner
        /** @ts-ignore */
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />}
    </View>
  );
}
