#!/bin/bash
Caller=$1
CanisterName=$2
bToken=$3
qToken=$4

dfx canister call --identity ${Caller} ${CanisterName} setPair '(
  (principal "'$(dfx canister id ${bToken})'"), (principal "'$(dfx canister id ${qToken})'")
)'