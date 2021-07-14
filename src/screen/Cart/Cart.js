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
import api from '../../config/OdooConnect';
class Cart extends Component {

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
        AsyncStorage.getItem('product_IDS').then((value) => {
            this.setState({
                productIDS: JSON.parse(value)
            });
            console.log("componentDidMount>>>", JSON.parse(value));
            this.getCartLists(value);
        });

        let Items = this.props.cartItems.cartItems.map(
            (item) => {
                return item
            }
        );
        console.log("PROP>>>", Items);
    };
    getItemsCount = () => {
        console.log('<<<<<<Cart Screen>>>>>');
        AsyncStorage.getItem('product_IDS').then((value) => {
            this.setState({
                productIDS: JSON.parse(value)
            });
        });
        AsyncStorage.getItem('product_IDS').then((value) => {
            if (value === null) {
                this.setState({
                    cartLists: [],
                    productIDS: [],
                });
                this.getCartLists(value);
            } else {
                this.getCartLists(value);
                this.setState({
                    productIDS: JSON.parse(value)
                });
            }
        });
    }
    addtoCart = async (proData) => {
        Toast.show('Added to Cart');
        this.state.productIDS.push(proData.id);
        this.props.addToCart(this.state.productIDS);
        AsyncStorage.setItem('product_IDS', JSON.stringify(this.state.productIDS));
    }
    orderPlaced = () => {
        AsyncStorage.removeItem('product_IDS');
        this.getItemsCount();
    }
    getCartLists(value) {
        console.log("v>>alue>>>", JSON.parse(value));
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
    deleteCart = (cartData) => {
        console.log("IDDDD>>", cartData.id);
        var index = this.state.productIDS.indexOf(cartData.id);
        this.state.productIDS.splice(index, 1);
        this.setState({
            cartLists: this.state.productIDS
        });
        console.log("kkk---", this.state.productIDS);
        AsyncStorage.setItem('product_IDS', JSON.stringify(this.state.productIDS));
        var cartindex = this.state.cartLists.findIndex(x => x.id === cartData.id);
        this.state.cartLists.splice(cartindex, 1);
        console.log(this.state.cartLists.length);
        this.setState({
            cartLists: this.state.cartLists
        });
        AsyncStorage.getItem('product_IDS').then((value) => {
            console.log("jjj---", value);
        })
    }
    render() {
        const { isLoading } = this.state;
        return (
            <Container style={styles.container}>
                <View style={mainDivStyle}>

                    <ScrollView>
                        <NavigationEvents
                            onDidFocus={() => {
                                this.getItemsCount()
                            }}
                        />
                        {this.state.cartLists.map((proData, index) => {
                            return <TouchableOpacity style={subElStyle}
                            // onPress={
                            //     () => {
                            //         this.props.navigation.navigate("ProductDetail", { prductID: proData.id });
                            //     }
                            // }
                            >
                                <View style={styles.productMain}>
                                    <View style={{ width: "30%", height: 140, }}>
                                        <Image style={{ width: "80%", zIndex: -1, height: "80%", resizeMode: "contain", borderRadius: 5 }}
                                            source={{ uri: 'data:image/jpeg;base64,' + proData.image_small }} />
                                    </View>
                                    <View style={{ justifyContent: "space-around", alignContent: "center", marginLeft: 20, marginBottom: 10, marginTop: 10, }}>
                                        <View style={{ overFlow: "hidden" }}>
                                            <Text numberOfLines={1} style={styles.text}>{proData.name}</Text>
                                        </View>
                                        <Text style={styles.text}>Price : {proData.lst_price}</Text>
                                        <Text style={{ color: "#666666" }}>On hand: {proData.qty_available} Unit(s)</Text>
                                        <View style={{ flexDirection: "row", marginVertical: 5 }}>
                                            <TouchableOpacity onPress={() => this.increaseQty(this.state.cartLists, index)}>
                                                <FontAwesome name="plus" size={20} color="black" style={{ marginLeft: 10, marginTop: 2 }} />
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 20, marginLeft: 10, }}>{proData.quantity}</Text>
                                            <TouchableOpacity onPress={() => this.decreaseQty(this.state.cartLists, index)}>
                                                <FontAwesome name="minus" size={20} color="black" style={{ marginLeft: 10, marginTop: 2 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.deleteCart(proData)}
                                                style={{ flexDirection: "row", marginLeft: "30%", justifyContent: "space-between", alignItems: "flex-end" }}>
                                                <FontAwesome name="trash" size={20} color="red" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        })}
                        <TouchableOpacity style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: "100%",
                            backgroundColor: "#FF543C",
                            borderRadius: 3,

                            marginBottom: 20,
                        }}
                            onPress={() => {
                                Alert.alert(
                                    "Order Placed!",
                                    "Thanks for Ordering. You will receive your order in 2-4 business days. Cash On Delivery!",
                                    [{ text: 'OK', onPress: () => console.log('Order Placed Success!') }]
                                );
                                this.orderPlaced();
                                //   setTimeout(this.getItemsCount, 1000);

                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>Order Now</Text>
                        </TouchableOpacity>
                    </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
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
