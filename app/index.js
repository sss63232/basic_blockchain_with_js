/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

// ================================
// START YOUR APP HERE
// ================================

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = ``) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(
            this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data)
        ).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(
            0,
            `01/01/2018`,
            `This is the genesis block.`,
            0
        );
    }

    getLastBlock() {
        const length = this.chain.length;
        return this.chain[length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        const chainLength = this.chain.length;
        for (let i = 1; i < chainLength; i++) {
            const block = this.chain[i];
            if (block.hash !== block.calculateHash())
                return false;

            const previousBlock = this.chain[i - 1];
            if (block.previousHash !== previousBlock.hash)
                return false;
        }

        return true;
    }
}

// create a kind of coin called 'textBTC'

const testBTC = new Blockchain();
testBTC.addBlock(
    new Block(1, `01/02/2018`, {
        hello: `hi`,
        des: `I'm the NO.2 block`,
    })
);
testBTC.addBlock(new Block(2, `01/02/2018`, [1, 2, 3]));
testBTC.addBlock(new Block(3, `01/02/2018`, `NO~~`));

console.log('--------');
console.log(testBTC.chain);
console.log(
    `Is current chain valid? => ${testBTC.isChainValid()}`
);
console.log('--------');

console.log('--------');
console.log(`修改鍊上某 block 數據`);
testBTC.chain[2].data = 'XXXXXXXXXXXXX';
console.log('--------');

console.log('--------');
console.log(testBTC.chain);
console.log(
    `Is current chain valid? => ${testBTC.isChainValid()}`
);
console.log('--------');
