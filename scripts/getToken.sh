#!/bin/bash
Caller=$1
CanisterName=$2
Token=$3

dfx canister call --identity ${Caller} ${CanisterName} getTokenMetadata '(
  "'$(dfx canister id ${Token})'"
)'