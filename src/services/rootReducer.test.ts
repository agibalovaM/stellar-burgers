import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('returns the correct initial state for an unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      auth: {
        user: null,
        isAuthenticated: false,
        isAuthChecked: false,
        isLoading: false,
        error: null,
        updateUserError: null
      },
      burgerConstructor: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      ingredients: {
        items: [],
        isLoading: false,
        error: null,
        status: 'idle'
      },
      order: {
        orderData: null,
        isLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      }
    });
  });
});
