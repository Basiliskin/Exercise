import {createStore, applyMiddleware} from 'redux';
import categoryReducer from './reducers/categoryReducer.jsx';
import locationReducer from './reducers/locationReducer.jsx';

import { combineReducers } from 'redux';

let initialState = {
    category: [
        {Name:'Cafe'},
        {Name:'Shop'},
        {Name:'Shoes'}
    ],
    location:[
        {
            Name:'Aroma', 
            Address:'Rotshild 1', 
            Coordinates:{lat:51.505,lng:-0.09},
            Category:['Cafe']
        },
        {
            Name:'Gali', 
            Address:'Rotshild 12', 
            Coordinates:{lat:51.505,lng:-0.09},
            Category:['Shop','Shoes']
        },
    ]
};

if(!localStorage.myLocations)
{
    localStorage.setItem("myLocations", JSON.stringify(initialState));
}
else{
    try{
        initialState = JSON.parse(localStorage.myLocations);
    }catch(e)
    {
        console.error(e);
    }    
}
const rootReducer = combineReducers({category: categoryReducer, location: locationReducer})

const logger = store => next => action => {
    /*
    console.group(action.type);
    console.log('dispatching: ', action);
    console.log('prev state: ', store.getState());
    */
    const result = next(action);
    /*
    console.log('next state: ', store.getState());
    console.groupEnd(action.type);
    */
    try{
        localStorage.setItem("myLocations", JSON.stringify(store.getState()));
    }catch(e)
    {
        console.error(e);
    }
    
    return result;
  };

export default createStore(rootReducer, initialState, applyMiddleware(logger));