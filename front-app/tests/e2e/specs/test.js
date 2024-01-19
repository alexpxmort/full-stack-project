// https://docs.cypress.io/api/table-of-contents

describe("Home page /", () => {
  it("should visits the page /", () => {
    cy.visit("/");
    cy.contains("button", "Enviar");
  });

  it("should show a warning when no file is selected", () => {
    cy.visit("/");

    cy.contains("button", "Enviar").click();

    cy.get(".custom-alert")
      .should("exist")
      .invoke("text")
      .should("include", "É obrigatório selecionar ao menos um arquivo!");
  });
});
