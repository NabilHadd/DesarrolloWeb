import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Define la interfaz del estado de los filtros (lo que se guardará)
export interface FilterState {
  category: string;
  minPrice: number;
  sortBy: 'price' | 'name' | 'stock';
  order: 'asc' | 'desc';
}

// 2. Define el estado inicial
const initialState: FilterState = {
  category: 'all',
  minPrice: 0,
  sortBy: 'name',
  order: 'asc',
};

// 3. Crea el slice
export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Reducer para actualizar cualquier filtro por clave
    setFilter: (state, action: PayloadAction<{ key: keyof FilterState, value: any }>) => {
      const { key, value } = action.payload;
      // Asegúrate de que el valor sea correcto, si es 'minPrice' debería ser número
      if (key === 'minPrice') {
        state.minPrice = Number(value);
      } else {
        (state as any)[key] = value;
      }
    },
    // Opcional: Reducer para resetear todos los filtros
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const { setFilter, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;