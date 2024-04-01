#!/bin/bash
caller=$1
canister_name=$2
base_token=$3
quote_token=$4
amount=$5
deadline=$6
dfx canister call --identity ${caller} ${canister_name} swap '(
  (principal "'$(dfx canister id ${base_token})'"), (principal "'$(dfx canister id ${quote_token})'"),
  '${amount}', '${deadline}'
)'