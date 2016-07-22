import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import baseData from './base-data';
import locations from './locations';

export default combineReducers({
  routing: routerReducer,
  baseData,
  locations
});
