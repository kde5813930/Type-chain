"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
class Block {
    constructor(index, hash, previousHash, data, timestamp) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}
Block.calculateBlockHash = (index, previousHash, timestamp, data) => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
Block.validateStructure = (aBlock) => typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";
const genesisBlock = new Block(0, "2020202020202", "", "hello", 123456);
let blockchain = [genesisBlock]; //제네시스 블럭을 배열에 넣어 블록체인에 할당
const getLatesBlock = () => blockchain[blockchain.length - 1]; // 가장 최근의 블럭체인을 가져온다.
const getNewTimeStamp = () => Math.round(new Date().getTime() / 1000);
const createNewBlock = (data) => {
    const previousBlock = getLatesBlock();
    const newIndex = previousBlock.index + 1;
    const newTimestamp = getNewTimeStamp();
    const newHash = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimestamp, data);
    const newBlock = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
};
const getHashforBlock = (aBlock) => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data); //candidateblock의 hash계산
//isBlockValid 함수는 제공되는 블록이 유효한지 아닌지를 판단할거기 때문에, 함수 리턴 타입은 boolean으로 선언한다.
const isBlockValid = (candidateBlock, previousBlock) => {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
        //블록체인 구조가 아니면 false
    }
    else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
        //이전 블록체인의 index번호 +1 과 비교하는 현재 블록체인의 인덱스 값이 다르면 false 
    }
    else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
        //이전 블록체인의 해쉬와 현재 비교하는 블록체인의 이전해쉬가 다르면 false
    }
    else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
        //aBlock인 candidateblock의 Hash의 결과값이 candidate hash와 다르다면 false 
        //(쉽게 설명하자면, 나 자신의 해쉬를 계산한거와 나 자신의 해쉬가 다르면 false란 말임 )
    }
    else {
        return true;
    }
};
const addBlock = (candidateBlock) => {
    if (isBlockValid(candidateBlock, getLatesBlock())) { //isBlockValid 함수가 true라면
        blockchain.push(candidateBlock);
    }
};
createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");
console.log(blockchain);
// class 안에있는 static 함수는 메서드로서 밖에서 불러와 쓸 수 있도록 만들어주는 기능이다.
// 이제 우리는 블록이 is Valid라는 구조를 가지는지 확인할것
// 해쉬가 정확한지 등 확인하기 위해서 
// 블록체인의 기반은 블록들이 자신의 전 블록으로의 링크가 있다.
// 그래서 candidateBlock(블록체인이 맞는지 검사하는 블록) previousBlock(바로 이전 블록체인) 을 비교하여 유효성검사를 할 수 있다 (isBlockValid)
//# sourceMappingURL=index.js.map