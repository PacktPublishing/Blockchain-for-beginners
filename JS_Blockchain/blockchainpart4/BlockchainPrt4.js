
//Previously we secured our blockchain 
  //with a proof-of-work algorithm
//we will now make it a simple crypto currency 
  //by adding transactions and rewards
//mining rewards help motivate miners to 
 //produce more blocks and coins in the token economy

const SHA256 = require('crypto-js/sha256');

//block class must now receive multiple transacitons
//we will remove the index because the 
  //index in the blockchain is determined by their 
   //position in the 
   //blockchain and not by an index attribute. 
   //Also be sure to remove it from the genesisBlock 
   //down in the code
//we will also add transactions as an argument

//now we will create a new class for Transactions
class Transaction{
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}
//we now need a place to store transactions, mining rewards, 
//and a new method to mine a new block for 
//the pending transactions


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

//add new property for pending transactions and mining rewards, also reduce the difficulty for
 //more efficient testing
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

	//we no long need the addBlock method we will 
	//replace this now with the a method to
	 //mine pending transactions
	// addBlock(newBlock){
	// 	newBlock.previousHash = this.getLatestBlock().hash;
	// 	newBlock.mineBlock(this.difficulty);
	// 	this.chain.push(newBlock);
	// }

	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingTransactions);
		//real world crypto currencies it is not possible to 
		 //add all pending transactions to an array
		 //because there is simply WAY TOO MANY transactions 
		  //going on.
		 //instead miners get to choose which transactions 
		  //to include and which they dont. 
		   //Miners pick their transactions to include

		 //now we mine the block with the difficulty
		 block.mineBlock(this.difficulty);

		 //now reset pending transactions area and 
		  //create a new transaction to give the miner 
		   //his/her reward
		 this.pendingTransactions = [
		 	new Transaction(null, miningRewardAddress, this.miningReward)
		 ];
		 console.log('Block successfully mined');
		 this.chain.push(block);
	}

	//add a way to push the transaction to the pending 
	 //transactions
	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance = 0;

		//loop over all blocks in our blockchain
		for(const block of this.chain){
			for (const trans of block.transactions){
				//if you are the from address you would be 
				  //decreasing your balance
				//if you are the to address you would be 
				 //increasing your balance
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


