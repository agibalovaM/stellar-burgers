import { fetchIngredients, ingredientsReducer } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
  }
];

describe('ingredientsSlice reducer', () => {
  it('sets isLoading to true on fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.status).toBe('loading');
  });

  it('stores ingredients and resets loading on fetchIngredients.fulfilled', () => {
    const loadingState = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );
    const state = ingredientsReducer(
      loadingState,
      fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
    );

    expect(state.items).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('succeeded');
  });

  it('stores an error and resets loading on fetchIngredients.rejected', () => {
    const loadingState = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );
    const state = ingredientsReducer(
      loadingState,
      fetchIngredients.rejected(new Error('Ошибка загрузки'), 'request-id')
    );

    expect(state.error).toBe('Ошибка загрузки');
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('failed');
  });
});
