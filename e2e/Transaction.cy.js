describe('Transactions Happy Flow', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
  })

  it('should add item to cart and checkout', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.wait(500)
    cy.get('.shopping_cart_link').click()

    cy.url().should('include', '/cart.html')
    cy.get('[data-test="checkout"]').click()
    cy.wait(500)
    cy.get('[data-test="firstName"]').type('Test')
    cy.get('[data-test="lastName"]').type('User')
    cy.get('[data-test="postalCode"]').type('11111')
    cy.get('[data-test="continue"]').click()
    cy.wait(500)
    cy.get('[data-test="finish"]').click()
    cy.contains('Thank you for your order!').should('be.visible')
  })
})
describe('Transactions some Unhappy Scenarios', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
  })

 it('should not continue checkout with empty form fields', () => {
  // login steps...
  cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
  cy.get('.shopping_cart_link').click()
  cy.get('[data-test="checkout"]').click()

  // Leave all fields empty
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="error"]')
    .should('be.visible')
    .and('contain', 'Error: First Name is required')
})
it('should not complete checkout if cart is empty', () => {
  // Login
  cy.visit('https://www.saucedemo.com/')
  cy.get('[data-test="username"]').type('standard_user')
  cy.get('[data-test="password"]').type('secret_sauce')
  cy.get('[data-test="login-button"]').click()

  // Add and remove item
  cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
  cy.get('.shopping_cart_link').click()
  cy.get('[data-test="remove-sauce-labs-backpack"]').click()

  // Proceed to checkout
  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="firstName"]').type('Test')
  cy.get('[data-test="lastName"]').type('User')
  cy.get('[data-test="postalCode"]').type('12345')
  cy.get('[data-test="continue"]').click()

  // Attempt to finish order
  cy.get('[data-test="finish"]').click()

  // Assert that success message should NOT be visible
  cy.contains('Thank you for your order!').should('not.exist')  //This should fail (it currently appears!)
})


it('should calculate total price correctly at checkout', () => {
  cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
  cy.get('.shopping_cart_link').click()
  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="firstName"]').type('Price')
  cy.get('[data-test="lastName"]').type('Check')
  cy.get('[data-test="postalCode"]').type('99999')
  cy.get('[data-test="continue"]').click()
 let itemTotal, tax, total

  cy.get('.summary_subtotal_label')
    .invoke('text')
    .then((text) => {
      itemTotal = parseFloat(text.replace('Item total: $', ''))
    })

  cy.get('.summary_tax_label')
    .invoke('text')
    .then((text) => {
      tax = parseFloat(text.replace('Tax: $', ''))
    })

  cy.get('.summary_total_label')
    .invoke('text')
    .then((text) => {
      total = parseFloat(text.replace('Total: $', ''))

      // Assert that total === itemTotal + tax
      const calculated = (itemTotal + tax).toFixed(2)
      expect(total.toFixed(2)).to.equal(calculated)
    })
})

})

