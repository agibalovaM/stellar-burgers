/// <reference types="cypress" />

import { selectors } from './selectors';

type IngredientSelectorKey =
  | 'ingredientAddBun1'
  | 'ingredientAddMain1'
  | 'ingredientAddSauce1';

type IngredientLinkSelectorKey = 'ingredientLinkMain1' | 'ingredientLinkSauce1';

Cypress.Commands.add('visitConstructorPage', () => {
  cy.visit('/');
  cy.wait('@getIngredients');
});

Cypress.Commands.add('visitConstructorPageAsAuthorizedUser', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
      win.document.cookie = 'accessToken=test-access-token';
    }
  });

  cy.wait('@getIngredients');
  cy.wait('@getUser');
});

Cypress.Commands.add('addIngredientToConstructor', (selectorKey: IngredientSelectorKey) => {
  cy.get(selectors[selectorKey]).contains('Добавить').click();
});

Cypress.Commands.add('openIngredientModal', (selectorKey: IngredientLinkSelectorKey) => {
  cy.get(selectors[selectorKey]).click();
  cy.get(selectors.modal).should('be.visible');
});

Cypress.Commands.add('closeModal', () => {
  cy.get(selectors.modalClose).click();
  cy.get(selectors.modal).should('not.exist');
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(selectors.modalOverlay).click({ force: true });
  cy.get(selectors.modal).should('not.exist');
});

declare global {
  namespace Cypress {
    interface Chainable {
      visitConstructorPage(): Chainable<void>;
      visitConstructorPageAsAuthorizedUser(): Chainable<void>;
      addIngredientToConstructor(
        selectorKey: IngredientSelectorKey
      ): Chainable<void>;
      openIngredientModal(
        selectorKey: IngredientLinkSelectorKey
      ): Chainable<void>;
      closeModal(): Chainable<void>;
      closeModalByOverlay(): Chainable<void>;
    }
  }
}

export {};
