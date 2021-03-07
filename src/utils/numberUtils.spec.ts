import { addNumbers } from "./numberUtils";

describe("addNumbers", function () {
  it("should return 5 when add 2 and 3", function () {
    expect(addNumbers(2, 3)).to.equal(5);
  });
});
