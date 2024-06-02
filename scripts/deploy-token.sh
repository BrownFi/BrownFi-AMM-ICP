#!/bin/bash

while getopts 'c:n:' flag; do
  case "${flag}" in
    c) CANISTER_NAME="${OPTARG}" ;;
    n) TOKEN_NAME="${OPTARG}" ;;
    *) error "Unexpected option ${flag}" ;;
  esac
done

export ALICE=$(dfx --identity alice identity get-principal)
export BOB=$(dfx --identity bob identity get-principal)
export OWNER=$(dfx --identity owner identity get-principal)
dfx deploy "${CANISTER_NAME}" --argument '
  (variant {
    Init = record {
      token_name = "Token '${TOKEN_NAME}'";
      token_symbol = "'${TOKEN_NAME}'";
      minting_account = record {
        owner = principal "'${OWNER}'";
      };
      initial_balances = vec {
        record {
          record {
            owner = principal "'${ALICE}'";
          };
          10_000_000_000_000;
        };
        record {
          record {
            owner = principal "'${BOB}'";
          };
          10_000_000_000_000;
        };
      };
      metadata = vec {};
      transfer_fee = 10_000;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "'${OWNER}'";
      };
      feature_flags = opt record {
        icrc2 = true;
      };
    }
  })
'