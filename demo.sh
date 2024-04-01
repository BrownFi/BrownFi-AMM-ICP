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
eval ./scripts/setToken.sh owner core token0
eval ./scripts/setToken.sh owner core token1
eval ./scripts/setPair.sh owner core token0 token1
echo ""

echo Approve and Deposit
echo ================================================================
echo ""
eval ./scripts/approve.sh alice token0 core 550000
eval ./scripts/approve.sh alice token1 core 550000
eval ./scripts/approve.sh bob token0 core 550000
eval ./scripts/approve.sh bob token1 core 550000
eval ./scripts/deposit.sh alice core token0 500000
eval ./scripts/deposit.sh alice core token1 500000
eval ./scripts/deposit.sh bob core token1 100000
echo ""

echo Add Liquidity
echo ================================================================
echo ""
eval ./scripts/addLiquidity.sh alice core token0 token1 500000 500000 1741447837000000000
echo ""

echo Info Before Swapping
echo ================================================================
echo ""
eval ./scripts/getPair.sh owner core token0 token1
echo ""
eval ./scripts/get-user-info.sh bob core
echo ""

echo Swap
echo ================================================================
echo ""
eval ./scripts/swap.sh bob core token0 token1 50000 1741447837000000000
echo ""

echo Info After Swapping
echo ================================================================
echo ""
eval ./scripts/getPair.sh owner core token0 token1
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
