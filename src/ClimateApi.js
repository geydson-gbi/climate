import Axios                                      from "axios";
import { Animated, Platform, PermissionsAndroid,
         Alert                                  } from 'react-native';
import LocationServicesDialogBox                  from 'react-native-android-location-services-dialog-box';
import { measureConnectionSpeed                 } from 'react-native-network-bandwith-speed';
import NetInfo                                    from "@react-native-community/netinfo";

/**
 * Call from api, to get the weather information, according to the id of the city searched.
 * @param {number} idCity 
 */
export const timeApi = function( idCity ) {
    return new Promise( function( resolve, reject ) {
        Axios.get(`https://www.metaweather.com/api/location/${idCity}/`)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                resolve(error);
            });
    });
};

/**
 * Searches for the nearest city or cities for past latitude and longitude.
 * @param {number} lat 
 * @param {number} long 
 */
export const cityIdApi = function( lat, long ) {
    return new Promise( function( resolve, reject ) {
        Axios.get(`https://www.metaweather.com/api/location/search/?lattlong=${lat},${long}`)
            .then(function (response) {

                if (response.data.length != 0 ) {
                    resolve(response.data[0].woeid);
                } else {
                    resolve(false);
                }
                
            })
            .catch(function (error) {
                resolve(false);
            });
    });
};

/**
 * Searches for the city entered by the last name.
 * @param {string} locText 
 */
export const makeLocationSearch = function( locText ) {
    return new Promise(function(resolve, reject){
        Axios.get(`https://www.metaweather.com/api/location/search/?query=${locText}`)
            .then(function (response) {

                if(response.data[0].length != 0)
                    resolve(response.data);
                else 
                    resolve(1);
 
            })
            .catch(function (error) {
                resolve(false);
            });
    });
};

/**
 * Requests permission to access device location.
 */
export const requestLocPermission = async () => {
    if( Platform.OS == 'android') {
        try {
            const g = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if(g == PermissionsAndroid.RESULTS.GRANTED){
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else {
        return true;
    }
};

/**
 * Returns the time icon.
 * @param {sting} icon 
 */
export const returnIconTemp = function( icon ) {
    switch(icon) {
        case 'c': 
            return  require( './img/c.png'  );
        
        case 'h': 
            return  require( './img/h.png'  );
      
        case 'hc': 
            return  require( './img/hc.png' );
  
        case 'hr': 
            return  require( './img/hr.png' );
  
        case 'lc': 
            return  require( './img/lc.png' );
        
        case 'lr': 
            return  require( './img/lr.png' );
  
        case 's': 
            return  require( './img/s.png'  );
        
        case 'sl': 
            return  require( './img/sl.png' );
        
        case 'sn': 
            return  require( './img/sn.png' );
  
        case 't': 
            return  require( './img/t.png'  );
    
        default:
            break;
    }
};

/**
 * Returns the background image.
 * @param {string} icon 
 */
export const returnImageBk = function( icon ) {
    switch(icon) {
        case 'c': 
            return  require( './img/bk_c.jpg'  );
        
        case 'h': 
            return  require( './img/bk_h.jpg'  );
      
        case 'hc': 
            return  require( './img/bk_hc.jpg' );
  
        case 'hr': 
            return  require( './img/bk_hr.jpg' );
  
        case 'lc': 
            return  require( './img/bk_lc.jpg' );
        
        case 'lr': 
            return  require( './img/bk_lr.jpg' );
  
        case 's': 
            return  require( './img/bk_s.jpg'  );
        
        case 'sl': 
            return  require( './img/bk_sn.jpg' );
        
        case 'sn': 
            return  require( './img/bk_sn.jpg' );
  
        case 't': 
            return  require( './img/bk_t.jpg'  );
    
        default:
            return  require( './img/bk_c.jpg'  );
    }
};

/**
 * Animates the area showing the 7 days of city time when assembling the component, with the values ​​received
 * @param {number} clockAreaBottom 
 * @param {number} iconBottom 
 * @param {number} itensMount 
 */
export const animatedDidMount = function( clockAreaBottom, iconBottom, itensMount ) {
    if(itensMount != 0) {
        return Animated.parallel([ 
            Animated.timing( clockAreaBottom, {
                toValue  : 0,
                duration : 1000,
            }),   
            Animated.timing( iconBottom, {
                toValue  : 220,
                duration : 1000,
            }),
        ]).start();
    } else {
        return Animated.parallel([ 
            Animated.timing( clockAreaBottom, {
                toValue  : 0,
                duration : 1000,
            }),   
            Animated.timing( iconBottom, {
                toValue  : 50,
                duration : 1000,
            }),
        ]).start();
    }
};

/**
 * Animates the area showing the 7 days of city time when updating a component, with the received values ​​contacting if the array values.
 * @param {array} prevProps 
 * @param {number} clockAreaBottom 
 * @param {number} iconBottom 
 */
export const animatedWillReceiveProps = function( prevProps, clockAreaBottom, iconBottom ) {
    if(prevProps.nextPredictions != 0) {
        return Animated.parallel([ 
            Animated.timing( clockAreaBottom, {
                toValue  : 0,
                duration : 1000,
            }),   
            Animated.timing( iconBottom, {
                toValue  : 220,
                duration : 1000,
            }),
        ]).start();
    } else {
        return Animated.parallel([ 
            Animated.timing( clockAreaBottom, {
                toValue  : 0,
                duration : 1000,
            }),   
            Animated.timing( iconBottom, {
                toValue  : 50,
                duration : 1000,
            }),
        ]).start();
    }
};

/**
 * Function for custom alert display
 * @param {string} title 
 * @param {strin} msg 
 */
export const alertPersonalize = function( title, msg ) {
   return Alert.alert(
    title,
    msg,
    [
        {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    {cancelable: false},
    );
};

/**
 * Function that checks if GPS is disabled, if it takes you to the screen to enable it.
 */
export const verifyGpsActive = function() {
    return new Promise(function(resolve, reject){
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h3 style='color: #000000'>GPS Desativado!</h3>Deseja ativar o GPS?",
            ok: "Sim",
            cancel: "Não",
            // style: { // (optional)
            //     backgroundColor: '#87a9ea',// (optional)
                
            //     positiveButtonTextColor: '#ffffff',// (optional)
            //     positiveButtonBackgroundColor: '#5fba7d',// (optional)
                
            //     negativeButtonTextColor: '#ffffff',// (optional)
            //     negativeButtonBackgroundColor: '#ba5f5f'// (optional)
            // }
        }).then(function(success) {
            if(success.enabled == true){
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch((error) => {
            resolve(false);
        });
    });
};

/**
 * Function that checks data transmission if you have internet or not, returning your connection band or false if you have no internet connection.
 */
const getNetworkBandwidth = function() {
    return new Promise( async (resolve, reject) => {
        try {
            const NetworkBandwidthTestResults = await measureConnectionSpeed();
            resolve(NetworkBandwidthTestResults); // Network bandwidth speed 
        } catch (err) {
            resolve(false);  
        }
    });
};

/**
 * Function that returns the status of the connection, true if it has and false if it does not.
 */
export const statusConnect = async function() {

    let status = false;
    
    await NetInfo.fetch().then(state => {
      status = state.isConnected;
    });
    
    if(status) {
        if(await getNetworkBandwidth()) {
            status = true;
        } else {
            status = false;
        }
    }

    return status;
}

