#!/bin/bash
Caller=$1
CanisterName=$2
Token=$3
dfx canister call --identity ${Caller} ${CanisterName} setToken '(
  (principal "'$(dfx canister id ${Token})'")
)'