export function homepageReducer (state, action) {
    switch (action.type) {
        case "UPDATE_HOMEPAGE":
            return { ...state, homepage: action.payload };
        default:
            return state;
    }
}