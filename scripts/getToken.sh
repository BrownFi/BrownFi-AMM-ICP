#!/bin/bash
caller=$1
canister_name=$2
token=$3

dfx canister call --identity ${caller} ${canister_name} gettokenMetadata '(
  "'$(dfx canister id ${token})'"
)'