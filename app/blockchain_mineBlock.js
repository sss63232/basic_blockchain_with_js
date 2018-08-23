const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = ``) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

        this.nonsense = 0;
    }

    calculateHash() {
        const fullInput =
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonsense;

        return SHA256(fullInput).toString();
    }

    mineBlock(difficulty) {
        const fullZeroString = new Array(difficulty)
            .fill(0)
            .join(``);

        while (
            this.hash.substring(0, difficulty) !==
            fullZeroString
        ) {
            this.nonsense++;
            this.hash = this.calculateHash();
        }

        console.log('--------');
        console.log(
            `Mined Block`,
            this.nonsense,
            this.hash
        );
        console.log('--------');
    }
}

class Blockchain {
    constructor(difficulty) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
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
        newBlock.mineBlock(this.difficulty);
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

const testBTC = new Blockchain(4);

console.log('--------');
console.log(`start mining block1`);
console.log('--------');
testBTC.addBlock(
    new Block(1, `01/02/2018`, {
        hello: `hi`,
        des: `I'm the NO.2 block`,
    })
);

console.log('--------');
console.log(`start mining block2`);
console.log('--------');
testBTC.addBlock(new Block(2, `01/02/2018`, [1, 2, 3]));
