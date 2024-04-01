#!/bin/bash
caller=$1
canister_name=$2
dfx canister call --identity ${caller} ${canister_name} getUserInfo '(
  (principal "'$(dfx --identity ${caller} identity get-principal)'")
)'