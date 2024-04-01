#!/bin/bash
caller=$1
canister_name=$2
token=$3
amount=$4

dfx canister call --identity ${caller} ${canister_name} withdraw '(
  (principal "'$(dfx canister id ${token})'"), '${amount}'
)'