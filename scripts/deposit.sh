#!/bin/bash
Caller=$1
CanisterName=$2
Token=$3
Amount=$4

dfx canister call --identity ${Caller} ${CanisterName} deposit '(
  (principal "'$(dfx canister id ${Token})'"), '${Amount}'
)'