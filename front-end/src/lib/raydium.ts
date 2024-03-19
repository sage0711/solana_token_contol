import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
  } from '@solana/web3.js';
  
  export const removeLiquidity = async (
    connection: Connection,
    userWallet: Keypair,
    liquidityTokenAccount: PublicKey, // The account holding your liquidity tokens
    liquidityTokenMint: PublicKey, // The mint of your liquidity tokens
    liquidityTokenAmount: number, // The amount of liquidity tokens to remove
    poolTokenA: PublicKey, // The token A account in the pool
    poolTokenB: PublicKey, // The token B account in the pool
    slippage: number // The maximum slippage allowed
  ) => {
    // Fetch the pool account address from Raydium or compute it based on the token accounts
  
    // Construct the remove liquidity instruction
    const instructionData = Buffer.from([/* your instruction data */]);
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: userWallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: liquidityTokenAccount, isSigner: false, isWritable: true },
        { pubkey: liquidityTokenMint, isSigner: false, isWritable: false },
        { pubkey: poolTokenA, isSigner: false, isWritable: true },
        { pubkey: poolTokenB, isSigner: false, isWritable: true },
        // Add any other necessary keys
      ],
      programId: new PublicKey('Your Raydium Program ID'),
      data: instructionData,
    });
  
    // Construct the transaction
    const transaction = new Transaction().add(instruction);
  
    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [userWallet]);
  
    return signature;
  };