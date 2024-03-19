import React, { useEffect, useState } from 'react';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from '@solana/web3.js';
import {TokenAccount, SPL_ACCOUNT_LAYOUT} from '@raydium-io/raydium-sdk'

const rpcURL = 'https://api.mainnet-beta.solana.com'

const LiquidityPoolList: React.FC<{ ownerPublicKey: string }> = ({ ownerPublicKey }) => {
  const [liquidityPools, setLiquidityPools] = useState<TokenAccount[]>([]);
  
  useEffect(() => {
    const fetchLiquidityPools = async () => {
      try {
        const connection = new Connection(rpcURL, "confirmed");
        const owner = new PublicKey(ownerPublicKey);
        const tokenResp = await connection.getTokenAccountsByOwner(owner, {
          programId: TOKEN_PROGRAM_ID,
        });
        
        const pools: TokenAccount[] = [];
        for (const { pubkey, account } of tokenResp.value) {
          pools.push({
            pubkey,
            accountInfo: SPL_ACCOUNT_LAYOUT.decode(account.data),
            programId: TOKEN_PROGRAM_ID,
          });
        }
        
        setLiquidityPools(pools);
      } catch (error) {
        console.error('Error fetching liquidity pools:', error);
      }
    };

    fetchLiquidityPools();
  }, [ownerPublicKey]);

  return (
    <div>
      <h2>Owner's Liquidity Pool List</h2>
      <ul>
        {liquidityPools.map((pool, index) => (
          <li key={index}>{pool.pubkey.toBase58()}</li>
        ))}
      </ul>
    </div>
  );
};

export default LiquidityPoolList;