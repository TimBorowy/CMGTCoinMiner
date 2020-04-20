const cmgtCoin = require("./cmgtCoin")
const axios = require("axios")
const { performance } = require('perf_hooks');

async function mineCoin() {

  const nextBlock = await cmgtCoin.getNextBlock()

  console.log("Got block data from API. Start mining now...")

  if(!nextBlock.open){
    console.log(`blockchain is pending. Try again in ${nextBlock.countdown / 1000} seconds`)
    console.log(nextBlock)
    return
  }

  performance.mark('Start mining');

  const blockString = cmgtCoin.createBlockString(nextBlock);
  const mod10 = cmgtCoin.Mod10(blockString)
  const transactionString = cmgtCoin.createTransactionString(nextBlock, mod10)

  let nonce = 0
  let hash = ""

  while (!hash.startsWith("0000")) {
    nonce++
    hash = cmgtCoin.Mod10(transactionString + nonce)
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