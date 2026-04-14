import {
  addIngredient,
  burgerConstructorReducer,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './burgerConstructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const bun: TConstructorIngredient = {
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
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  id: 'constructor-bun-1'
};

const mainIngredient = (
  overrides: Partial<TConstructorIngredient> = {}
): TConstructorIngredient => ({
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  id: 'constructor-main-1',
  ...overrides
});

describe('burgerConstructorSlice reducer', () => {
  it('adds a bun to the constructor', () => {
    const state = burgerConstructorReducer(undefined, addIngredient(bun));

    expect(state.constructorItems.bun).toEqual(bun);
    expect(state.constructorItems.ingredients).toEqual([]);
  });

  it('removes an ingredient from the constructor', () => {
    const ingredientToKeep = mainIngredient({
      _id: 'main-2',
      id: 'constructor-main-2',
      name: 'Говяжий метеорит'
    });
    const initialState = {
      constructorItems: {
        bun: null as TIngredient | null,
        ingredients: [mainIngredient(), ingredientToKeep]
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    const state = burgerConstructorReducer(
      initialState,
      removeIngredient('constructor-main-1')
    );

    expect(state.constructorItems.ingredients).toEqual([ingredientToKeep]);
  });

  it('changes the order of filling ingredients', () => {
    const firstIngredient = mainIngredient({
      _id: 'main-1',
      id: 'constructor-main-1',
      name: 'Начинка 1'
    });
    const secondIngredient = mainIngredient({
      _id: 'main-2',
      id: 'constructor-main-2',
      name: 'Начинка 2'
    });
    const thirdIngredient = mainIngredient({
      _id: 'main-3',
      id: 'constructor-main-3',
      name: 'Начинка 3'
    });
    const initialState = {
      constructorItems: {
        bun: null as TIngredient | null,
        ingredients: [firstIngredient, secondIngredient, thirdIngredient]
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    const movedUpState = burgerConstructorReducer(
      initialState,
      moveIngredientUp(2)
    );
    const movedDownState = burgerConstructorReducer(
      movedUpState,
      moveIngredientDown(0)
    );

    expect(movedUpState.constructorItems.ingredients.map(({ id }) => id)).toEqual(
      ['constructor-main-1', 'constructor-main-3', 'constructor-main-2']
    );
    expect(
      movedDownState.constructorItems.ingredients.map(({ id }) => id)
    ).toEqual([
      'constructor-main-3',
      'constructor-main-1',
      'constructor-main-2'
    ]);
  });
});
