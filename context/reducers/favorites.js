export function favoritesReducer (state, action) {
    switch (action.type) {
        case "ADD_FAVORITES":
            return {
                ...state,
                favorites: [...state.favorites, action.payload]
            };
        case "REMOVE_FAVORITES":
            return {
                ...state,
                favorites: state.favorites.filter((fav) => fav.id !== action.payload.id)
            };
        case "UPDATE_FAVORITES":
            return {
                ...state,
                favorites: action.payload
            };
        default:
            return state;
    }
}