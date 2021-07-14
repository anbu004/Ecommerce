import React, { Component } from "react";
import {
  Button, View, Text, Image, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator, List, ListItem, ListView,
  FlatList, ScrollView, Platform, TextInput, Picker
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Container } from 'native-base';
import api from '../../config/OdooConnect';
import Toast from 'react-native-simple-toast';
import { SearchBar, Badge, Icon } from 'react-native-elements';
import { connect } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MyHeaderButton } from "../../Component/Common/MyHeaderButton";
import { AsyncStorage } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

class Product extends Component {
  constructor() {
    super();
    this.state = {
      sub_head_name: "",
      sub_head_list: [],
      productLists: [],
      search: '',
      isLoading: false,
      productIDS: [],
      productCount: 0,
      favoriteIDS: []
    }
    console.log("here");
  }
  static navigationOptions = ({ navigation }) => {
    console.log("sssss");
    return {
      headerRight: <View style={{ flexDirection: "row" }}>


        <View>
          <Badge value={navigation.getParam("count")} status="success"
            containerStyle={{ position: 'absolute', top: 0, right: 2, zIndex: 999 }}
          />
          <HeaderButtons HeaderButtonComponent={MyHeaderButton}>
            <Icon name="shopping-cart" color={'white'} />
          </HeaderButtons>

        </View>
      </View>
    };
  };



  componentDidMount = () => {
    console.log('<<<<<<Product Screen>>>>>');
    this.onLoginPress();
    this.getItemsCount();

  }

  getItemsCount = () => {
    var count;
    AsyncStorage.getItem('product_IDS').then((value) => {
      console.log('<<<value>>', value);
      if (value === null) {
        count = 0;
        this.state.productIDS = [];
      } else {
        count = JSON.parse(value).length;
        this.setState({
          productIDS: JSON.parse(value)
        });
      }
      this.props.navigation.setParams({
        count: count
      });
    });
  }







  updateSearch = (search) => {
    console.log('search>>>', search);
    if (search !== "") {
      this.setState({ search });
      var data = [];
      data = this.state.productLists;
      var searchText = search.trim().toLowerCase();
      data = data.filter(l => {
        return l.name.toLowerCase().match(searchText);
      });
      this.setState({
        productLists: data
      });
    } else {
      this.getProductLists();
      this.state.search = '';
    }
  };
  onLoginPress() {
    this.setState({ isLoading: true });
    return api.userLoginApi('admin', 'q9qq31').then(res => {
      this.getProductLists();
      // this.getItemsCount();
    }).catch(err => {
      Toast.show('Please Enter valid Username and Password');
    });
  }
  getProductLists() {
    this.setState({ isLoading: true });
    const params = {
      domain: [["sale_ok", "=", true]],
      fields: ["id", "qty_available", "lst_price", "image_small", "name"],
      limit: '',
      sort: '',
    };
    return api.searchRead('product.product', params).then(res => {
      this.setState({ isLoading: false });
      this.setState({
        productLists: res.data
      });
    });
  }
  goToPostPage = (scr) => {
    this.props.navigation.navigate(scr)
  };
  addtoFav = (proData) => {
    Toast.show('Added to Favorite');
    this.state.favoriteIDS.push(proData.id);
    AsyncStorage.setItem('favorite_IDS', JSON.stringify(this.state.favoriteIDS));
  }

  addtoCart = async (proData) => {
    Toast.show('Added to Cart');
    this.state.productIDS.push(proData.id);
    this.props.addToCart(this.state.productIDS);
    AsyncStorage.setItem('product_IDS', JSON.stringify(this.state.productIDS));

    AsyncStorage.getItem('product_IDS').then((value) => {

      this.props.navigation.setParams({
        count: JSON.parse(value).length
      });
    })
    // this.props.addToCart(proData);
    // this.getItemsCount();
    // var reqData = {
    //   "partner_id": 3,
    //   "partner_invoice_id": 3,
    //   "partner_shipping_id": 3,
    //   "order_line": [[
    //     0,
    //     "virtual_384", {
    //       "product_id": proData.id,
    //       "name": proData.name,
    //     }
    //   ]],
    // };
    // var params = {
    //   "args": [reqData],
    //   "model": "sale.order",
    //   "method": "create",
    //   "kwargs": {},
    //   // stage_id: 1
    // }
    // console.log('reqData>>>>>', JSON.stringify(params));
    // return api.callRPCmethod(params).then(res => {
    //   console.log('res>>>>>', res);
    // })
  };

  render() {
    const { search, isLoading } = this.state;

    return (

      <Container style={styles.container}>
        <SearchBar
          lightTheme
          inputContainerStyle={{ backgroundColor: 'white', }}
          inputStyle={{ margin: 0, backgroundColor: '#f7f7f7', color: '#5ecc71' }}
          containerStyle={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 5 }}
          onChangeText={this.updateSearch}
          value={search}
        />
        <ScrollView>
          <NavigationEvents
            onDidFocus={() => {
              this.getItemsCount()
            }}
          />
          <View style={mainDivStyle}>
            {this.state.productLists.map((proData, index) => {
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
                  <View>
                    <TouchableOpacity onPress={() => {
                      this.addtoFav(proData);
                    }}>
                      <FontAwesome name="heart" size={20} color="#FF543C" backgroundColor='#FF543C' style={{ marginRight: 15, marginTop: 15 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            })}
          </View>
          <View>
            {isLoading ? (
              <View style={[styles.Loadcontainer, styles.horizontal]}>
                <Text style={styles.loadText}>Loading...</Text>
                <ActivityIndicator size="large" color="#5ecc71" />
              </View>
            ) : (
                <View>
                  {this.state.productLists.length === 0 ? (
                    <View style={styles.loadText}>
                      <Text style={styles.loadText}>No Data Found</Text>
                    </View>
                  ) : (
                      <Text></Text>

                    )}
                </View>

              )}
          </View>

        </ScrollView>
      </Container>

    );
  }
}

const mapStateToProps = (state) => {
  return {
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
export default connect(mapStateToProps, mapDispatchToProps)(Product);
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
  Loadcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadText: {
    fontFamily: "halfmoon_bold",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: "#5ecc71",
  }

})