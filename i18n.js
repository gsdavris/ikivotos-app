import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';


// translation files
import el from '@/locales/el.json';
import en from '@/locales/en.json';
import ro from '@/locales/ro.json';

const fallbackLanguage = 'el';

// Load saved language from storage;
const loadLanguage = async () => {
    const savedLanguage = await AsyncStorage.getItem('appLanguage');
    return savedLanguage || Localization.locale.split('-')[0] || fallbackLanguage;
};

loadLanguage().then((lng) => {
    i18next.changeLanguage(lng);
});

i18next
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: {
            el: { translation: el },
            en: { translation: en },
            ro: { translation: ro },
        },
        lng: Localization.locale.split('-')[0] || fallbackLanguage, // Default language
        fallbackLng: fallbackLanguage,
        interpolation: {
            escapeValue: false, // React already handles escaping
        },
    });

i18next.on('languageChanged', async (lng) => {
    await AsyncStorage.setItem('appLanguage', lng);
});

export default i18next;