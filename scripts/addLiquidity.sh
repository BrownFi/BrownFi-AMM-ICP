#!/bin/bash
caller=$1
canister_name=$2
base_token=$3
quote_token=$4
base_amount=$5
quote_amount=$6
deadline=$7
dfx canister call --identity ${caller} ${canister_name} addLiquidity '(
  (principal "'$(dfx canister id ${base_token})'"), (principal "'$(dfx canister id ${quote_token})'"),
  '${base_amount}', '${quote_amount}', '${deadline}'
)'