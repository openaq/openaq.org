import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import baseData from './base-data';

export default combineReducers({
  routing: routerReducer,
  baseData
});
