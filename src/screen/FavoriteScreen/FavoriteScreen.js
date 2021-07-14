import React, { Component } from "react";
import {
  Button, View, Text, Image, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator, List, ListItem, ListView, Alert,
  FlatList, ScrollView, Platform, TextInput, Picker, BackHandler
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Container } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { SearchBar, Badge, Icon } from 'react-native-elements';
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
import api from '../../config/OdooConnect'; class FavoriteScreen extends Component {

  constructor() {
    super();
    this.state = {
      cartLists: [],
      qty: 0,
      isLoading: false,
      productIDS: []
    }
  }
  componentDidMount = () => {
    AsyncStorage.getItem('favorite_IDS').then((value) => {
      console.log("favorite_IDS>>>", value);
      this.setState({
        productIDS: JSON.parse(value)
      });
      this.getCartLists(value);
    });
  };
  getItemsCount = () => {
    console.log('<<<<<<Fav Screen>>>>>');
    AsyncStorage.getItem('favorite_IDS').then((value) => {
      console.log("favorite_IDS>>>", value);
      if (value === null) {
        this.setState({
          cartLists: []
        });
        this.getCartLists(value);
      } else {
        this.getCartLists(value);
      }
    });
  }

  addtoCart = async (proData) => {
    Toast.show('Added to Cart');
    this.state.productIDS.push(proData.id);
    AsyncStorage.setItem('product_IDS', JSON.stringify(this.state.productIDS));

    AsyncStorage.getItem('product_IDS').then((value) => {

      this.props.navigation.setParams({
        count: JSON.parse(value).length
      });
    })
  }
  getCartLists(value) {
    console.log("favorite_IDS>>>", value);
    if (value === null) {

    } else {
      this.setState({ isLoading: true });
      var params = {
        ids: JSON.parse(value),
        fields: ["id", "qty_available", "lst_price", "image_small", "name"],
        limit: 0,
        sort: ''
      }

      return api.get_read('product.product', params)
        .then(response => {
          this.setState({ isLoading: false });
          console.log('response>>>', response);
          response.data.map((itm) => {
            itm.quantity = 0;
          })
          this.setState({
            cartLists: response.data
          });
        },
        )
        .catch(err => console.log(err))
    }


  }
  increaseQty = (crtList, idx) => {
    crtList.map((itm, index) => {
      if (index === idx) {
        itm.quantity = itm.quantity + 1;
      }
    })
    this.setState({
      cartLists: crtList
    });
  }
  decreaseQty = (crtList, idx) => {
    crtList.map((itm, index) => {
      if (index === idx) {
        if (itm.quantity >= 0) {
          itm.quantity = itm.quantity - 1;
        } else if (itm.quantity < 0) {
          itm.quantity = 0;
        }
      }
    })
    this.setState({
      cartLists: crtList
    });
  }
  render() {
    const { isLoading } = this.state;
    return (
      <Container style={styles.container}>
        <NavigationEvents
          onDidFocus={() => {
            this.getItemsCount()
          }}
        />
        <View style={mainDivStyle}>
          {this.state.cartLists.map((proData, index) => {
            return <TouchableOpacity style={subElStyle} onPress={
              () => {
                this.props.navigation.navigate("ProductDetail", { prductID: proData.id });
              }
            }>
              <View style={styles.productMain}>
                <View style={{ width: "30%", height: 140, }}>
                  <Image style={{ width: "80%", zIndex: -1, height: "80%", resizeMode: "contain", borderRadius: 5 }}
                    source={{ uri: 'data:image/jpeg;base64,' + proData.image_small }} />
                </View>
                <View style={{ justifyContent: "space-around", alignContent: "center", width: "55%", marginLeft: 20, marginBottom: 10, marginTop: 10, }}>
                  <View style={{ overFlow: "hidden" }}>
                    <Text numberOfLines={1} style={styles.text}>{proData.name}</Text>
                  </View>
                  <Text style={styles.text}>Price : {proData.lst_price}</Text>
                  <Text style={{ color: "#666666" }}>On hand: {proData.qty_available} Unit(s)</Text>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 5,
                      width: 115,
                      backgroundColor: "white",
                      borderRadius: 3,
                      borderColor: "#5ecc71",
                      borderWidth: 1,
                    }}
                      onPress={() => {
                        this.addtoCart(proData);
                      }}>
                      <Text style={{ color: "#5ecc71", fontWeight: "bold" }}>Add to Cart</Text>
                    </TouchableOpacity>

                  </View>
                </View>

              </View>
            </TouchableOpacity>
          })}
        </View>
        <View>
          {isLoading ? (
            <View style={[styles.Loadcontainer, styles.horizontal]}>
              <Text style={{
                fontFamily: "halfmoon_bold",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 10,
                color: "#5ecc71",
              }}>Loading...</Text>
              <ActivityIndicator size="large" color="#5ecc71" />
            </View>
          ) : (
              <View>
                {this.state.cartLists.length === 0 ? (
                  <View style={styles.loadText}>
                    <Text style={{
                      fontFamily: "halfmoon_bold",
                      fontSize: 20,
                      fontWeight: "bold",
                      marginTop: 20,
                      color: "#5ecc71",
                    }}>No Data Found</Text>
                  </View>
                ) : (
                    <View>

                    </View>

                  )}
              </View>

            )}
        </View>
      </Container>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems,
    itemsCount: state.itemsCount,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (itemData) => {
      console.log('itemData>>>', itemData);
      dispatch({
        type: "ADD_TO_CART",
        item: itemData
      });
    },
    addToWishList: (itemData) => {
      dispatch({
        type: "ADD_TO_WISH_LIST",
        item: itemData
      });
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(FavoriteScreen);
const mainDivStyle = { margin: 1, marginTop: 2, padding: 4, marginBottom: 2, }
const subElStyle = {
  elevation: 0.5, shadowOffset: {}, backgroundColor: 'white', shadowOpacity: 123, shadowRadius: 8, marginBottom: 5, borderRadius: 8,
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
  },
  searchcontainer: {
    backgroundColor: 'white',
    borderWidth: 0, //no effect
    shadowColor: 'white', //no effect
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },
  imageStyle: {
    position: 'relative',
    margin: 100,
    flex: 1,
    resizeMode: 'contain'
  },

  main: {
    flex: 1,
    padding: 10,

  },
  bookMain: {
    marginTop: 10,
    width: "100%",
    height: 500,
    borderColor: "black", borderWidth: 1,
    borderRadius: 5
  },
  productMain: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5
  },
  text: {
    color: "black",
    fontFamily: "halfmoon_bold",
    fontSize: 15,
    fontWeight: "bold",
    overflow: "hidden",
    width: "100%",
  },
  loadText: {
    fontFamily: "halfmoon_bold",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: "#5ecc71",
  },
  Loadcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

})
