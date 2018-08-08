//We will use this example to show
 //how blockchain works and to get a general idea of how blockchain 
 //technology functions through code
//However this is NOT to be used as a cryptocurrency or a legitmate blockchain
 //this is just a super small blockchain to demonstrait how blockchain works

//Here we will create our block class followed by our blockchain class
 //as well as scripting out specific constructors and methods that each
 //class will use
const SHA256 = require('crypto-js/sha256');
class Block{
	//index tells us where the block sits on the chain
	//timestamp tells us when the block was created
	//data includes any type of data associated with the block (details of transaction ect)
	//previousHash contains the hash of the block before the current one. This is important 
	 //because it showcases the integrity of the blockchain 
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		//will contain the hash of our block
		this.hash = this.calculateHash();
	}

	//identifies and calculates the hash then returns it as a string
	//will use sha256 but we will need to install a library to do this since it is
	 //not included in javascript
	 //npm install --save crypto-js and import at the top
	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp
				+ JSON.stringify(this.data)).toString();
	}
}

class Blockchain{
	constructor(){
		//first block on the blockchain is called a genesis block
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock(){
		return new Block(0, "01/01/2017", "Genesis Block", "0");
	}

	getLatestBlock(){
		//will return latest block in the chain
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		//anytime a property is changed within the block 
		 //we will need to update the properties
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
		//in reality we cannot add a block this easily there are many more checks
		 //for security purposes. This is just for this example to show how blocks are added.
	}

	//create a way to confirm integrity of the blockchain
	 //we will test if the chain is valid
	 isChainValid(){
	 	//do NOT start with block 0 since it is the genesis block
	 	for(let i = 1; i < this.chain.length; i++){
	 		const currentBlock = this.chain[i];
	 		const previousBlock = this.chain[i - 1];

	 		//check if the hash of the current block is valid
	 		if (currentBlock.hash !== currentBlock.calculateHash()){
	 			return false;
	 		}

	 		//check if the block points to the previous block
	 		 //and not something that does not exist
	 		if(currentBlock.previousHash !== previousBlock.hash){
	 			return false;
	 		}
	 	}
	 	return true;
	 }
}


