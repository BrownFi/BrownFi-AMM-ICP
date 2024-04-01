#!/bin/bash
canister_name=$1
account=$2

dfx canister call --identity ${account} ${canister_name} icrc1_balance_of '(
  record {
    owner = (principal "'$(dfx --identity ${account} identity get-principal)'")
  }
)'