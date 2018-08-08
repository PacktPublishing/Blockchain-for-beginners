//Now that we have updated our Block and Blockchain classes and 
	//added
 //our Transaction class, now we shall test out our small 
 	//blockchain
 //by creating a few transactions and running them in the 
 	//terminal

//This mock demonstraition will show how rewards are handed 
	//out to miners
 //once they successfully mine a block with a series of 0s in 
 	//front of it
 //we will also see how transactions can be sent and received 
 	//between two different accounts

//In this demo we won't be using the normal public keys 
	//you would normally use when processing a transaction
 //so here we will just make up some addresses
 
const SHA256 = require('crypto-js/sha256');

class Transaction{
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}


class Block{
	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp
				+ JSON.stringify(this.data) + this.nonce).toString();
	}

	mineBlock(difficulty){
	  while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
	  	this.nonce++;
	  	this.hash = this.calculateHash();
   }
	console.log("Block mined: " + this.hash);
   }
 }

class Blockchain {
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock(){
		return new Block("01/01/2017", "Genesis Block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}


	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingTransactions);

		 block.mineBlock(this.difficulty);

		 this.pendingTransactions = [
		 	new Transaction(null, miningRewardAddress, this.miningReward)
		 ];
		 console.log('Block successfully mined');
		 this.chain.push(block);
	}

	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance = 0;

		for(const block of this.chain){
			for (const trans of block.transactions){
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}

				if (trans.toAddress === address){
					balance += trans.amount;
				}
			}
		}

		return balance;
	}

	 isChainValid(){
	 	for(let i = 1; i < this.chain.length; i++){
	 		const currentBlock = this.chain[i];
	 		const previousBlock = this.chain[i - 1];

	 		if (currentBlock.hash !== currentBlock.calculateHash()){
	 			return false;
	 		}

	 		
	 		if(currentBlock.previousHash !== previousBlock.hash){
	 			return false;
	 		}
	 	}
	 	return true;
	 }
 }

let danCoin = new Blockchain();

//create some transactions
//in reality these addresses would be the public keys 
	//of someone's wallet such as a MetaMask wallet 
	//(which you will learn in the next section)
danCoin.createTransaction(new Transaction('address1', 'address2', 100));
danCoin.createTransaction(new Transaction('address2', 'address1', 50));

//these transactions will now go to the pending transactions 
 //area so now we much start the miner
 console.log('\nStarting the miner.');
 danCoin.minePendingTransactions('dan-address');

 console.log('\nBalance of dan is', danCoin.getBalanceOfAddress('dan-address'));
//the balance will be 0 because after a block has 
  //been mined we create the new transaction
 //to give a mining reward but that is added to the 
  //pendingTransactions
 //so the mining reward will only be given in the next 
  //minded block. Lets mine another.

console.log('\nStarting the miner. Second Time.');
danCoin.minePendingTransactions('dan-address');

console.log('\nBalance of dan is', danCoin.getBalanceOfAddress('dan-address'));
//by mining a second block we receive another award which 
 //is once again given to us
 //when the next block is mined.