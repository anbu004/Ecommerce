import React, { Component } from "react";
import api from '../../config/OdooConnect';
import Toast from 'react-native-simple-toast';
import { StyleSheet, AsyncStorage, Text, View, ScrollView, TextInput, Image, Alert, BackHandler, TouchableOpacity } from 'react-native';
export default class ProductDetail extends Component {

    state = {
        productID: "",
        productDetails: {},
        productIDS: []
    }
    componentDidMount() {
        const { state } = this.props.navigation;
        this.setState.productID = state.params.prductID;
        console.log('this.setState.productID', this.setState.productID);
        this.getProductDetailScreen(this.setState.productID);
        AsyncStorage.getItem('product_IDS').then((value) => {
            this.setState({
                productIDS: JSON.parse(value)
            })
        })
    }
    getProductDetailScreen(productID) {
        const params = {
            ids: productID,
            fields: [],
            limit: 0,
            sort: ''
        }
        return api.get_read('product.template', params)
            .then(response => {
                if (response.success) {
                    this.setState({
                        productDetails: {
                            'id': response.data[0].id,
                            'name': response.data[0].name,
                            'list_price': response.data[0].list_price,
                            'categ_id': response.data[0].categ_id[1],
                            'image': response.data[0].image,
                            'qty_available': response.data[0].qty_available,
                            'standard_price': response.data[0].standard_price,
                            'uom_name': response.data[0].uom_name,
                            'uom_po_id': response.data[0].uom_po_id[1],
                        }

                    });
                }
            },
            )
            .catch(err => console.log(err))
    }

    addtoCart = async (proData) => {
        Toast.show('Added to Cart');
        console.log('proData>>', proData);
        this.state.productIDS.push(proData.id);
        AsyncStorage.setItem('product_IDS', JSON.stringify(this.state.productIDS));
    }
    render() {
        const { productDetails } = this.state;
        return (
            <ScrollView>
                <View style={styles.main}>
                    <Image
                        source={{ uri: 'data:image/jpeg;base64,' + productDetails.image }}
                        style={styles.fitImage}
                    />
                    <View style={styles.productNamBoxstyle}>
                        <Text style={styles.productNamestyle}>{productDetails.name} - ₹{productDetails.list_price}</Text>
                    </View>
                    <View style={subElStyle}>
                        <View style={styles.infoBox}>
                            <Text style={styles.propText}>Category</Text>
                            <Text>{productDetails.categ_id}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.propText}>Sales Price</Text>
                            <Text>₹{productDetails.list_price}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.propText}>Cost</Text>
                            <Text>₹{productDetails.standard_price}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.propText}>Available Quantity</Text>
                            <Text>{productDetails.qty_available}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.propText}>Unit of Measure</Text>
                            <Text>{productDetails.uom_name}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Text style={styles.propText}>Purchase Unit of Measure</Text>
                            <Text>{productDetails.uom_po_id}</Text>
                        </View>
                    </View>

                    {/* <View style={styles.rating}>
                  <View style={{...styles.infoBox, flexDirection:"column"}}>   
                    <Text> Description! </Text>
                     <Text>{book.Description}</Text>
                  </View>
                
                </View> */}
                    <View style={{ alignItems: "center" }}>
                        <TouchableOpacity style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: "80%",
                            backgroundColor: "#FF543C",
                            borderRadius: 3,
                            marginBottom: 20,
                        }}
                            onPress={() => {
                                this.addtoCart(productDetails);
                            }}>

                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    main: {
        flex: 1,
        padding: 10,
    },
    rating: {
        marginTop: 10,
        marginBottom: 10
    },
    infoBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8,
        marginTop: 5,
    },
    fitImage: {
        borderRadius: 5,
        zIndex: -1,
        resizeMode: "contain",
        width: "100%",
        height: 300
    },
    fitImageWithSize: {
        height: 100,
        width: 30,
    },
    defaultText: {
        fontSize: 15,
    },
    propText: {
        fontFamily: "halfmoon_bold",
        fontSize: 15,
        textAlign: 'left',
        fontWeight: "bold",
    },
    productNamestyle: {
        fontFamily: "halfmoon_bold",
        fontSize: 20,
        fontWeight: "bold",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: "#5ecc71",
    },
    productNamBoxstyle: {
        margin: 15,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }

});
const subElStyle = {
    elevation: 0.5, shadowOffset: {}, shadowOpacity: 123, shadowRadius: 8, marginBottom: 5, borderRadius: 8, backgroundColor: "white"
}