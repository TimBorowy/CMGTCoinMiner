const axios = require("axios")
const crypto = require('crypto');

async function getNextBock() {
  try {
    const res = await axios("https://programmeren9.cmgt.hr.nl:8000/api/blockchain/next")
    return res.data;

  } catch (err) {
    console.log(err);
  }
}

function createBlockString(nextBlock) {
  let blockString = ""

  blockString += nextBlock.blockchain.hash
  blockString += nextBlock.blockchain.data[0].from
  blockString += nextBlock.blockchain.data[0].to
  blockString += nextBlock.blockchain.data[0].amount
  blockString += nextBlock.blockchain.data[0].timestamp
  blockString += nextBlock.blockchain.timestamp
  blockString += nextBlock.blockchain.nonce
  return blockString

}

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    var R = [];
    for (var i = 0; i < this.length; i += chunkSize)
      R.push(this.slice(i, i + chunkSize));
    return R;
  }
});

function makeChunks(numberArray) {
  // Fill-up array to multiple of 10
  let amount = 10 - numberArray.length % 10
  for (let i = 0; i < amount; i++) {
    numberArray.push(i)
  }

  // Return multidimensional array in chunks of 10
  return numberArray.chunk(10)
}

function toAsciiString(string) {
  // Remove spaces
  let cleanString = string.split(" ").join("")

  return cleanString.split('').map(char => {
    // ParseInt with a letter returns NaN
    if (isNaN(char)) {
      // Only convert chars to acii codes if is not a number
      return char.charCodeAt(0)
    }
    // Just return the number
    return char


  }).join("")
}

/*function mod10(chunks) {
  console.log("chunkus", chunks)
  console.log("length", chunks.length)

  while (chunks.length > 1) {
    console.log("loop di loop")
    for (let i = 0; i <= 9; i++) {
      chunks[0][i] = (chunks[0][i] + chunks[1][i]) % 10
    }
    chunks.splice(1, 1)
  }
  return chunks[0]
}*/


function sumChucks(chunks) {

  if (chunks.length <= 1) {
    return chunks[0]
  }

  for (let i = 0; i <= 9; i++) {
    // Add next chunk to current chunk
    chunks[0][i] = (chunks[0][i] + chunks[1][i]) % 10
  }
  // Remove next chunk from list
  chunks.splice(1, 1)
  return sumChucks(chunks)
}

function Mod10(blockString) {
  // Convert string to ASCII string. Then split chars into array and pase chars to integer
  const numberArray = toAsciiString(blockString).split("").map(char => parseInt(char))

  const blocks = makeChunks(numberArray)
  const sumOfChunks = sumChucks(blocks).join("")

  return crypto.createHash('sha256').update(sumOfChunks).digest("hex")

}

function testHash(hash) {
  return hash.substr(0, 4) == "0000"
}



async function main() {

  const nextBlock = await getNextBock()
  const blockString = createBlockString(nextBlock);
  const mod10 = Mod10(blockString)

  let newBlockString = mod10

  newBlockString += nextBlock.transactions[0].from
  newBlockString += nextBlock.transactions[0].to
  newBlockString += nextBlock.transactions[0].amount
  newBlockString += nextBlock.transactions[0].timestamp
  newBlockString += nextBlock.timestamp


  let nonce = 0
  let hash = ""

  while (!testHash(hash)) {
    nonce++
    hash = Mod10(newBlockString + nonce)
  }

  console.log("Nonce", nonce)
  console.log("HASH", hash)

  const res = await axios.post("https://programmeren9.cmgt.hr.nl:8000/api/blockchain",
    {
      nonce: nonce,
      user: "Tim Borowy 0949866"
    }
  )

  console.log(res.data)
}

main();