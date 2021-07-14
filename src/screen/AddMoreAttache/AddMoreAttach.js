import React, { Component } from "react";
import {
    Button, View, Text, Image, StyleSheet, SafeAreaView,
    TouchableOpacity, List, ListItem, ListView,
    FlatList, ScrollView, Platform, TextInput, Picker, BackHandler
} from 'react-native';
import { Container } from 'native-base';
import HeaderComponent from '../../Component/Common/Header';
import ImagePicker from 'react-native-image-picker';
import renderIf from './../../config/renderIf';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from './../../config/OdooConnect';
import Toast from 'react-native-simple-toast';
export default class AddMoreAttach extends Component {
    // headerName: string;
    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        this.state = {
            resourcePath: {},
            addMoreImages: [],
            saveDatas: {},
        };
        this.navigator = null;

        this.handleBack = (() => {
            const { navigate } = this.props.navigation;
            navigate('clientCreate');
            return true;
        }).bind(this);
        const { navigation } = this.props;
        const datas = navigation.getParam('datas');
        this.state.saveDatas = datas;
        console.log("itemId>>>>", datas);
    };
    selectAddMoreImages = () => {
        var options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, res => {
            console.log('Response = ', res);
            this.state.addMoreImages.push({ 'image': res.data });
            console.log('this.state.addMoreImages>>>>>', this.state.addMoreImages.length);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);

            } else {
                let source = res;
                this.setState({
                    resourcePath: source,
                });
            }
        });
    };
    createClient = () => {
        this.state.saveDatas.more_images = this.state.addMoreImages;
        console.log("this.state.saveDatas>>>>>", this.state.saveDatas);
        var datas = {
            "args": [[], this.state.saveDatas],
            "kwargs": {},
            "method": "create_contact_mobile",
            "model": "res.partner"
        }
        return api.callRPCmethod(datas).then(res => {
            if (res.data) {
                Toast.show('Successfully Saved');
                this.props.navigation.navigate('dashboard');
            } else {
                Toast.show('Error');
            }
        });
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }


    clearLicenceFile = () => {
        this.setState({
            resourcePath: {},
        });
    }
    goToPostPage = () => {
        this.props.navigation.navigate('dashboard')
    };
    logOut = () => {
        this.props.navigation.navigate('Login')
    };
    render() {
        return (
            <Container style={styles.container}>
                <HeaderComponent logOut={this.logOut} headerTitle='Client Create' navigation={this.props.navigation} />
                <ScrollView>
                    <View style={mainDivStyle}>
                        <View style={subElStyle}>
                            <View>
                                <Text style={textBox.textLabel}>Add More Files</Text>
                                <TouchableOpacity onPress={this.selectAddMoreImages} style={button}  >
                                    <Text style={buttonText}>Choose a file (Click me)</Text>
                                </TouchableOpacity>
                                <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                    {renderIf(this.state.resourcePath.data,
                                        <View style={{ flexDirection: 'row', alignContent: 'stretch' }}>
                                            <View style={{ width: '10%' }}></View>
                                            <View style={{ width: '50%' }}>
                                                {this.state.addMoreImages.map((img, index) => {
                                                    return <Image source={{ uri: 'data:image/jpeg;base64,' + img.image }} key={index} style={{ width: 100, height: 100, marginBottom: 10 }} />;
                                                })}
                                            </View>
                                            {/* <View style={{ width: '50%' }}>
                  
                  <Image
                    source={{
                      uri: 'data:image/jpeg;base64,' + this.state.resourcePath.data,
                    }}
                    style={{ width: 100, height: 100 }}
                  />
                  </View> */}

                                        </View>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity style={submitBtn} onPress={() => this.createClient()}>
                                <Text style={submitBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black'
    },
})
const mainDivStyle = {
    padding: 15,
}
const submitBtn = {
    width: "100%",
    backgroundColor: "#fb5b5a",
    borderRadius: 7,
    height: 40,
    marginTop: 4,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
}
const submitBtnText = {
    color: 'white',
    fontSize: 17,
}
const textBox = {
    textLabel: {
        fontSize: 17,
        color: 'white',
    },
    inputText: {
        color: "white",
        width: "100%",
        backgroundColor: "#5ecc71",
        borderRadius: 7,
        height: 40,
        marginTop: 4,
        borderWidth: 2,
        marginBottom: 10,
        borderColor: "#5ecc71",
    },

};
const button = {
    color: "black",
    width: "100%",
    backgroundColor: "#5ecc71",
    borderRadius: 7,
    height: 40,
    marginTop: 4,
    marginBottom: 10
};
const buttonText = {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
}
const subElStyle = {
    elevation: 4, shadowOffset: {}, shadowColor: "grey", shadowOpacity: 0.5, shadowRadius: 10, padding: 5, width: '100%', marginBottom: 5, backgroundColor: "#202225", borderRadius: 8,
}
