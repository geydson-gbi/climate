
export const addCity = (city) => {
    return {
        type: 'ADD_CITY',
        payload : {
            city    : city,
            load    : true,
        }
    };
};

export const removeCity = (citys, idCity) => {
    return {
        type: 'REMOVE_CITY',
        payload : {
            citys    : citys,
            idCity   : idCity,
        }
    };
};

export const favoriteCity = (citys, idCity) => {
    return {
        type: 'FAVORITE_CITY',
        payload : {
            citys    : citys,
            idCity   : idCity,
        }
    };
};

export const removeFavoriteCity = (citys, idCity) => {
    return {
        type: 'REMOVE_FAVORITE_CITY',
        payload : {
            citys    : citys,
            idCity   : idCity,
        }
    };
};

export const favoriteCityNotConnection = (citys, idCity) => {
    return {
        type: 'FAVORITE_CITY_NOT_CONNECTION',
        payload : {
            citys    : citys,
            idCity   : idCity,
        }
    };
};



