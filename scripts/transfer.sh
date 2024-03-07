#!/bin/bash
CanisterName=$1
Sender=$2
Receiver=$3
Amount=$4

dfx canister call --identity ${Sender} ${CanisterName} icrc1_transfer '(
  record {
    to = record {
      owner = (principal "'$(dfx identity --identity ${Receiver} get-principal)'")
    };
    amount = '${Amount}';
  }
)'