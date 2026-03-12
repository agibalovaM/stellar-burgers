import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from './slices/authSlice';
import { burgerConstructorReducer } from './slices/burgerConstructorSlice';
import { feedReducer } from './slices/feedSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { orderReducer } from './slices/orderSlice';
import { profileOrdersReducer } from './slices/profileOrdersSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer
});
