#!/bin/bash
caller=$1
canister_name=$2
spender=$3
amount=$4

dfx canister call --identity ${caller} ${canister_name} icrc2_approve '(
  record {
    spender = record {
      owner = (principal "'$(dfx canister id ${spender})'")
    };
    amount = '${amount}';
  }
)'