import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';

const store = configureStore({
    reducer: {
        auth: authReducer,
        // 其他reducers
    },
});

export default store;