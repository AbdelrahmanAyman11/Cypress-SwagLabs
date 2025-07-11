describe('User Authentication for positive scenarios', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
  })

  it('should login successfully with valid credentials', () => {
    cy.url().should('include', '/inventory.html')
  })

  it('should logout successfully', () => {
    cy.get('#react-burger-menu-btn').click()
    cy.get('#logout_sidebar_link').click()
    cy.url().should('include', 'saucedemo.com')
  })
})

describe('User Authentication for Negative scenarios', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('Abood')
    cy.get('[data-test="password"]').type('12345')
    cy.get('[data-test="login-button"]').click()
  })

  it('should show error message for invalid credentials', () => {
  cy.visit('https://www.saucedemo.com/')
  cy.get('[data-test="username"]').type('invalid_user')
  cy.get('[data-test="password"]').type('wrong_password')
  cy.get('[data-test="login-button"]').click()
  cy.get('[data-test="error"]').should('be.visible').and('contain', 'Username and password do not match')
})
it('should not allow login with empty username', () => {
  cy.visit('https://www.saucedemo.com/')
  cy.get('[data-test="password"]').type('secret_sauce')
  cy.get('[data-test="login-button"]').click()
  cy.get('[data-test="error"]').should('be.visible').and('contain', 'Username is required')
})
it('should not allow login with empty password', () => {
  cy.visit('https://www.saucedemo.com/')
  cy.get('[data-test="username"]').type('standard_user')
  cy.get('[data-test="login-button"]').click()

  cy.get('[data-test="error"]').should('be.visible').and('contain', 'Password is required')

})
it('should not allow login for locked out user', () => {
  cy.visit('https://www.saucedemo.com/')
  cy.get('[data-test="username"]').type('locked_out_user')
  cy.get('[data-test="password"]').type('secret_sauce')
  cy.get('[data-test="login-button"]').click()

  cy.get('[data-test="error"]')
    .should('be.visible')
    .and('contain', 'Sorry, this user has been locked out.')
})


})



