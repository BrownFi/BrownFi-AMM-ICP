#!/bin/bash
Caller=$1
CanisterName=$2
bToken=$3
qToken=$4
bAmount=$5
qAmount=$6
Deadline=$7
dfx canister call --identity ${Caller} ${CanisterName} addLiquidity '(
  (principal "'$(dfx canister id ${bToken})'"), (principal "'$(dfx canister id ${qToken})'"),
  '${bAmount}', '${qAmount}', '${Deadline}'
)'