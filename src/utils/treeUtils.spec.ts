import { findNode } from "./treeUtils";

const treeData = [
  { label: "Item 1", id: "1" },
  {
    label: "Item 2",
    id: "2",
    children: [
      { label: "Item 3", id: "3" },
      { label: "Item 4", id: "4" },
    ],
  },
  { label: "Item 5", id: "5" },
];

describe("The treeUtils", function () {
  describe("findNode", function () {
    it("should return the node node when it exists", function () {
      const result = findNode(treeData, "3");
      expect(result.id).to.equal("3");
    });

    it("should return null node when it does not exist", function () {
      const result = findNode(treeData, "9999");
      expect(result).to.equal(null);
    });
  });
});
