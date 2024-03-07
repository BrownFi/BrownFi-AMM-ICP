#!/bin/bash
Caller=$1
CanisterName=$2
bToken=$3
qToken=$4

dfx canister call --identity ${Caller} ${CanisterName} getPair '(
  "'$(dfx canister id ${bToken})'", "'$(dfx canister id ${qToken})'"
)'