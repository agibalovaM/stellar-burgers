import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: { number: number } | null;
  error: string | null;
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { bun, ingredients } = state.burgerConstructor.constructorItems;
    const ingredientIds = [
      bun?._id,
      ...ingredients.map((item) => item._id),
      bun?._id
    ].filter(Boolean) as string[];

    const response = await orderBurgerApi(ingredientIds);
    return { number: response.order.number };
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient(state, action: { payload: TIngredient }) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
        return;
      }

      state.constructorItems.ingredients.push({
        ...action.payload,
        id: uuidv4()
      });
    },
    removeIngredient(state, action: { payload: string }) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveIngredientUp(state, action: { payload: number }) {
      const index = action.payload;
      if (index <= 0) return;
      const ingredients = state.constructorItems.ingredients;
      [ingredients[index - 1], ingredients[index]] = [
        ingredients[index],
        ingredients[index - 1]
      ];
    },
    moveIngredientDown(state, action: { payload: number }) {
      const index = action.payload;
      const ingredients = state.constructorItems.ingredients;
      if (index >= ingredients.length - 1) return;
      [ingredients[index], ingredients[index + 1]] = [
        ingredients[index + 1],
        ingredients[index]
      ];
    },
    clearConstructor(state) {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },
    closeOrderModal(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось создать заказ';
      });
  }
});

export const {
  addIngredient,
  clearConstructor,
  closeOrderModal,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;
export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;
export const selectConstructorError = (state: RootState) =>
  state.burgerConstructor.error;
