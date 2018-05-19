import {types} from '../types/locationTypes.jsx'

export const ActionMode = 'location';
export const actions = {
    newLocation(item) {
        return {
            type: types.NEW_LOCATION,
            payload: item
        };
    },
    deleteLocation(item) {
        return {
            type: types.DEL_LOCATION,
            payload: item
        };
    }
};