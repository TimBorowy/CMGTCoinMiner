const assert = require('chai').assert;
const cmgtCoin = require('../cmgtCoin');

const testResponse = {
  "blockchain": {
    "_id": "5c5003d55c63d51f191cadd6",
    "algorithm": "mod10sha,0000",
    "hash": "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8",
    "nonce": "10312",
    "timestamp": 1548747788716,
    "__v": 0,
    "data": [
      {
        "_id": "5c4f20695c63d51f191cadd1",
        "from": "CMGT Mining Corporation",
        "to": "Bob PIKAB",
        "amount": 1,
        "timestamp": 1548689513858
      }
    ]
  },
  "transactions": [
    {
      "_id": "5c5003d55c63d51f191cadd7",
      "from": "CMGT Mining Corporation",
      "to": "Bas BOOTB",
      "amount": 1,
      "timestamp": 1548747733261,
      "__v": 0
    }
  ],
  "timestamp": 1548748101396,
  "algorithm": "mod10sha,0000",
  "open": true,
  "countdown": 57235
}


describe("CMGT Coin", function () {
  describe("#getNextBlock()", function () {
    it("Should return a json object with a data array in the blockchain property", async function () {
      this.timeout(4000);

      const res = await cmgtCoin.getNextBlock()
      assert.typeOf(res, "object");
      assert.property(res, "blockchain", "Response has property of blockchain");
    });
  });

  describe("#createBlockString()", () => {
    it("Should make a string of object data", () => {
      const generatedBlockString = cmgtCoin.createBlockString(testResponse)
      const correctBlockString = "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8CMGT Mining CorporationBob PIKAB11548689513858154874778871610312"

      assert.equal(generatedBlockString, correctBlockString)
    })
  })
});


// {
//   message: "blockchain pending",
//     open: false,
//       countdown: 52347
// }