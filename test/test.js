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
      assert.property(res, "blockchain", "Response does not have a property of blockchain");
    });
  });

  describe("#createBlockString()", () => {
    it("Should make a string of object data", () => {
      const generatedBlockString = cmgtCoin.createBlockString(testResponse)
      const correctBlockString = "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8CMGT Mining CorporationBob PIKAB11548689513858154874778871610312"

      assert.equal(generatedBlockString, correctBlockString)
    })
  })

  describe("#MakeChunks()", () => {
    it("Should take an array and fill it up to a multiple of 10 and return a multidimentional array with chunks of 10", () => {
      const asciiString = "10410110810811190210"
      const numberArray = asciiString.split("").map(char => parseInt(char))
      const chuckedArray = cmgtCoin.makeChunks(numberArray)
      
      assert.equal(chuckedArray.length, 2)
      assert.equal(chuckedArray[0].length, 10)
    })
  })

  describe("#toAsciiString()", () => {
    it("Should take a dirty string and return a string with ascii numers and not convert numbers to ascii", () => {
      const correctBlockString = "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8CMGT Mining CorporationBob PIKAB11548689513858154874778871610312"
      
      const correctAscii = "00007845499038871102974100679800229730989797102251019797231102899198108101262410205210231028677771847710511010511010367111114112111114971161051111106611198807375656611548689513858154874778871610312"
      const faultynumberAscii = "1041011081081119482148"

      assert.notEqual(cmgtCoin.toAsciiString("hello 90210"), faultynumberAscii, "Numbers are not ignored. Zero (0) is parsed as a boolian")
      assert.equal(cmgtCoin.toAsciiString(correctBlockString), correctAscii)
    })
  })

  describe("#sumChunks()", () => {
    it("Should take an array and sum all the chunks", () => {
      const chunkedArray =  [ [ 1, 0, 4, 1, 0, 1, 1, 0, 8, 1 ],
      [ 0, 8, 1, 1, 1, 9, 0, 2, 1, 0 ],
      [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] ]
      const correctArray = [ 1, 9, 7, 5, 5, 5, 7, 9, 7, 0 ];

      assert.deepEqual(cmgtCoin.sumChucks(chunkedArray), correctArray)
    })
  })

  describe("#countArrays()", () => {
    it("Should take two arrays and sum them", () => {
      const chunkedArray =  [
        [ 1, 0, 4, 1, 0, 1, 1, 0, 8, 1 ],
        [ 0, 8, 1, 1, 1, 9, 0, 2, 1, 0 ]
      ]
      const correctArray = [ 1, 8, 5, 2, 1, 0, 1, 2, 9, 1 ];

      assert.deepEqual(cmgtCoin.countArrays(chunkedArray[0], chunkedArray[1], 0), correctArray)
    })
  })

  describe("#mod10()", () => {
    it("Should take a blockstring and return a mod10 hash", () => {
      const blockString =  "000078454c038871fa4d67b0022a30baaf25eaa231f8991b108e2624f052f3f8CMGT Mining CorporationBob PIKAB11548689513858154874778871610312"
      const correctHash = "00005d430ce77ad654b5309a770350bfb4cf49171c682330a2eccc98fd8853cf"

      assert.equal(cmgtCoin.Mod10(blockString), correctHash)
    })
  })
});
