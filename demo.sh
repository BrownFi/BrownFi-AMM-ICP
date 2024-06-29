#!/bin/bash
export ALICE=$(dfx --identity alice identity get-principal)
export BOB=$(dfx --identity bob identity get-principal)
export OWNER=$(dfx --identity owner identity get-principal)

# 1741447837000000000 nanoseconds = 1741447837 = March 8, 2025 10:30:37 PM GMT+07:00

echo Deploy Certified Asset Provenance - CAP Router
echo ================================================================
echo ""
eval ./scripts/deploy-router.sh
echo ""

echo Deploy BrownFi Core
echo ================================================================
echo ""
eval ./scripts/deploy-core.sh
echo ""

echo Deploy TokenA
echo ================================================================
echo ""
eval ./scripts/deploy-tokenA.sh
echo ""

echo Deploy TokenB
echo ================================================================
echo ""
eval ./scripts/deploy-tokenB.sh
echo ""

echo Register and Create: TokenA and TokenB
echo ================================================================
echo ""
eval ./scripts/setToken.sh owner core tokenA
eval ./scripts/setToken.sh owner core tokenB
eval ./scripts/setPair.sh owner core tokenA tokenB
echo ""

echo Approve and Deposit
echo ================================================================
echo ""
eval ./scripts/approve.sh alice tokenA core 550000
eval ./scripts/approve.sh alice tokenB core 550000
eval ./scripts/approve.sh bob tokenA core 550000
eval ./scripts/approve.sh bob tokenB core 550000
eval ./scripts/deposit.sh alice core tokenA 500000
eval ./scripts/deposit.sh alice core tokenB 500000
eval ./scripts/deposit.sh bob core tokenB 100000
echo ""

echo Add Liquidity
echo ================================================================
echo ""
eval ./scripts/addLiquidity.sh alice core tokenA tokenB 500000 500000 1741447837000000000
echo ""

echo Info Before Swapping
echo ================================================================
echo ""
eval ./scripts/getPair.sh owner core tokenA tokenB
echo ""
eval ./scripts/get-user-info.sh bob core
echo ""

echo Get Amount In
echo ================================================================
echo ""
echo "Get amount in tokenB for 50000 tokenA"
eval ./scripts/getAmountIn.sh alice core tokenA tokenB 50000
echo ""

echo Swap
echo ================================================================
echo ""
eval ./scripts/swap.sh bob core tokenA tokenB 50000 1741447837000000000
echo ""

echo Info After Swapping
echo ================================================================
echo ""
eval ./scripts/getPair.sh owner core tokenA tokenB
echo ""
eval ./scripts/get-user-info.sh bob core
echo ""

echo Get Root Bucket ID
echo ================================================================
echo ""
eval ./scripts/get-root-bucket.sh alice router
echo ""

echo Get Transaction Info
echo ================================================================
echo ""
eval ./scripts/get-transaction.sh alice router 6
echo ""
