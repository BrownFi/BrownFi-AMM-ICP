#!/bin/bash
export ALICE=$(dfx --identity alice identity get-principal)
export BOB=$(dfx --identity bob identity get-principal)
export OWNER=$(dfx --identity owner identity get-principal)

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
echo "Get amount in tokenB for 300 tokenA"
eval ./scripts/getAmountIn.sh alice core tokenA tokenB 300
echo ""

echo Swap
echo ================================================================
echo ""
eval ./scripts/swap.sh bob core tokenA tokenB 300 1741447837000000000
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
