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
        
        default:
            return state;

    };

};

export default ClimateReducer;