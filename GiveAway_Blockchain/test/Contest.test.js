//FIRST npm install --save web3@1.0.0-beta (supports asyhncrious data sending through promises)
 //npm install --save truffle-hdwallet-provider (will be needed for creating our custom provider on 
 //the Rinkby test network when we deploy)
 //npm install --save solc@0.4.21 will be needed to compile our solidity code
 
//npm install --save mocha ganache-cli
//open up the package.json and change the value of "test" under "scripts" to "mocha"
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');

let contest;
let accounts;

//deploy an instance of the contract and retrive 
//the test accounts before each test
beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	contest = await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode})
	.send({from: accounts[0], gas: '1000000'});
});

describe('Giveaway Contract', () => {
//test #1
	it('can deploy a contract', () => {
		assert.ok(contest.options.address);
	});

//test #2
	it('can allow an account to enter', async() => {
		//test for only one account added
		await contest.methods.registration('name', '9999999', 'email@gmail.com').send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether'),
			gas: '1000000'
		});

		const addresses = await contest.methods.getParticipants().call({
			from: accounts[0]
		});

		assert.equal(accounts[0], addresses[0]);
	});

//test #3
	it('requires a minimum amount of ether to enter', async() => {
		//we will use a try catch here to test if an error 
		//is thrown or not once ether is sent
		try{
			await contest.methods.enter().send({
				from: accounts[0],
				//200 wei not converted to ether for testing purposes
				value: 200
			});
			//if try does not throw an error 
			//(which most likely wont) it will miss the catch so we need 
			 //it assert false and then fail the test
			 assert(false);
		} catch(error){
			//assert checks for truthyness here
			assert(error);
		}
	});

//test #4
	it('allows multiple accounts to enter the contest', async() => {
		await contest.methods.registration("name", "9999999", "email@gmail.com").send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether'),
			gas: '1000000'
		});

		await contest.methods.registration("name2", "888888", "email2@gmail.com").send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether'),
			gas: '1000000'
		});

		await contest.methods.registration("name3", "777777", "email3@gmail.com").send({
			from: accounts[2],
			value: web3.utils.toWei('0.02', 'ether'),
			gas: '1000000'
		});

		const partipants = await contest.methods.getParticipants().call({
			from: accounts[0]
		});

		assert.equal(accounts[0], partipants[0]);
		assert.equal(accounts[1], partipants[1]);
		assert.equal(accounts[2], partipants[2]);

		assert.equal(3, partipants.length);

	});

//test #5
	it('allows only the manager to select a winner', async() => {
		try{
			await contest.methods.pickWinner().send({
				//not from the manager
				//since the contract is being created 
				//by accounts[0] each time in the
				 //beforeeach loop at the top, 
				 //this should show if accounts[1] can or cannot
				 //pick a winner since they are not the creator of the contract
				from: accounts[1]
			});
			assert(false);
		}catch(error){
			assert(error);
		}
	});

//test #6
	it('sends the prize money to the winner', async() => {
		//we will register and test from a 
		//different account that is not the manager 
		 //ideally the manager of the 
		 //contract would not enter the contest since they are hosting it
		 //however it is also inefficient to 
		 //test on the manager since they need to pay ether to 
		 //register into the contest AND also to transfer 
		 //the winning amount. This will always result
		 //in a lower final balance for the contract manager.
		await contest.methods.registration("name", "9999999", "email@gmail.com").send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether'),
			gas: '1000000'
		});

		const accountInitialBalance = await web3.eth.getBalance(accounts[1]);
		// console.log(accountInitialBalance);

		//any code after this line will test what happens 
		//after a winner has been picked
		await contest.methods.pickWinner().send({from: accounts[0]});

		await contest.methods.transferAmount().send({
			from: accounts[0], 
			value: web3.utils.toWei('0.04', 'ether')
		});
		
		const accountFinalBalance = await web3.eth.getBalance(accounts[1]);
		// console.log(accountFinalBalance);


		assert(accountFinalBalance > accountInitialBalance);

		const contestBalance = await web3.eth.getBalance(contest.options.address);
		assert(contestBalance == 0);
	});

});

