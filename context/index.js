import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReducer, createContext, useEffect } from "react";
import { categoriesReducer } from "./reducers/categories";
import { favoritesReducer } from "./reducers/favorites";
import { homepageReducer } from "./reducers/homepage";
import { menusReducer } from "./reducers/menus";
import { titleReducer } from "./reducers/title";
import { messageReducer } from "./reducers/message";
import { apiUri } from '@/constants/requests';
import { useTranslation } from "react-i18next";


// create context
const Context = createContext({});

// combine reducer function
const combineReducers = (...reducers) => (state, action) => {
    for (let i = 0; i < reducers.length; i++) state = reducers[i](state, action);
    return state;
};


// context provider
const ContextProvider = ({ children }) => {
    const { t } = useTranslation();
    let initialState = {
        favorites: [],
        title: null,
        categories: [],
        homepage: null,
        menus: [],
        message: null
    };

    const [state, dispatch] = useReducer(combineReducers(favoritesReducer, titleReducer, categoriesReducer, homepageReducer, menusReducer, messageReducer), initialState);

    const getInitialData = async () => {
        try {
            const response = await axios.get(apiUri + '/initial');
            const { data } = response;
            await storeInitialData(data);
            // Dispatch actions to update the state
            dispatch({ type: 'UPDATE_CATEGORIES', payload: data?.categories });
            dispatch({
                type: 'UPDATE_HOMEPAGE',
                payload: {
                    el: data?.homepage,
                    en: data['homepage-en'],
                    ro: data['homepage-ro']
                }
            });
            dispatch({ type: 'UPDATE_MENUS', payload: data?.menus });
        } catch (error) {
            if (error.message === 'Network Error') {
                dispatch({
                    type: 'UPDATE_MESSAGE',
                    payload: {
                        type: 'error',
                        title: t("error"),
                        label: t("connection_error")
                    }
                });
                const dataFromStorage = await getInitialDataFromStorage();
                if (dataFromStorage !== null) {
                    dispatch({ type: 'UPDATE_CATEGORIES', payload: dataFromStorage?.categories });
                    dispatch({
                        type: 'UPDATE_HOMEPAGE',
                        payload: {
                            el: dataFromStorage?.homepage,
                            en: dataFromStorage['homepage-en'],
                            ro: dataFromStorage['homepage-ro']
                        }
                    });
                    dispatch({ type: 'UPDATE_MENUS', payload: dataFromStorage?.menus });
                }
            } else {
                dispatch({
                    type: 'UPDATE_MESSAGE',
                    payload: {
                        type: 'error',
                        title: t("error"),
                        label: error.message
                    }
                });
            }

        }
    };

    const getDataFromStorage = async () => {
        try {
            const favoritesJsonValue = await AsyncStorage.getItem('favorites');
            if (favoritesJsonValue !== null) {
                dispatch({ type: "UPDATE_FAVORITES", payload: JSON.parse(favoritesJsonValue) });
            }
        } catch (e) {
            // error reading value
            dispatch({
                type: 'UPDATE_MESSAGE',
                payload: {
                    type: 'error',
                    title: t("error"),
                    label: error.message
                }
            });
        }
    };

    const storeInitialData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('initial', jsonValue);
        } catch (err) {
            dispatch({
                type: 'UPDATE_MESSAGE',
                payload: {
                    type: 'error',
                    title: t("error"),
                    label: err?.message,
                },
            });
        }
    };

    const getInitialDataFromStorage = async () => {
        try {
            const initialJsonValue = await AsyncStorage.getItem('initial');
            if (initialJsonValue !== null) {
                return JSON.parse(initialJsonValue);
            } else return null;
        } catch (e) {
            // error reading value
            dispatch({
                type: 'UPDATE_MESSAGE',
                payload: {
                    type: 'error',
                    title: t("error"),
                    label: error.message
                }
            });
        }
    };


    useEffect(() => {
        (async () => {
            await getInitialData();
            await getDataFromStorage();
        })();

    }, []);

    const value = { state, dispatch };

    return <Context.Provider value={ value }>{ children }</Context.Provider>;
};


export { Context, ContextProvider };