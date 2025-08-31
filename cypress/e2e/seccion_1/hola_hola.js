/*
describe("Bienvenida al curso de cypress sección 1", () =>{
    it("Mi primer test -> Hola mundo", ()=>{
        cy.log("Hola Mundo")
    })
})
*/
/*
describe("Bienvenida al curso de cypress sección 1", () =>{
    it("Segundo test -> campo name", ()=> {
        // Visitamos a la página de sauce demo/ swag labs
        cy.visit("localhost:3000")
        // Localizamos el elemento para escribir el nombre por su id
        // recordemos que para id usamos #
        cy.get("#name").type("MariaFernanda")
        // Hacemos una espera de 2S
        cy.wait(2000)
    })
})
*/
/*,
describe("Bienvenida al curso de cypress sección 1", () =>{
    it("Segundo test -> campo name", ()=> {
        // Visitamos a la página de sauce demo/ swag labs
        cy.visit("https://www.saucedemo.com/v1/")
        // Localizamos el elemento para escribir el nombre por su id
        // recordemos que para id usamos #
        cy.get("#user-name").type("MariaFernanda")
        // Hacemos una espera de 2S
        cy.wait(2000)
    })
})
    */


/*
describe('Simular múltiples prompts en carga de página', () => {
it('Carga la vista con nombre y edad simulados', () => {
    const nombre = 'Nombre de prueba';    // Valor para el primer prompt
    const edad = '25';           // Valor para el segundo prompt

    cy.visit('localhost:3000', {
    onBeforeLoad(win) {
        // Stub para múltiples llamadas a prompt
        cy.stub(win, 'prompt')
        .onCall(0).returns(nombre)
        .onCall(1).returns(edad);
    }
    });

    // Aquí no necesitas hacer clic, ya que los prompts se activan al cargar.
    // Solo verificas que la vista muestre los datos correctos.
    cy.get('h2.grad').should('contain.text', `Hola ${nombre}`);
    cy.get('p').should('contain.text', `${nombre} nació el año`);
    // Opcional: verificar si se calcula bien el año
    const year = 2024 - parseInt(edad);
    cy.get('p').should('contain.text', year);
});
});

*/

describe('Simular múltiples prompts en carga de página', () => {
it('Carga la vista con nombre y edad simulados', () => {
    const nombre = 'Nombre de prueba';
    const edad = '25';

    cy.visit('http://localhost:3000', {
    onBeforeLoad(win) {
        cy.stub(win, 'prompt')
        .onCall(0).returns(nombre)
        .onCall(1).returns(edad);
}
    });

    cy.get('h2.grad').should('contain.text', `Hola ${nombre}`);
    const year = 2024 - parseInt(edad);
    cy.get('p').should('contain.text', `${nombre} nació el año ${year}`);
});

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

it('Login con usuario invalido', () => {
    cy.visit('http://localhost:3000/login.html')
    cy.get('input[name="user"]').type('javier');
    cy.get('input[name="password"]').type('javier123');
    // Click en el botón (es de tipo "button")
    cy.get('button').click();
    
    //verifica que redirige correctamente a otra vista
    cy.url().should('include', '/login.html');
});
});



