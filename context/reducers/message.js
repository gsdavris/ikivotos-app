export function messageReducer (state, action) {
    switch (action.type) {
        case "UPDATE_MESSAGE":
            return { ...state, message: action.payload };
        default:
            return state;
    }
}