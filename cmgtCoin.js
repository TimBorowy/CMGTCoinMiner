const axios = require("axios")
const crypto = require('crypto');

exports.getNextBlock = async () => {
  try {
    const res = await axios("https://programmeren9.cmgt.hr.nl:8000/api/blockchain/next")
    return res.data;

  } catch (err) {
    console.log(err);
  }
}

exports.createBlockString = (nextBlock) => {
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

exports.createTransactionString = (apiData, hash) => {
  let transaction = hash

  transaction += apiData.transactions[0].from
  transaction += apiData.transactions[0].to
  transaction += apiData.transactions[0].amount
  transaction += apiData.transactions[0].timestamp
  transaction += apiData.timestamp

  return transaction
}

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    var R = [];
    for (var i = 0; i < this.length; i += chunkSize)
      R.push(this.slice(i, i + chunkSize));
    return R;
  }
});

exports.makeChunks = (numberArray) => {
  // Fill-up array to multiple of 10
  let filAmount = 10 - numberArray.length % 10
  
  // when array is not a multiple of 10, fill up untill it is
  if(filAmount != 10){
    for (let i = 0; i < filAmount; i++) {
      numberArray.push(i)
    }
  }

  // Return multidimensional array in chunks of 10
  return numberArray.chunk(10)
}

exports.toAsciiString = (string) => {
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

exports.sumChucks = (chunks) => {

  if (chunks.length <= 1) {
    return chunks[0]
  }

  for (let i = 0; i <= 9; i++) {
    // Add next chunk to current chunk
    chunks[0][i] = (chunks[0][i] + chunks[1][i]) % 10
  }
  // Remove next chunk from list
  chunks.splice(1, 1)
  return this.sumChucks(chunks)
}

exports.Mod10 = (blockString) => {
  // Convert string to ASCII string. Then split chars into array and pase chars to integer
  const numberArray = this.toAsciiString(blockString).split("").map(char => parseInt(char))

  const chunks = this.makeChunks(numberArray)
  const sumOfChunks = this.sumChucks(chunks).join("")

  return crypto.createHash('sha256').update(sumOfChunks).digest("hex")

}
