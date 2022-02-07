// 匯入模組
const Web3 = require('web3');
const html = require('nanohtml');
const csjs = require('csjs-inject');
const morphdom = require('morphdom');

// 初始化 web3.js
async function web3Init() {
  if (ethereum) {
    // ATTENTION: In an effort to improve user privacy, MetaMask will stop exposing user accounts to dapps by default beginning November 2nd, 2018. Dapps should call provider.enable() in order to view and use accounts.Please see https://bit.ly/2QQHXvF for complete information and up-to-date example code.
    web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
    } catch (error) {}
  } else if (web3) {
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

web3Init();

// 設定 css inject
const css = csjs `
  .box {
  }
  .input {
    margin: 10px;
    width: 500px;
    font-size: 20px;
  }
  .button {
    margin-top: 10px;
    font-size: 20px;
    width: 180px;
    background-color: #4CAF50;
    color: white;
  }
  .result {
    margin: 10px;
  }
  img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 150px;
  }
`

const address = '';
const ABI = require('./abi.json');
const Contractaddress = '0x9641e24606a49270c3Bf3A9149537137929c161D'

myContract = new web3.eth.Contract(ABI, Contractaddress);

// ==== DOM element ===

const resultElement1 = html `<div></div>`
const resultElement2 = html `<div></div>`
const resultElement3 = html `<div></div>`

// ===== Preload =====

function start() {
  console.log('=== start ===');
  getNetworkId({});
}

function getNetworkId(result) {
  console.log('>>> 1');
  web3.eth.net.getId(function (err, networkId) {
    if (networkId != 42) {
      alert('It only support Kovan network!');
    } else {
      result.networkId = networkId;
      getAccounts(result);
    }
  });
}

function getAccounts(result) {
  console.log('>>> 2');
  web3.eth.getAccounts(function (err, addresses) {
    if (!addresses[0]) {
      alert('please install or login your metamask.');
    } else {
      const address = addresses[0];
      web3.eth.defaultAccount = address;
      render();
    }
  });
}

// ===== Click Event =====

function donate(event) {
  let account = web3.eth.defaultAccount;
  console.log('account: ', account);
  myContract.methods.donate().send({
    from: account,
    gasLimit: web3.utils.toHex(1000000), 
    gasPrice: web3.utils.toHex(web3.utils.toWei('1', 'gwei'))
  }, (err, data) => {
    if (err) return console.error(err);
    console.log('>>> donate ok.');
  });
  const newElement = html `<div class="${css.result}">Donate Success.</div>`
  morphdom(resultElement3, newElement);
}

function withdrawal(event) {
  let account = web3.eth.defaultAccount;
  console.log('account: ', account);
  myContract.methods.get().send({
    from: account,
    gasLimit: web3.utils.toHex(1000000), 
    gasPrice: web3.utils.toHex(web3.utils.toWei('1', 'gwei'))
  }, (err, data) => {
    if (err) return console.error(err);
    console.log('>>> withdrawal ok.');
  });
  const newElement = html `<div class="${css.result}">Withdrawal Success.</div>`
  morphdom(resultElement3, newElement);
}

// ===== Event =====

function queryBalance(event) {
  let account = web3.eth.defaultAccount;
  web3.eth.getBalance(account, (err, balance) => {
    let number = web3.utils.fromWei(balance, 'ether');
    const newElement = html `<div class="${css.result}">${number} Ether</div>`
    morphdom(resultElement1, newElement);
  });
  myContract.methods.balanceOf(account).call((err, balance) => {
    let number = balance;
    const newElement = html `<div class="${css.result}">${number} ABC</div>`
    morphdom(resultElement2, newElement);
  });
  console.log('>>> query ok.');
}

// ===== render ===== 

function render() {
  console.log('>>> 3');
  document.body.appendChild(html `
  <div class=${css.box} id="app">
    Your account is： ${web3.eth.defaultAccount}<br>
    <button class=${css.button} onclick=${queryBalance}>查詢 Ether & ABC 金額</button>
    ${resultElement1}
    ${resultElement2}
  </div>
  <button class=${css.button} onclick=${withdrawal}>Withdrawal 1 ABC</button>
  <button class=${css.button} onclick=${donate}>Donate 1 ABC</button>
    ${resultElement3}
  `)
}

if (typeof web3 !== 'undefined') start();