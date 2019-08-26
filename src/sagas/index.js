import { call, put, takeEvery, all             } from 'redux-saga/effects';
import { timeApi                               } from '../ClimateApi';

function* fetchClimate(action) {
      yield put({
         type    : "CLIMATE_LOADING_TRUE",
      });

      try {

         const today = yield call(timeApi, action.payload.idCity);

         if (today) {

            yield put({
               type    : "ADD_CITY", 
               payload : { 
                  city : {
                     key           : today.data.woeid,
                     titleCity     : today.data.title,
                     favorite      : false,
                     verify        : true,
                  }
               }
            });

            yield put({
               type    : "CLIMATE_FETCH_SUCCESS", 
               payload : { 
                  today           : (today.data.consolidated_weather[0].the_temp).toFixed(0)+'°',
                  currentTime     : today.data.time,
                  city            : today.data.title,
                  iconTempToday   : today.data.consolidated_weather[0].weather_state_abbr,
                  nextPredictions : today.data.consolidated_weather,
                  load            : false,
                  idCity          : today.data.woeid,
               }
            });
         } 
      } catch (e) {
         yield put({
            type    : "CLIMATE_FETCH_ERROR",  
            payload : { 
               load                : false, 
               message             : e.message 
            } 
         });
      }
 }

function* fetchNoGPS(action) {
   
   yield put({
      type    : "CLIMATE_LOADING_TRUE",
   });

   yield put({
      type    : "REQUEST_GPS_NOT_SUCCESS", 
      payload : { 
         load            : action.payload.load,
         nextPredictions : [],
      }
   });
}

function* setFavoriteCity(action) {

   yield put({
      type   : "CLIMATE_LOADING_TRUE",
   });

   yield put({
      type    : "CLIMATE_FETCH_REQUESTED", 
      payload : { 
         idCity           : action.payload.idCity,
      }
   });
}

function* removeCity(action) {
   yield put({
      type    : "CLIMATE_REMOVE_CITY", 
      payload : { 
         cities    : action.payload.citys,
         idCity    : action.payload.idCity,
      }
   });
}

 function* Sagas() {
   yield takeEvery( "CLIMATE_FETCH_REQUESTED", fetchClimate );
   yield takeEvery( "REQUEST_GPS_NOT", fetchNoGPS           );
   yield takeEvery( "FAVORITE_CITY", setFavoriteCity        );
   yield takeEvery( "REMOVE_CITY", removeCity               );
}

export default function* Root(){
   yield all([Sagas()]);
};
