#!/bin/bash
CanisterName=$1
Account=$2
dfx canister call --identity ${Account} ${CanisterName} getUserInfo '(
  (principal "'$(dfx --identity ${Account} identity get-principal)'")
)'