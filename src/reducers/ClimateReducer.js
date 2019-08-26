import Moment from 'moment';

const initialState = {
    idCity          : '',
    today           : '...',
    currentTime     : '',
    currentDate     : '',
    city            : 'Buscando uma cidade...', 
    iconTempToday   : '',
    nextPredictions : [],
    load            : false,
    favoriteCity    : '',
};

const ClimateReducer = ( state = initialState, action ) => {

    switch (action.type) {
        case 'CLIMATE_FETCH_SUCCESS':

            let nextPredictions  = action.payload.nextPredictions;
            let arrayPredictions = [];

            /**
             * Handling information before it is presented.
             */
            nextPredictions.map((elemento, index) => {
                arrayPredictions[index] = [ 
                    Moment(elemento.applicable_date).format('DD'),
                    elemento.min_temp.toFixed(0)+'°',
                    elemento.max_temp.toFixed(0)+'°',
                    elemento.weather_state_abbr
                ];
            })

            return { ...state, 
                today            : action.payload.today, 
                currentTime      : action.payload.iconTempToday,
                currentDate      : 'Hoje',
                city             : action.payload.city,
                iconTempToday    : action.payload.iconTempToday,
                nextPredictions  : arrayPredictions,
                load             : action.payload.load,
                idCity           : action.payload.idCity,
            };
        
        case 'REQUEST_GPS_NOT_SUCCESS':
            return { ...state,
                load             : action.payload.load,
                nextPredictions  : action.payload.nextPredictions,
            };

        case 'CLIMATE_LOADING_TRUE': 
            return {...state,
                load             : true
            };
        
        case 'CLIMATE_LOADING_FALSE': 
            return {...state,
                load             : false,
                notConect        : 'Sem conexão...'
            };
        
        case 'CLIMATE_REMOVE_CITY':
            let cities    = action.payload.cities;
            let idCity    = action.payload.idCity;
    
            cities.some((elem, index) => {
                if(elem.key == idCity) {
                    cities.splice(index, 1); 
                } 
            });

            let arrayCities = [...cities];
         
            if(arrayCities.length > 0) {
                return { ...state, 
                    load           : false,
                };
            } else {
                return { ...state,
                    idCity          : '',
                    today           : '...',
                    currentTime     : '',
                    currentDate     : '',
                    city            : 'Busque uma cidade...', 
                    iconTempToday   : '',
                    nextPredictions : [],
                    load            : false,
                    favoriteCity    : '',
                };
            }
        
        default:
            return state;

    };

};

export default ClimateReducer;