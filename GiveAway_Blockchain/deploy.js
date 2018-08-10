const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const {interface, bytecode} = require('./compile.js');

const provider = new HDWalletProvider(
	// 'defy wave second park guide exhaust vacuum quick define rookie sphere trip',
	'identify click toward exhaust outer sketch dune bicycle april pluck album believe',
	'https://rinkeby.infura.io/v3/fb974d4f6d1e49ad92aad96dcdf610d4'
);



const web3 = new Web3(provider);

const deploy = async () => {
	const accounts =  await web3.eth.getAccounts();

	console.log('deploying from ', accounts[0]);

	const ABI = interface;

	const deployedContract = await new web3.eth.Contract(JSON.parse(ABI))
	.deploy({data: bytecode})
	.send({
	  gas: '1000000',
	  from: accounts[0]
	});
	console.log('contract deployed to', deployedContract.options.address);
}

deploy();

