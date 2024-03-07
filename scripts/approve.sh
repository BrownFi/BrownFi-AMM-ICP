#!/bin/bash
CanisterName=$1
Sender=$2
Spender=$3
Amount=$4

dfx canister call --identity ${Sender} ${CanisterName} icrc2_approve '(
  record {
    spender = record {
      owner = (principal "'$(dfx canister id ${Spender})'")
    };
    amount = '${Amount}';
  }
)'