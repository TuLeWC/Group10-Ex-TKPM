import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Lưu trữ vào localStorage
import { persistReducer, persistStore } from 'redux-persist';
import FacultyReducer from './FacultySlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, FacultyReducer);

const store = configureStore({
  reducer: {
    faculty: persistedReducer, // Sử dụng persistedReducer
  },
});

export const persistor = persistStore(store);
export default store;