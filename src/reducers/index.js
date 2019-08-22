import { combineReducers } from 'redux';
import ClimateReducer      from './ClimateReducer';
import CitiesReducer       from './CitiesReducer';

const Reducers = combineReducers({
    climate : ClimateReducer,
    cities  : CitiesReducer
});

export default Reducers;