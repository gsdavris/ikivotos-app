export function menusReducer (state, action) {
    switch (action.type) {
        case "UPDATE_MENUS":
            return { ...state, menus: action.payload };
        default:
            return state;
    }
}