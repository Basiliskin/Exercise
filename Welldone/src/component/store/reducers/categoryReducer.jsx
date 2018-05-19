import {types} from '../types/categoryTypes.jsx'

const deleteCategory = (existingCategory, Name) => existingCategory.filter(f => f.Name !== Name);

export default function categoryReducer(state = {}, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.NEW_CATEGORY:
            const found = state.find(function(element) {
                return element.Name === payload.Name;
            });
            return !found ? [
                ...state,
                payload
            ] : state;
        case types.DEL_CATEGORY:
            return deleteCategory(state, payload.Name);
        default:
            return state;
    }
}