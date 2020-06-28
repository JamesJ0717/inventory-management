import React, { useState } from "react";
import { View, Text, Image, ScrollView, Button, Modal, StyleSheet } from "react-native";

//@ts-expect-error
import { InfoRow, NavigationRow } from "react-native-ios-kit";
import { Item } from "../Models/Item";

//@ts-expect-error
export default function ItemView({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");

  const item: Item = route.params.item;

  return (
    <ScrollView style={{ padding: 20, flex: 1 }}>
      {item.images != undefined ? (
        <Image source={{ uri: item.images[0] }} style={{ height: 150, width: 150, alignSelf: "center" }} />
      ) : (
        <></>
      )}

      <View style={{ alignItems: "stretch", padding: 10 }}>
        <InfoRow title={"Brand"} info={item.brand} />
        {item.title.length > 15 ? (
          <NavigationRow
            title={"Title"}
            info={"".concat(item.title.substring(0, 25), "...")}
            onPress={() => {
              setModalText(item.title);
              setModalVisible(true);
            }}
          />
        ) : (
          <InfoRow title="Title" info={item.title} />
        )}
        {item.description.length > 15 ? (
          <NavigationRow
            title={"Description"}
            info={item.description.length < 1 ? "" : "".concat(item.description.substring(0, 25), "...")}
            onPress={() => {
              setModalText(item.description);
              setModalVisible(true);
            }}
          />
        ) : (
          <InfoRow title={"Description"} info={item.description} />
        )}
        <InfoRow title={"Quantity"} info={item.quantity} />
        <InfoRow title={"EAN"} info={item.ean} />
        <InfoRow title={"UPC"} info={item.upc} />
        <InfoRow title={"ELID"} info={item.elid} />

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
              <Text>{modalText}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
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
