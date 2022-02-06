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

// ==== DOM element ===

const inputAccount = html `<input class=${css.input} type="text" value=${address} placeholder="輸入你要查詢的帳戶"/>`;
const resultElement = html `<div></div>`

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
    }
    result.networkId = networkId;
    getAccounts(result);
  });
}

function getAccounts(result) {
  console.log('>>> 2');
  web3.eth.getAccounts(function (err, addresses) {
    if (!addresses[0]) alert('please install or login your metamask.');
    const address = addresses[0];
    web3.eth.defaultAccount = address;
    inputAccount.value = address;
  });
}

// ===== Event =====

function queryBalance(event) {
  web3.eth.getBalance(inputAccount.value, (err, balance) => {
    let number = web3.utils.fromWei(balance, 'ether');
    const newElement = html `<div class="${css.result}">結果：${number} Ether</div>`
    morphdom(resultElement, newElement);
  });
}

// ===== render ===== 

function render() {
  document.body.appendChild(html `
  <div class=${css.box} id="app">
    ${inputAccount}
    <button class=${css.button} onclick=${queryBalance}>查詢 Ether 金額</button>
    ${resultElement}
  </div>
 `)
}

if (typeof web3 !== 'undefined') start();
render();