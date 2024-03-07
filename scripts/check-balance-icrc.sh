#!/bin/bash
CanisterName=$1
Account=$2

dfx canister call --identity ${Account} ${CanisterName} icrc1_balance_of '(
  record {
    owner = (principal "'$(dfx --identity ${Account} identity get-principal)'")
  }
)'