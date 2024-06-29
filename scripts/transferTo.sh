#!/bin/bash
sender=$1
canister_name=$2
receiver=$3
amount=$4

dfx canister call --identity ${sender} ${canister_name} icrc1_transfer '(
  record {
    to = record {
      owner = (principal "'${receiver}'")
    };
    amount = '${amount}';
  }
)'