#!/bin/bash
canister_name=$1
sender=$2
receiver=$3
amount=$4

dfx canister call --identity ${sender} ${canister_name} icrc1_transfer '(
  record {
    to = record {
      owner = (principal "'$(dfx identity --identity ${receiver} get-principal)'")
    };
    amount = '${amount}';
  }
)'