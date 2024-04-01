#!/bin/bash
caller=$1
canister_name=$2

response=$(dfx canister call --identity ${caller} ${canister_name} get_token_contract_root_bucket '(
    record { 
      witness = (false:bool);
      canister = (principal "'$(dfx canister id core)'") 
    }
  )'
)

root_bucket_pid=$(echo "$response" | awk -F'"' '/canister/ {print $2}')
echo "$root_bucket_pid"