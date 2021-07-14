import React from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import { Header, Left, Right, Body, Button, Icon } from 'native-base';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
// import Icon from 'react-native-vector-icons/FontAwesome';
const subElStyle = { elevation: 4, shadowOffset: {}, shadowColor: "grey", shadowOpacity: 0.5, shadowRadius: 10, backgroundColor: "#5ecc71", margin: 4, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }
const HeaderComponent = (props) => {
    let parentRoute = (props.navigation && props.navigation.state.params && props.navigation.state.params.parentRoute) ? props.navigation.state.params.parentRoute : "";
    const goBack = () => {
        props.navigation.goBack();
    }

    return (
        <Header hasTabs style={subElStyle}>
            <View
                style={{
                    backgroundColor: colors.statusBarColor,
                    height: Platform.OS === 'ios' ? 18 : StatusBar.currentHeight,
                }}>
                <StatusBar
                    barStyle="light-content"
                    hidden={false}
                    backgroundColor={colors.statusBarColor}
                    translucent={false}
                    animated
                    networkActivityIndicatorVisible={true}
                    style={{ height: (Platform.OS === 'ios') ? 18 : 0 }}
                />
            </View>
            {/* <Left>
                    <Button transparent onPress={props.icon === 'menu' ? () => props.navigation.openDrawer() : () => goBack()}>
                        <Icon name={props.icon} style={{color:'red'}} />
                    </Button>
                </Left> */}
            <Body>
                <Text style={{ color: '#ffffff', fontSize: 18, fontFamily: fonts.themeFont, fontWeight: 'bold' }}>
                    {props.headerTitle}
                </Text>
            </Body>


            <Right>
                <Icon name='log-out' onPress={() => props.logOut()} style={{ fontSize: 20, color: '#fb5b5a' }} />
            </Right>


        </Header>
    )
}

export default HeaderComponent;
