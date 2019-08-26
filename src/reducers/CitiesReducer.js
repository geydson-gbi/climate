
const initialState = {
    citys        : [],
    load         : false,
    favoriteCity : false,
};

const CitiesReducer = ( state = initialState, action ) => {

    switch (action.type) {
        case 'ADD_CITY':

            let allCities  = [...state.citys];
            let city       = action.payload.city;
    
            if (!allCities.some(elem => elem.key == city.key)){
                allCities  = [...state.citys, city];
            }
        
            return { ...state, 
                citys          : allCities,
                load           : false,
            };
        
        case 'REMOVE_CITY':

            let cities    = action.payload.citys;
            let idCity    = action.payload.idCity;
  
            cities.some((elem, index) => {
                if(elem.key == idCity) {
                    cities.splice(index, 1); 
                } 
            });

            console.tron.log([...cities])

            return { ...state, 
                citys          : [...cities],
                load           : false,
            };
        
        case 'FAVORITE_CITY':

            let citysArray   = action.payload.citys;
            let idfavorite   = action.payload.idCity;

            citysArray.some((elem) => {
                if(elem.key == idfavorite) {
                    elem.favorite = true;
                } else {
                    elem.favorite = false;
                }
            });

            return { ...state, 
                citys         : [...citysArray],
                load          : false,
                favoriteCity  : idfavorite,
            };
        
        case 'FAVORITE_CITY_NOT_CONNECTION':

            let arrayCitys = action.payload.citys;
            let favorite   = action.payload.idCity;

            arrayCitys.some((elem) => {
                if(elem.key == favorite) {
                    elem.favorite = true;
                } else {
                    elem.favorite = false;
                }
            });

            return { ...state, 
                citys         : [...arrayCitys],
                load          : false,
                favoriteCity  : favorite,
            };
        
        case 'REMOVE_FAVORITE_CITY':
            let allCitys = action.payload.citys;
            let remove   = action.payload.idCity;

            allCitys.some((elem) => {
                if(elem.key == remove) {
                    elem.favorite = false;
                } 
            });

            console.tron.log(allCitys);

            return { ...state, 
                citys         : [...allCitys],
                load          : false,
                favoriteCity  : '',
            };
        
        default:
            return state;

    };

};

export default CitiesReducer;