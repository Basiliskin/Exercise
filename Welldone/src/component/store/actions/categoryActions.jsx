import {types} from '../types/categoryTypes.jsx'

export const ActionMode = 'category';
export const actions = {
    newCategory(Name) {
        return {
            type: types.NEW_CATEGORY,
            payload: {Name}
        };
    },
    deleteCategory(Name) {
        return {
            type: types.DEL_CATEGORY,
            payload: {Name}
        };
    }
};