
export const requestClimate = (idCity) => {
    return {
        type: 'CLIMATE_FETCH_REQUESTED',
        payload : {
            idCity   : idCity
        }
    };
};

export const requestClimateSuccess = () => {
    return {
        type: 'CLIMATE_FETCH_SUCCESS',
        payload : {
            today   : '',
        }
    };
};

export const requestClimateError = () => {
    return {
        type: 'CLIMATE_FETCH_ERROR',
        payload : {
            load      : '',
            message   : '',
        }
    };
};

export const requestGPS = (value) => {
    return {
        type: 'REQUEST_GPS_NOT',
        payload : {
            load      : value,
        }
    };
};

export const requestGPSNot = () => {
    return {
        type: 'REQUEST_GPS_NOT_SUCCESS',
        payload : {
            load      : '',
        }
    };
};

export const loadingTrue = () => {
    return {
        type: 'CLIMATE_LOADING_TRUE',
        payload : {
            load      : true,
        }
    };
};

export const loadingFalse = () => {
    return {
        type: 'CLIMATE_LOADING_FALSE',
        payload : {
            load      : false,
        }
    };
};
