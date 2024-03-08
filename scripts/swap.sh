#!/bin/bash
Caller=$1
CanisterName=$2
bToken=$3
qToken=$4
Amount=$5
Deadline=$6
dfx canister call --identity ${Caller} ${CanisterName} swap '(
  (principal "'$(dfx canister id ${bToken})'"), (principal "'$(dfx canister id ${qToken})'"),
  '${Amount}', '${Deadline}'
)'