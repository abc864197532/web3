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
const Contractaddress = '0xB9d971b6d93ae144f3a878e1D26435dceb7f09e6';

myContract = new web3.eth.Contract(ABI, Contractaddress);

// ==== DOM element ===

const resultElement1 = html `<div></div>`
const resultElement2 = html `<div></div>`

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
      inputAccount.value = address;
      render();
    }
  });
}

// ===== Click Event =====

function donate(event) {
  let account = web3.eth.defaultAccount;
  console.log('account: ', account);
  myContract.methods.transfer(account, 1).call((err, data) => {
    if (err) return console.error(err);
    console.log('>>> donate ok.');
  });
}

function withdrawal(event) {
  let account = web3.eth.defaultAccount;
  myContract.methods.get(account).call((err, data) => {
    if (err) return console.error(err);
    console.log('>>> withdrawal ok.');
  });
}

// ===== Event =====

function queryBalance(event) {
  web3.eth.getBalance(inputAccount.value, (err, balance) => {
    let account = web3.eth.defaultAccount;
    let number1 = web3.utils.fromWei(balance, 'ether');
    const newElement1 = html `<div class="${css.result}">結果：${number1} Ether</div>`
    morphdom(resultElement1, newElement1);
    let number2 = 0;
    myContract.methods.balanceOf(account).call((err, data) => {
      if (err) return console.error(err);
      number2 = data;
      console.log('>>> query ABC ok.');
    });
    const newElement2 = html `<div class="${css.result}">結果：${number2} Ether</div>`
    morphdom(resultElement2, newElement2);
  });
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
  `)
}

if (typeof web3 !== 'undefined') start();