import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
  status: 'idle'
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients(state, action: PayloadAction<TIngredient[]>) {
      state.items = action.payload;
    },
    clearIngredientsError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.status = 'succeeded';
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ингредиенты';
        state.status = 'failed';
      });
  }
});

export const { setIngredients, clearIngredientsError } =
  ingredientsSlice.actions;

export const ingredientsReducer = ingredientsSlice.reducer;

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientsStatus = (state: RootState) =>
  state.ingredients.status;
export const selectIngredientsByType = (type: TIngredient['type']) =>
  createSelector(
    (state: RootState) => state.ingredients.items,
    (items) => items.filter((item) => item.type === type)
  );
export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((item) => item._id === id);
