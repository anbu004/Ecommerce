import React, { Component } from "react";
import api from '../../config/OdooConnect';
import { StyleSheet, Text, View, Alert, TextInput, Image, TouchableOpacity } from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class Login extends Component {
  state = {
    user_name: "admin",
    password: "q9qq31"
  }
  onLoginPress() {
    const { password } = this.state;
    const { user_name } = this.state;
    console.log("user_name>>>", user_name, ">>>>password>>>", password);
    if (user_name === '' && password === '') {
      Toast.show('Please Enter valid Username and Password');
    } else {
      return api.userLoginApi(user_name, password).then(res => {
        console.log('loginRes', res);
        if (res.data.uid) {
          this.props.navigation.navigate("dashboard");
        } else {
          Toast.show('Please Enter valid Username and Password');
        }
      }).catch(err => {
        Toast.show('Please Enter valid Username and Password');
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
        {/* <Text style={styles.logText}>Log In</Text> */}
        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Email..."
            onChangeText={(user_name) => this.setState({ user_name })}
            value={this.state.user_name}
            placeholderTextColor="#003f5c" />
        </View>
        <View style={styles.inputView} >
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password} />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={() => this.onLoginPress()}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity> */}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: "80%",
    height: "30%",
    marginBottom: 40
  },
  logText: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    backgroundColor: "#e5e5e5",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "black"
  },
  forgot: {
    color: "white",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "white"
  }
});