describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage();
  });

  it('добавляет булку и начинку из списка ингредиентов в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-add-bun-1"]').contains('Добавить').click();
    cy.get('[data-cy="ingredient-add-main-1"]').contains('Добавить').click();

    cy.get('[data-cy="constructor-bun-top"]').should(
      'contain.text',
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should(
      'contain.text',
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-cy="constructor-ingredient"]')
      .should('have.length', 1)
      .and('contain.text', 'Биокотлета из марсианской Магнолии');
  });

  it('открывает модальное окно ингредиента и закрывает его по клику на крестик', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-link-main-1"]').click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should('be.visible');
    cy.get('[data-cy="ingredient-details-name"]').should(
      'have.text',
      'Биокотлета из марсианской Магнолии'
    );
    cy.contains('Калории, ккал').parent().should('contain.text', '4242');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрывает модальное окно ингредиента по клику на оверлей', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-link-sauce-1"]').click();
    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('создаёт заказ, показывает номер и очищает конструктор после закрытия модального окна', () => {
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=test-access-token';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.get('[data-cy="ingredient-add-bun-1"]').contains('Добавить').click();
    cy.get('[data-cy="ingredient-add-main-1"]').contains('Добавить').click();
    cy.get('[data-cy="ingredient-add-sauce-1"]').contains('Добавить').click();

    cy.get('[data-cy="order-button"]').contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="order-details"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('have.text', '12345');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="constructor-bun-top-empty"]').should(
      'contain.text',
      'Выберите булки'
    );
    cy.get('[data-cy="constructor-bun-bottom-empty"]').should(
      'contain.text',
      'Выберите булки'
    );
    cy.get('[data-cy="constructor-fillings-empty"]').should(
      'contain.text',
      'Выберите начинку'
    );
    cy.get('[data-cy="constructor-ingredient"]').should('not.exist');
  });
});
