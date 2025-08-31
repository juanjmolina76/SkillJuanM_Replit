const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    baseUrl: "http://localhost:3000", // Cambia esto a la URL de tu aplicación
  },
});
