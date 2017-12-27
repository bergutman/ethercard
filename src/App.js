import React, { Component } from 'react';
import ethers from 'ethers';
import logo from './logo.png';
import './App.css';

// Create a wallet
var Wallet = ethers.Wallet;
let mnemonic = ethers.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
var wallet = Wallet.fromMnemonic(mnemonic);
console.log("Address: " + wallet.address);

class App extends Component {
  constructor(props) {
    super(props);
    this.updateDesiredFunds = this.updateDesiredFunds.bind(this);
    this.addFunds = this.addFunds.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.importGift = this.importGift.bind(this);
    this.updateImportKey = this.updateImportKey.bind(this);
    // init state
    this.state = {
      balance: 0,
      desiredFunds: 0,
      desiredWei: 0,
      importKey: '',
      importedBalance: 0,
      importedAddress: '',
      importedPrivateKey: ''
    };
  }

  updateDesiredFunds(event) {
    this.setState({
      desiredFunds: event.target.value,
      desiredWei: window.web3.toWei(event.target.value, 'ether')
    });
  }

  addFunds() {
    window.web3.eth.sendTransaction({from: window.web3.eth.defaultAccount, to: wallet.address, value: this.state.desiredWei}, function(err, transactionHash) {
      if (!err)
        console.log(transactionHash);
    });
  }

  sendEmail() {
    window.open(`mailto:?subject=You Have Received Ether&body=You Have received ${this.state.desiredFunds} ETH! Your Redemption Code is: ${mnemonic}. Redeem at https://connor.io/ethercard`);
  }

  updateImportKey(event) {
    this.setState({
      importKey: event.target.value
    });
  }

  importGift() {
    let self = this;
    var importedWallet = Wallet.fromMnemonic(this.state.importKey);
    this.setState({
      importedAddress: importedWallet.address,
      importedPrivateKey: importedWallet.privateKey
    })
    window.web3.eth.getBalance(importedWallet.address, function(error, result){
      if(!error) {
      self.setState({
        importedBalance: window.web3.fromWei(result.toString(10), 'ether')
      })
      }
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Send Ethereum "Gift Cards" Demo</h1>
          <p>Requires MetaMask</p>
        </header>
        <p>- Done 100% in browser with <a href="https://github.com/ethers-io/ethers.js">Ethers.js</a>.</p>
        <p>- Doesn't require a smart contract.</p>
        <p>- Doesn't require sending a transaction to redeem your funds.</p>
        <p>- No fees except initial gas-fee.</p>
        <p>- Seemingly just as secure.</p>
        <p>- Made with create-react-app in ~15-30 minutes.</p>
        <div className="divider"></div>
        <p>Gift Card Preview:</p>
        <div className="Wallet-Info">
          <h1>You Have received {this.state.desiredFunds} ETH</h1>
          <p><strong>Redemption Code:</strong><br/> {mnemonic}</p>
        </div>
        <div className="Wallet-Actions">
          <div className="Add-Funds">
            <p><strong>Add Funds:</strong></p>
            <input type="text" value={this.state.desiredFunds} onChange={this.updateDesiredFunds} />
            <a className="btn-alt" onClick={() => this.addFunds()}>Add Funds</a>
          </div>
          <a className="btn" onClick={() => this.sendEmail()}>Send Gift Card As Email</a>
        </div>
        <div className="divider"></div>
        <div className="Import-Wallet">
          <p><strong>Import Gift Card:</strong></p>
          <p>(Wait for your transaction to confirm)</p>
          <input type="text" value={this.state.importKey} onChange={this.updateImportKey} />
          <a className="btn-alt" onClick={() => this.importGift()}>Import Gift Card</a>
          <h1>You Have received {this.state.importedBalance} ETH</h1>
          <p><strong>Private Key:</strong><br/> {this.state.importedPrivateKey}</p>

        </div>
      </div>
    );
  }
}

export default App;
