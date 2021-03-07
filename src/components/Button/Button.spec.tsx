import React from "react";
import { mount } from "@cypress/react";

import Button from "./Button";

describe("Button", function () {
  it("renders the todo list", function () {
    mount(<Button primary />);
    cy.contains("Button").should("exist");
  });
});
