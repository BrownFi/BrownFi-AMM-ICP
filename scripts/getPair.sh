#!/bin/bash
caller=$1
canister_name=$2
base_token=$3
quote_token=$4

dfx canister call --identity ${caller} ${canister_name} getPair '(
  "'$(dfx canister id ${base_token})'", "'$(dfx canister id ${quote_token})'"
)'