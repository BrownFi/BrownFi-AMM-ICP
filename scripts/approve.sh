#!/bin/bash
Caller=$1
CanisterName=$2
Spender=$3
Amount=$4

dfx canister call --identity ${Caller} ${CanisterName} icrc2_approve '(
  record {
    spender = record {
      owner = (principal "'$(dfx canister id ${Spender})'")
    };
    amount = '${Amount}';
  }
)'