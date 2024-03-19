import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const LiquidityPoolList: React.FC<{ ownerPublicKey: string }> = ({ ownerPublicKey }) => {
  const [liquidityPools, setLiquidityPools] = useState<TokenAccount[]>([]);
  
  useEffect(() => {
    const fetchLiquidityPools = async () => {
      try {
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const owner = new PublicKey(ownerPublicKey);
        const tokenResp = await connection.getTokenAccountsByOwner(owner);
        
        const pools: TokenAccount[] = [];
        for (const { pubkey, account } of tokenResp.value) {
          pools.push({
            pubkey,
            accountInfo: account.data,
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