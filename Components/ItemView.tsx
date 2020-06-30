import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Modal, StyleSheet } from "react-native";
import color from "color";

//@ts-expect-error
import { InfoRow, NavigationRow, useTheme, Button, Title1, TextField } from "react-native-ios-kit";
import { Item } from "../Models/Item";
import { useSafeArea } from "react-native-safe-area-context";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";

//@ts-expect-error
export default function ItemView({ route, navigation }) {
  const item: Item = route.params.item;

  const [modalVisible, setModalVisible] = useState(false);
  const [changed, setChanged] = useState(false);
  const [textChanged, setTextChanged] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [quantity, setQuantity] = useState(item.quantity);
  const [UID, setUID] = useState("");

  const theme = useTheme();
  const safeArea = useSafeArea();

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      borderRadius: 20,
      backgroundColor: color(theme.backgroundColor).lighten(0.5).string(),
      color: theme.textColor,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });

  let quantityButtons = () => {
    return (
      <>
        <View style={{ margin: 10 }}>
          <Title1 style={{ alignSelf: "center" }}>Quantity</Title1>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Button
              rounded
              inverted
              innerStyle={{ fontSize: 24 }}
              style={{ height: 50, margin: 20, width: "40%", backgroundColor: theme.primaryColor }}
              onPress={() => {
                setQuantity(--item.quantity);
                setChanged(true);
              }}
            >
              -
            </Button>
            <Button
              rounded
              inverted
              innerStyle={{ fontSize: 24 }}
              style={{ height: 50, margin: 20, width: "40%", backgroundColor: theme.primaryColor }}
              onPress={() => {
                setQuantity(++item.quantity);
                setChanged(true);
              }}
            >
              +
            </Button>
          </View>
        </View>
        {changed ? (
          <Button
            rounded
            inverted
            innerStyle={{ fontSize: 24 }}
            style={{ height: 50, margin: 20, backgroundColor: theme.primaryColor }}
            onPress={() => {
              item.quantity = quantity;
              if (item.quantity === 0)
                firebase.database().ref(`${UID}/items/${item.upc}`).remove().then(navigation.navigate("Home"));
              else
                firebase
                  .database()
                  .ref(`${UID}/items/${item.upc}`)
                  .update(item)
                  .then(() => setChanged(false));
            }}
          >
            Save Changes
          </Button>
        ) : (
          <></>
        )}
      </>
    );
  };

  let modal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Title1>{modalTitle}</Title1>
            <TextField
              multiline
              style={{ color: theme.textColor }}
              inputStyle={{}}
              onValueChange={(text: string) => {
                setModalText(text);
                setTextChanged(true);
              }}
            >
              {modalText}
            </TextField>
            {textChanged ? (
              <Button
                rounded
                inverted
                innerStyle={{ fontSize: 24 }}
                style={{ height: 50, margin: 20, backgroundColor: theme.primaryColor }}
                onPress={() => {
                  console.log(modalText, modalTitle);
                  switch (modalTitle.toLowerCase()) {
                    case "brand":
                      item.brand = modalText;
                      break;
                    case "description":
                      item.description = modalText;
                      break;
                    case "title":
                      item.title = modalText;
                      break;
                    default:
                      break;
                  }
                  firebase
                    .database()
                    .ref(`${UID}/items/${item.upc}`)
                    .update(item)
                    .then(() => {
                      setTextChanged(false);
                      setModalVisible(false);
                    });
                }}
              >
                Save Changes
              </Button>
            ) : (
              <></>
            )}
            <Button
              rounded
              inverted
              inline
              innerStyle={{ fontSize: 24 }}
              style={{ height: 50, margin: 20, backgroundColor: theme.primaryColor }}
              onPress={() => setModalVisible(false)}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    let f = async () => {
      await AsyncStorage.getItem("UID").then((res) => {
        if (res) setUID(res);
      });
    };
    f();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: theme.backgroundColor,
      }}
    >
      {item.images ? (
        <Image source={{ uri: item.images[0] }} style={{ height: 150, width: 150, alignSelf: "center", margin: 5 }} />
      ) : (
        <></>
      )}

      <View style={{ alignItems: "stretch", justifyContent: "space-between" }}>
        <NavigationRow
          title={"Brand"}
          info={item.brand}
          onPress={() => {
            setModalText(item.brand);
            setModalTitle("brand");
            setModalVisible(true);
          }}
        />

        <NavigationRow
          title={"Title"}
          info={item.title.substring(0, 15).concat("...")}
          onPress={() => {
            setModalText(item.title);
            setModalTitle("Title");
            setModalVisible(true);
          }}
        />
        <NavigationRow
          title={"Description"}
          info={item.description.substring(0, 15).concat("...")}
          onPress={() => {
            setModalText(item.description);
            setModalTitle("Description");
            setModalVisible(true);
          }}
        />
        {item.offers ? (
          <>
            <InfoRow title="Retailer" info={item.offers[0].merchant} />
            <InfoRow title="Price" info={`$${item.offers[0].price}`} />
          </>
        ) : (
          <></>
        )}
        <InfoRow title="Quantity" info={quantity.toString()} />
        <InfoRow title="UPC" info={item.upc} />

        {quantityButtons()}
        {modal()}
      </View>
      {changed ? <Button title="Save" onPress={() => console.log("save")} /> : <></>}
    </ScrollView>
  );
}
