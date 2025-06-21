export function titleReducer (state, action) {
    switch (action.type) {
        case "UPDATE_TITLE":
            return { ...state, title: action.payload };
        default:
            return state;
    }
}