const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddr, toAddr, amount) {
        this.fromAddr = fromAddr;
        this.toAddr = toAddr;
        this.amount = amount;
    }
}

class Block {
    constructor(
        timestamp,
        transactions,
        previousHash = ``
    ) {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;

        this.hash = this.calculateHash();

        this.nonsense = 0;
    }

    calculateHash() {
        const fullInput =
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.nonsense;

        return SHA256(fullInput).toString();
    }

    /**
     * 找到正確的 hash 碼
     *
     * @param {*} difficulty
     * @memberof Block
     */
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
    }
}

class Blockchain {
    constructor(difficulty, miningReward) {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];

        this.difficulty = difficulty;
        this.miningReward = miningReward;
    }

    createGenesisBlock() {
        return new Block(
            Date.parse(`01/01/2018`),
            [],
            null
        );
    }

    getLastBlock() {
        const length = this.chain.length;
        return this.chain[length - 1];
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLastBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    // 把上面的 addBlock() 改成 minePendingTransactions()

    minePendingTransactions(minerAddr) {
        // 增加一筆獎勵 miner 的交易
        this.pendingTransactions.push(
            new Transaction(
                null,
                minerAddr,
                this.miningReward
            )
        );

        const block = new Block(
            Date.now(),
            this.pendingTransactions // In reality, 不可能一次把所有 pendingTransaction 放在一個 block 中，必須選擇要放入哪些交易。
        );

        block.mineBlock(this.difficulty);
        this.chain.push(block);
        console.log('--------');
        console.log(`block successfully mined`);
        console.log('--------');

        // 清空 pendingTransactions 同
        this.pendingTransactions = [];
    }

    addTransaction(from, to, amount) {
        this.pendingTransactions.push(
            new Transaction(from, to, amount)
        );
    }

    getBalanceByAddr(address) {
        let balance = 0;

        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                const {
                    fromAddr,
                    toAddr,
                    amount,
                } = transaction;

                if (fromAddr === address) balance -= amount;
                if (toAddr === address) balance += amount;
            });
        });

        return balance;
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

const testBTC = new Blockchain(4, 100);
const minerAddr = `miner_addr`;

testBTC.addTransaction(`Tom_addr`, `Bob_addr`, 234);
testBTC.addTransaction(`Tom_addr`, `Mary_addr`, 10000);

console.log('--------');
console.log(`mine`);
console.log('--------');
testBTC.minePendingTransactions(minerAddr);
console.log('--------');
console.log(`finish mining`);
console.log(
    `miner's balance`,
    testBTC.getBalanceByAddr(minerAddr)
);
console.log('--------');

testBTC.addTransaction(`Tom_addr`, `Bob_addr`, 234);
testBTC.addTransaction(`Tom_addr`, `Mary_addr`, 10000);

console.log('--------');
console.log(`mine 2`);
console.log('--------');
testBTC.minePendingTransactions(minerAddr);
console.log('--------');
console.log(`finish mining`);
console.log(
    `miner's balance`,
    testBTC.getBalanceByAddr(minerAddr)
);
console.log('--------');
