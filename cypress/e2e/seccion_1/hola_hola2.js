describe('Acceder a cards logueado', () => {


it('Login con usuario valido', () => {
    cy.visit('http://localhost:3000/login.html')
    cy.get('input[name="user"]').type('javier');
    cy.get('input[name="password"]').type('javier');
    // Click en el botón (es de tipo "button")
    cy.get('button').click();
    //cy.get('button[type="submit"]').click();
    
    //ferifica que redirige correctamente a otra vista
    cy.url().should('include', '/proyectosDigitales.html');
});


});