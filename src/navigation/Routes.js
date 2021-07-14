import React from "react";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FavoriteScreen from '../screen/FavoriteScreen/FavoriteScreen'
import Product from '../screen/Product/Product';
import ProductDetail from '../screen/Product/ProductDetail'
import Cart from '../screen/Cart/Cart';

const defaultOptionsForStack = {
  defaultNavigationOptions: {

    headerStyle: {
      backgroundColor: '#5ecc71',
      elevation: 0,
      shadowOpacity: 0
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontSize: 18
    }
  }

};


const AllProductsStack = createStackNavigator({

  AllProducts: {
    screen: Product,
    navigationOptions: {
      headerTitle: "All Products"
    }
  },
  ProductDetail: {
    screen: ProductDetail,
    navigationOptions: {
      headerTitle: "Product Detail"
    }
  },

}, defaultOptionsForStack

);


const FavoriteStack = createStackNavigator({
  Favorite: {
    screen: FavoriteScreen,
    navigationOptions: {
      headerTitle: "Favorite"
    }
  },
}, defaultOptionsForStack

);
const CartStack = createStackNavigator({
  Cart: {
    screen: Cart,
    navigationOptions: {
      headerTitle: "Items in Cart"
    }
  },
}, defaultOptionsForStack
);
const TabNavigator = createBottomTabNavigator({
  Products: {
    screen: AllProductsStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => {
        return <FontAwesome name="th" size={20} color={tintColor} />
      }
    }
  },
  Favorite: {
    screen: FavoriteStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => {
        return <FontAwesome name="heart" size={20} color={tintColor} />
      }
    }
  },
  Cart: {
    screen: CartStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => {
        return <Icon name="shopping-cart" size={20} color={tintColor} />
      }
    }
  },
}, {
    tabBarOptions: {
      showLabel: true,
      activeTintColor: "#5ecc71",
      inactiveTintColor: "black",
      tabStyle: { height: 50, zIndex: 99, borderColor: "white", borderTopWidth: 0 },
      labelStyle: { fontSize: 12, paddingTop: 2, paddingBottom: 3, fontFamily: "halfmoon_bold", },
    }
  }
);
const AppRoutes = createAppContainer(TabNavigator)
export default AppRoutes;











