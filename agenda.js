const Web3 = require('web3');
const web3 = new Web3("http://127.0.0.1:7545");
const Tx = require("ethereumjs-tx");

const user = '0xEe70a0B2E5fb9B3fBFF4e691c5e4a53EC317aC87';
const u_priv = 'db08847639154e2df55a233145fe5391981b8804b50b237b2489650505f4e54d';
const abi = [{"constant":false,"inputs":[{"name":"_premium","type":"uint256"}],"name":"setPremium","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_reason","type":"string"}],"name":"requestRecords","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recordID","type":"uint256"},{"name":"_masterkey","type":"string"}],"name":"getRecordsRenewal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"policyGrace","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_coverage","type":"uint256"}],"name":"renewPolicy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmRenewal","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"applyPolicy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recordID","type":"uint256"},{"name":"_masterkey","type":"string"}],"name":"getRecordsApplied","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRecords","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renewPolicy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPremium","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"policyLapse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmPolicy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"policyInactive","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getDetails","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint8"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"prevState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"contractBuyer","type":"address"},{"name":"contractSeller","type":"address"},{"name":"_coverage","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"}];

const recv = '0xa577C9d2BA3bB4aD1e09df6dFf697Cb3A639eB7a';

const Agenda = require('agenda');

async function getTransactionCount(data){
  
  const contract = data.contract
  const worker = data.worker
  console.log("Inside: ",contract,worker)
  //await web3.eth.getBlockNumber().then(console.log);
  await web3.eth.getTransactionCount(worker, (err, txCount) => {
    var data = new web3.eth.Contract(abi, contract);
   // console.log(data);
    console.log(data.methods.applyPolicy())
    var x = data.methods.applyPolicy()
    const txObject = {
      nonce : txCount,
      to : contract,   
      gasPrice : 0x0,
      gasLimit : web3.utils.toHex(6000000),
      data : x,
    }

    //Sign a transaction
  const tx = new Tx(txObject);
  tx.sign(u_priv);

  const serializedTransaction = tx.serialize();
  const raw = "0x" + serializedTransaction.toString("hex");

  //Broadcast a transaction
  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    console.log("txHash : ", txHash);
  });
  });
  // return count;
}

async function run() {
  //const db = await MongoClient.connect('mongodb://localhost:27017/agendatest');

  // Agenda will use the given mongodb connection to persist data, so jobs
  // will go in the "agendatest" database's "jobs" collection.
  const agenda = new Agenda({db:{address:'mongodb://localhost:27017/agendatest'}});

  // Define a "job", an arbitrary function that agenda can execute
  agenda.define('transact', async (job,done) => {
    console.log('transact : in job');
    console.log(job.attrs.data.contract);
    await getTransactionCount(job.attrs.data, () => {
      console.log("done")
    })
    process.exit(0);
  });

  // Wait for agenda to connect. Should never fail since connection failures
  // should happen in the `await MongoClient.connect()` call.
  await new Promise(resolve => agenda.once('ready', resolve));

  // Schedule a job for 1 second from now and persist it to mongodb.
  // Jobs are uniquely defined by their name, in this case "hello"

  agenda.schedule(new Date(Date.now() + 3000), 'transact',{contract : recv, worker : user});
  agenda.start();
}

run().catch(error => {
  console.error(error);
  process.exit(-1);
});