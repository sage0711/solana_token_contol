import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { OpenOrders } from '@project-serum/serum';
import { TokenAccount, SPL_ACCOUNT_LAYOUT, LIQUIDITY_STATE_LAYOUT_V4 } from '@raydium-io/raydium-sdk';
import BN from 'bn.js';

const LiquidityPoolInfo: React.FC = () => {
  const [poolInfo, setPoolInfo] = useState<any | null>(null);

  useEffect(() => {
    const parsePoolInfo = async () => {
      try {
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const owner = new PublicKey('VnxDzsZ7chE88e9rB6UKztCt2HUwrkgCTx8WieWf5mM');
        
        const tokenResp = await connection.getTokenAccountsByOwner(owner, {
          programId: TOKEN_PROGRAM_ID,
        });

        const accounts: TokenAccount[] = [];
        for (const { pubkey, account } of tokenResp.value) {
          accounts.push({
            pubkey,
            accountInfo: SPL_ACCOUNT_LAYOUT.decode(account.data),
          });
        }

        const info = await connection.getAccountInfo(new PublicKey(SOL_USDC_POOL_ID));
        if (!info) return;

        const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);
        const openOrders = await OpenOrders.load(
          connection,
          poolState.openOrders,
          OPENBOOK_PROGRAM_ID
        );

        const baseDecimal = 10 ** poolState.baseDecimal.toNumber();
        const quoteDecimal = 10 ** poolState.quoteDecimal.toNumber();

        const baseTokenAmount = await connection.getTokenAccountBalance(poolState.baseVault);
        const quoteTokenAmount = await connection.getTokenAccountBalance(poolState.quoteVault);

        const basePnl = poolState.baseNeedTakePnl.toNumber() / baseDecimal;
        const quotePnl = poolState.quoteNeedTakePnl.toNumber() / quoteDecimal;

        const openOrdersBaseTokenTotal = openOrders.baseTokenTotal.toNumber() / baseDecimal;
        const openOrdersQuoteTokenTotal = openOrders.quoteTokenTotal.toNumber() / quoteDecimal;

        const base =
          (baseTokenAmount.value?.uiAmount || 0) + openOrdersBaseTokenTotal - basePnl;
        const quote =
          (quoteTokenAmount.value?.uiAmount || 0) +
          openOrdersQuoteTokenTotal -
          quotePnl;

        const denominator = new BN(10).pow(poolState.baseDecimal);

        const addedLpAccount = accounts.find((a) =>
          a.accountInfo.mint.equals(poolState.lpMint)
        );

        setPoolInfo({
          base,
          quote,
          baseVaultBalance: baseTokenAmount.value.uiAmount,
          quoteVaultBalance: quoteTokenAmount.value.uiAmount,
          baseTokensInOpenOrders: openOrdersBaseTokenTotal,
          quoteTokensInOpenOrders: openOrdersQuoteTokenTotal,
          baseTokenDecimals: poolState.baseDecimal.toNumber(),
          quoteTokenDecimals: poolState.quoteDecimal.toNumber(),
          totalLp: poolState.lpReserve.div(denominator).toString(),
          addedLpAmount: (addedLpAccount?.accountInfo.amount.toNumber() || 0) / baseDecimal,
        });
      } catch (error) {
        console.error('Error parsing pool info:', error);
      }
    };

    parsePoolInfo();
  }, []);

  return (
    <div>
      {poolInfo && (
        <div>
          <h2>SOL_USDC Pool Info</h2>
          <p>Pool total base: {poolInfo.base}</p>
          <p>Pool total quote: {poolInfo.quote}</p>
          <p>Base vault balance: {poolInfo.baseVaultBalance}</p>
          <p>Quote vault balance: {poolInfo.quoteVaultBalance}</p>
          <p>Base tokens in open orders: {poolInfo.baseTokensInOpenOrders}</p>
          <p>Quote tokens in open orders: {poolInfo.quoteTokensInOpenOrders}</p>
          <p>Base token decimals: {poolInfo.baseTokenDecimals}</p>
          <p>Quote token decimals: {poolInfo.quoteTokenDecimals}</p>
          <p>Total LP: {poolInfo.totalLp}</p>
          <p>Added LP amount: {poolInfo.addedLpAmount}</p>
        </div>
      )}
    </div>
  );
};

export default LiquidityPoolInfo;