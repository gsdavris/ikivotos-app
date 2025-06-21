export function categoriesReducer (state, action) {
    switch (action.type) {
        case "UPDATE_CATEGORIES":
            return { ...state, categories: action.payload };
        default:
            return state;
    }
}