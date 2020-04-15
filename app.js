const cmgtCoin = require("./cmgtCoin")
const axios = require("axios")
const { PerformanceObserver, performance } = require('perf_hooks');

async function mineCoin() {

  const nextBlock = await cmgtCoin.getNextBlock()

  performance.mark('Start mining');

  const blockString = cmgtCoin.createBlockString(nextBlock);
  const mod10 = cmgtCoin.Mod10(blockString)

  let newBlockString = mod10

  newBlockString += nextBlock.transactions[0].from
  newBlockString += nextBlock.transactions[0].to
  newBlockString += nextBlock.transactions[0].amount
  newBlockString += nextBlock.transactions[0].timestamp
  newBlockString += nextBlock.timestamp

  let nonce = 0
  let hash = ""

  while (!cmgtCoin.testHash(hash)) {
    nonce++
    hash = cmgtCoin.Mod10(newBlockString + nonce)
  }

  console.log("Nonce", nonce)
  console.log("HASH", hash)

  performance.mark('End mining');
  performance.measure('CMGT coin mining', 'Start mining', 'End mining');
  console.log("Mining took", performance.nodeTiming.duration, "miliseconds")

  const res = await axios.post("https://programmeren9.cmgt.hr.nl:8000/api/blockchain",
    {
      nonce: nonce,
      user: "Tim Borowy 0949866"
    }
  )

  console.log(res.data)
}

mineCoin();