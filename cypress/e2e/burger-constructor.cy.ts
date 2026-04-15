import { selectors } from '../support/selectors';

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
    cy.visitConstructorPage();

    cy.addIngredientToConstructor('ingredientAddBun1');
    cy.addIngredientToConstructor('ingredientAddMain1');

    cy.get(selectors.constructorBunTop).should(
      'contain.text',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(selectors.constructorBunBottom).should(
      'contain.text',
      'Флюоресцентная булка R2-D3'
    );
    cy.get(selectors.constructorIngredient)
      .should('have.length', 1)
      .and('contain.text', 'Биокотлета из марсианской Магнолии');
  });

  it('открывает модальное окно ингредиента и закрывает его по клику на крестик', () => {
    cy.visitConstructorPage();

    cy.openIngredientModal('ingredientLinkMain1');

    cy.get(selectors.ingredientDetails).should('be.visible');
    cy.get(selectors.ingredientDetailsName).should(
      'have.text',
      'Биокотлета из марсианской Магнолии'
    );
    cy.contains('Калории, ккал').parent().should('contain.text', '4242');

    cy.closeModal();
  });

  it('закрывает модальное окно ингредиента по клику на оверлей', () => {
    cy.visitConstructorPage();

    cy.openIngredientModal('ingredientLinkSauce1');

    cy.closeModalByOverlay();
  });

  it('создаёт заказ, показывает номер и очищает конструктор после закрытия модального окна', () => {
    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visitConstructorPageAsAuthorizedUser();

    cy.addIngredientToConstructor('ingredientAddBun1');
    cy.addIngredientToConstructor('ingredientAddMain1');
    cy.addIngredientToConstructor('ingredientAddSauce1');

    cy.get(selectors.orderButton).contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get(selectors.orderDetails).should('be.visible');
    cy.get(selectors.orderNumber).should('have.text', '12345');

    cy.closeModal();

    cy.get(selectors.constructorBunTopEmpty).should(
      'contain.text',
      'Выберите булки'
    );
    cy.get(selectors.constructorBunBottomEmpty).should(
      'contain.text',
      'Выберите булки'
    );
    cy.get(selectors.constructorFillingsEmpty).should(
      'contain.text',
      'Выберите начинку'
    );
    cy.get(selectors.constructorIngredient).should('not.exist');
  });
});
