import {types} from '../types/locationTypes.jsx'

export default function locationReducer(state = {}, action) {
    const payload = action.payload;

    switch (action.type) {
        case types.NEW_LOCATION:
            const nfound = state.filter(f => f.Name !== payload.Name);        
            return [
                ...nfound,
                payload
            ];
        case types.DEL_LOCATION:
            const dfound = state.filter(f => f.Name !== payload.Name);
            return [
                ...dfound
            ];
        default:
            return state;
    }
}