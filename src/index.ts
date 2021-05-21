import * as CryptoJS from "crypto-js";

class Block {
  static calculateBlockHash = (
    index:number, 
    previousHash:string, 
    timestamp:number, 
    data:string
    ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block) : boolean => 
  typeof aBlock.index === "number" && 
  typeof aBlock.hash === "string" && 
  typeof aBlock.previousHash ==="string" &&
  typeof aBlock.timestamp === "number" &&
  typeof aBlock.data === "string";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;


  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ){
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock:Block = new Block(0, "2020202020202", "", "hello", 123456)

let blockchain: Block[] = [genesisBlock]; //제네시스 블럭을 배열에 넣어 블록체인에 할당

const getLatesBlock = () : Block => blockchain[blockchain.length - 1]; // 가장 최근의 블럭체인을 가져온다.

const getNewTimeStamp = () : number => Math.round(new Date().getTime() / 1000); 

const createNewBlock = (data:string) : Block => {
  const previousBlock: Block = getLatesBlock();
  const newIndex : number = previousBlock.index + 1;
  const newTimestamp : number = getNewTimeStamp();
  const newHash : string = Block.calculateBlockHash(
    newIndex, 
    previousBlock.hash, 
    newTimestamp,
    data    
  );

  const newBlock: Block = new Block(
    newIndex, 
    newHash, 
    previousBlock.hash, 
    data, 
    newTimestamp
  );
  addBlock(newBlock);
  return newBlock;
};


const getHashforBlock = (aBlock: Block): string => 
Block.calculateBlockHash(
  aBlock.index, 
  aBlock.previousHash, 
  aBlock.timestamp, 
  aBlock.data) //candidateblock의 hash계산


//isBlockValid 함수는 제공되는 블록이 유효한지 아닌지를 판단할거기 때문에, 함수 리턴 타입은 boolean으로 선언한다.
const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if(!Block.validateStructure(candidateBlock)){
    return false;
     //블록체인 구조가 아니면 false
  } else if(previousBlock.index + 1 !== candidateBlock.index){ 
    return false;
      //이전 블록체인의 index번호 +1 과 비교하는 현재 블록체인의 인덱스 값이 다르면 false 
  } else if(previousBlock.hash !== candidateBlock.previousHash){
    return false;
    //이전 블록체인의 해쉬와 현재 비교하는 블록체인의 이전해쉬가 다르면 false
  } else if(getHashforBlock(candidateBlock)!== candidateBlock.hash){ 
    return false;
    //aBlock인 candidateblock의 Hash의 결과값이 candidate hash와 다르다면 false 
    //(쉽게 설명하자면, 나 자신의 해쉬를 계산한거와 나 자신의 해쉬가 다르면 false란 말임 )
  }else{
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if(isBlockValid(candidateBlock, getLatesBlock())){ //isBlockValid 함수가 true라면
    blockchain.push(candidateBlock) 
  }
}

  createNewBlock("second block");
  createNewBlock("third block");
  createNewBlock("fourth block");

  console.log(blockchain);

  // [
  //   Block {
  //     index: 0,
  //     hash: '2020202020202',
  //     previousHash: '',
  //     data: 'hello',
  //     timestamp: 123456
  //   },
  //   Block {
  //     index: 1,
  //     hash: '8f78d471aed5a8e9bbec8705cb3998794429ba7cf63842e5a474211231ba5903',
  //     previousHash: '2020202020202',
  //     data: 'second block',
  //     timestamp: 1621584003
  //   },
  //   Block {
  //     index: 2,
  //     hash: '81f611ce85ece62373ed51e575ba763e6ef1f16219360369a6bf3f30c279027c',
  //     previousHash: '8f78d471aed5a8e9bbec8705cb3998794429ba7cf63842e5a474211231ba5903',
  //     data: 'third block',
  //     timestamp: 1621584003
  //   },
  //   Block {
  //     index: 3,
  //     hash: 'a1317b1da94fa065768ffd15fca8b5ccf96c35196407c6bd36c8b6ba1a3770c4',
  //     previousHash: '81f611ce85ece62373ed51e575ba763e6ef1f16219360369a6bf3f30c279027c',
  //     data: 'fourth block',
  //     timestamp: 1621584003
  //   }
  // ]

  
  export {};


  // class 안에있는 static 함수는 메서드로서 밖에서 불러와 쓸 수 있도록 만들어주는 기능이다.
  // 이제 우리는 블록이 is Valid라는 구조를 가지는지 확인할것
  // 해쉬가 정확한지 등 확인하기 위해서 
  // 블록체인의 기반은 블록들이 자신의 전 블록으로의 링크가 있다.
  // 그래서 candidateBlock(블록체인이 맞는지 검사하는 블록) previousBlock(바로 이전 블록체인) 을 비교하여 유효성검사를 할 수 있다 (isBlockValid)