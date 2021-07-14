import Odoo from 'react-native-odoo-promise-based';
// import firebase from 'react-native-firebase';
// import { AsyncStorage } from 'react-native';

// var endpoint_custom = '/web/mobile_login';
var endpoint = '/web/dataset/call_kw';
const userLoginApi = (user_name, password) => {
    global.odoo = new Odoo({
        host: 'p7-wd.p7devs.com',                       // testing
        database: 'p7wd',
        port: 443 /* Defaults to 443 if https is specified */,
        protocol: 'https' /* Defaults to http if not specified */,
        username: 'admin' /* Optional if using a stored session_id */,
        password: 'q9qq31' /* Optional if using a stored session_id */,
        // sid: 'YOUR_SESSION_ID', /* Optional if using username/password */
    });
    return odoo.connect().then(res =>
        res
    ).catch(err => console.log('err', err));
}

const searchRead = (model, params) => {
    console.log(model, params);
    return global.odoo.search_read(model, params).then(response => response)
        .catch(e => e)
}

const callRPCmethod = (params) => {
    return global.odoo.rpc_call(endpoint, params).then(response => response)
        .catch(e => e)
}
const get_read = (model, params) => {
    return global.odoo.get(model, params).then(response => response)
        .catch(e => e)
}
const creatData = (model, params) => {
    return global.odoo.create(model, params).then(response => response)
        .catch(e => e)
};
const searchRead_locat = (params) => {
    return global.odoo.search_read("test.drive.history", params).then(response => {
        var datas = {
            "args": [id],
            "kwargs": {},
            "method": "set_mobile_location",
            "model": "test.drive.history"
        }
        return global.odoo.rpc_call(endpoint, params).then(response => response)
            .catch(e => e)
        return response;
    })
        .catch(e => e)
};



export default {
    userLoginApi,
    searchRead,
    callRPCmethod,
    get_read,
    creatData,
    // getToken,
    searchRead_locat,
}