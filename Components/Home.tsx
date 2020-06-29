import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, AsyncStorage, ScrollView, RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// @ts-ignore
import { useTheme, NavigationRow, Button, Icon, SearchBar } from "react-native-ios-kit";
import { useSafeArea } from "react-native-safe-area-context";
import firebase from "firebase";

import { Item } from "../Models/Item";

//@ts-ignore
export default function Home({ route, navigation }) {
  const [items, setitems] = useState<Item[]>([]);
  const [search, setsearch] = useState<Item[]>([]);
  const [text, settext] = useState("");
  const [UID, setUID] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const theme = useTheme();
  const safeArea = useSafeArea();

  let f = async () => {
    const uid = await AsyncStorage.getItem("UID");
    if (uid != null) setUID(uid);
    firebase
      .database()
      .ref(`${UID}/items`)
      .once("value")
      .then((res) => {
        let tmp: Item[] = [];
        res.forEach((item) => {
          // @ts-ignore
          tmp.push(item.toJSON());
        });

        setitems(tmp);
        setsearch(tmp);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      f();
    }, 500);
  };

  useEffect(() => {
    f();
  }, [items]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "stretch",
        backgroundColor: theme.backgroundColor,
        paddingBottom: safeArea.bottom,
      }}
    >
      <SearchBar
        withCancel
        animated
        value={text}
        onValueChange={(text: string) => {
          settext(text);
          let localItems = search.filter((item) => {
            let name = item.title.toUpperCase();
            console.log(name);
            return name.indexOf(text.toUpperCase()) > -1;
          });

          setitems(localItems);
        }}
      ></SearchBar>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={items}
        renderItem={({ item }) => (
          <NavigationRow
            title={item.title}
            subtitle={`Quantity: ${item.quantity}`}
            onPress={() => navigation.navigate("Details", { item: item })}
            key={item.upc}
          />
        )}
        keyExtractor={(item) => item.upc}
        contentContainerStyle={{
          paddingBottom: safeArea.bottom,
          alignItems: "stretch",
        }}
      />

      <Button
        rounded
        inverted
        centered
        innerStyle={{ fontSize: 24 }}
        style={{ height: 50, margin: 20, width: "90%", backgroundColor: theme.primaryColor }}
        onPress={() => navigation.navigate("Scanner")}
      >
        Add Item
      </Button>
    </View>
  );
}
