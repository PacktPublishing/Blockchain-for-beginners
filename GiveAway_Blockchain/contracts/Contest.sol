// Specifies the version of solidity that code is written with
//REFRESH THE PAGE IN ORDER TO PICK A DIFFERENT ADDRESS. IF YOU DOUBLE ENTER YOU MAY NEED TO RE-DEPLOY CAUSE IT MAY BREAK
pragma solidity ^0.4.17;


contract Contest {

    // It maintains manager address who create the contract.
    address private manager;

    // It maintains winner address
    address private winnerAddress;

    // It maintains Contest status, by default it's false
    // and it will become true once pick up the winner
    bool private isWinnerSelected = false;

    // A struct is a custom type. It can be defined with a
    // name and associated properties inside of it.
    // Here, we have a struct of Participant, which will store their name, phone and email.
    struct Participant {
        string name;
        string phone;
        string email;
    }

    // A constructor is an optional function with the same name as the contract which is
    // executed upon contract creation
    // It registers the creator as manager
    function Contest() public {
        // Assign manager address
        manager = msg.sender;
    }

    // This declares a state variable that
    // stores a 'Participant' struct for each possible Ethereum address.
    mapping(address => Participant) private participants;

    // It maintains all the participants address list.
    address[] private participantList;

    // This function is used to create a new registeration.
    // The keyword "public" allows function to accessable from outside.
    // The keyword "payable" is required for the function to
    // be able to receive Ether.
    function registration(string _name, string _phone, string _email) public payable {
        // require function used to ensure condition are met.

        // check ether value should be greater than '.00001'
        require(msg.value > .00001 ether);
        // check isWinnerSelected should be 'false'
        require(!isWinnerSelected);

        // assigns reference
        Participant storage participant = participants[msg.sender];

        participant.name = _name;
        participant.phone = _phone;
        participant.email = _email;

        // Add address to participant list
        participantList.push(msg.sender);

        // send ether to manager account
        sendAmount(msg.value, manager);
    }

    // This function is used to pick the winner.
    function pickWinner() public {
        // Check the sender address should be equal to manager since the manager can only pick the winner
        require(msg.sender == manager);

        // Randamloy select one participant among all the participants.
        uint index = random() % participantList.length;

        // Assign winner participant address
        winnerAddress = participantList[index];

        // Change isWinnerSelected to 'true'
        isWinnerSelected = true;
    }
//--------------END VIDEO 1-----------------------------
    // This function is used to send ether to winner address
    //MAKE SURE YOU SPECIFIY HOW MUCH ETHER TO BE SENT
    function transferAmount() public payable {
        // check ether value should be greater than '.0001'
        require(msg.value > .0001 ether);
        // Check the sender address should be equal to manager address
        // since the manager can only send ether to winner
        require(msg.sender == manager);
        // check isWinnerSelected should be 'true'
        require(isWinnerSelected);
        // send ether to winner
        sendAmount(msg.value, winnerAddress);
    }

    // This function is used to return isWinnerSelected
    function getIsWinnerSelected() public view returns (bool) {
        return isWinnerSelected;
    }

    // This function is used to return participantList
    function getParticipants() public view returns (address[]) {
        return participantList;
    }

    // This function is used to return winner name
    function getWinner() public view returns (string) {
        // check isWinnerSelected should be 'true'
        require(isWinnerSelected);
        return participants[winnerAddress].name;
    }

    // This function is used to return manager
    function getmanager() public view returns (address) {
        return manager;
    }

    // This function is used to transfer ether to particular address
    function sendAmount(uint _amount, address _account) private {
        _account.transfer(_amount);
    }

    // This function is used to return one number randomly from participantList
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, participantList));
    }
//---------------END VIDEO 2-----------------------------
}