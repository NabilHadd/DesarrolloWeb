// /src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './features/filterSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Agrega todos tus reducers aquí (actualmente solo el de filtros)
      filters: filterReducer,
    },
    // Añade middleware, devtools, etc. si es necesario
  });
};

// Define los tipos de RootState y AppDispatch para usar en hooks
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];