const Web3 = require('web3');
const web3 = new Web3("http://127.0.0.1:7545");

const user = '0xEe70a0B2E5fb9B3fBFF4e691c5e4a53EC317aC87';
const u_priv = 'db08847639154e2df55a233145fe5391981b8804b50b237b2489650505f4e54d';

const recv = '0x28bfC651f2F8396350daE7E3883952a7F053E828';

const Agenda = require('agenda');

function getTransactionCount(user){
  let count;
  console.log("Inside: ",user)
  web3.eth.getBlockNumber().then(console.log);
  // web3.eth.getTransactionCount(user, (err, txCount) => {
  //   if(err)
  //     console.log(err);
  //   else{
  //     count = txCount;
  //     console.log("Transaction count:",txCount)
  //   }
  // });
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
    console.log(job.attrs.data.useradd);
    await getTransactionCount(job.attrs.data.useradd, (count) => {
      console.log("Count: ", count)
    })
    process.exit(0);
  });

  // Wait for agenda to connect. Should never fail since connection failures
  // should happen in the `await MongoClient.connect()` call.
  await new Promise(resolve => agenda.once('ready', resolve));

  // Schedule a job for 1 second from now and persist it to mongodb.
  // Jobs are uniquely defined by their name, in this case "hello"
  agenda.schedule(new Date(Date.now() + 3000), 'transact',{useradd : user});
  agenda.start();
}

run().catch(error => {
  console.error(error);
  process.exit(-1);
});