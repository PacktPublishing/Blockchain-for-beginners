//Now that our Block and Blockchain classes have been set up we will now
 //test how they work by setting a pretend cryptocurrency to a new instance
  //of the blockchain class

//We will add new blocks to the blockchain of this cryptocurrency by 
 //passing in arguments of an index, a date, and an amount to serve as the data

//After we will perform a few tests to ensure that the hash of the block has been passed in

//We will then perform one more test where we will manipulate the data within one of the previous blocks
 //this should demonstrait in a simple way the security a blockchain provides by breaking the relationship with
 //with a previous block to detect fraud 

const SHA256 = require('crypto-js/sha256');
class Block{
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp
				+ JSON.stringify(this.data)).toString();
	}
}

class Blockchain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock(){
		return new Block(0, "01/01/2017", "Genesis Block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
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
//will created a few new "coins" to add to our blockchain.
//these will need to be passed the properties index, date, and amount of coins
danCoin.addBlock(new Block(1, "10/07/2017", {amount: 4}));
danCoin.addBlock(new Block(2, "12/07/2017", {amount: 10}));
//console log our blockchain and stringify 
console.log(JSON.stringify(danCoin, null, 4));
//each block should reference the previous block through the 
 //hashes each one returns
 //console log to make sure our chain is valid
 console.log('Is blockchain valid? ' + danCoin.isChainValid());
//COMMENT OUT CONSOLE LOGS WHEN DONE

 //try to manipulate the data of a previous block to see if 
  //the console log will return false
 //here we change the data of the block but nothing with the hash
 danCoin.chain[1].data = {amount: 100};
 //here we will recalculate the hash
 danCoin.chain[1].hash = danCoin.chain[1].calculateHash();
 console.log('Is blockchain valid? ' + danCoin.isChainValid());
 //if you tamper with a block the relationship with its previous block will be broken
 //this can be used to effectively detect fraud