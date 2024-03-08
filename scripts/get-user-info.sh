#!/bin/bash
Caller=$1
CanisterName=$2
dfx canister call --identity ${Caller} ${CanisterName} getUserInfo '(
  (principal "'$(dfx --identity ${Caller} identity get-principal)'")
)'