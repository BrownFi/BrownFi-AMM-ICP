#!/bin/bash
caller=$1
router_canister_name=$2
txid=$3

response=$(dfx canister call --identity ${caller} ${router_canister_name} get_token_contract_root_bucket '(
    record { 
      witness = (false:bool);
      canister = (principal "'$(dfx canister id core)'") 
    }
  )'
)

root_bucket_pid=$(echo "$response" | awk -F'"' '/canister/ {print $2}')

dfx canister call --identity ${caller} ${root_bucket_pid} get_transaction '(
  record { 
    id = ('${txid}');
    witness = (false : bool);
  }
)'