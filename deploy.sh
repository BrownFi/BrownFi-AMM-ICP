#!/bin/bash
export ALICE=$(dfx --identity alice identity get-principal)
export BOB=$(dfx --identity bob identity get-principal)
export DEFAULT=$(dfx --identity default identity get-principal)

# 1741447837000000000 nanoseconds = 1741447837 = March 8, 2025 10:30:37 PM GMT+07:00

echo Deploy Certified Asset Provenance - CAP Router
echo ================================================================
echo ""
dfx deploy --ic router
echo ""


echo Deploy BrownFi Core
echo ================================================================
echo ""
dfx canister --ic create core
dfx deploy --ic core --argument="(
  principal \"$(dfx identity --ic get-principal)\",
  principal \"$(dfx canister --ic id core)\",
  principal \"$(dfx canister --ic id router)\"
)"
echo ""

echo Deploy TokenA
echo ================================================================
echo ""
dfx deploy --ic tokenA --argument '
  (variant {
    Init = record {
      token_name = "Token A";
      token_symbol = "A";
      minting_account = record {
        owner = principal "'${DEFAULT}'";
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
      transfer_fee = 0;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "'${DEFAULT}'";
      };
      feature_flags = opt record {
        icrc2 = true;
      };
    }
  })
'
echo ""

echo Deploy TokenB
echo ================================================================
echo ""
dfx deploy --ic tokenB --argument '
  (variant {
    Init = record {
      token_name = "Token B";
      token_symbol = "B";
      minting_account = record {
        owner = principal "'${DEFAULT}'";
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
      transfer_fee = 0;
      archive_options = record {
        trigger_threshold = 2000;
        num_blocks_to_archive = 1000;
        controller_id = principal "'${DEFAULT}'";
      };
      feature_flags = opt record {
        icrc2 = true;
      };
    }
  })
'
echo ""

echo Register and Create: TokenA and TokenB
echo ================================================================
echo ""
dfx canister call --ic core setToken '(
  (principal "'$(dfx canister --ic id tokenA)'")
)'
dfx canister call --ic core setToken '(
  (principal "'$(dfx canister --ic id tokenB)'")
)'
dfx canister call --ic core setPair '(
  (principal "'$(dfx canister --ic id tokenA)'"), (principal "'$(dfx canister --ic id tokenB)'")
)'
echo ""

echo Approve and Deposit
echo ================================================================
echo ""
dfx canister call --ic --identity alice tokenA icrc2_approve '(
  record {
    spender = record {
      owner = (principal "'$(dfx canister --ic id core)'")
    };
    amount = '550000';
  }
)'
dfx canister call --ic --identity alice tokenB icrc2_approve '(
  record {
    spender = record {
      owner = (principal "'$(dfx canister --ic id core)'")
    };
    amount = '550000';
  }
)'
dfx canister call --ic --identity bob tokenA icrc2_approve '(
  record {
    spender = record {
      owner = (principal "'$(dfx canister --ic id core)'")
    };
    amount = '550000';
  }
)'
dfx canister call --ic --identity bob tokenB icrc2_approve '(
  record {
    spender = record {
      owner = (principal "'$(dfx canister --ic id core)'")
    };
    amount = '550000';
  }
)'
dfx canister call --ic --identity alice core deposit '(
  (principal "'$(dfx canister --ic id tokenA)'"), '500000'
)'
dfx canister call --ic --identity alice core deposit '(
  (principal "'$(dfx canister --ic id tokenB)'"), '500000'
)'
dfx canister call --ic --identity bob core deposit '(
  (principal "'$(dfx canister --ic id tokenB)'"), '100000'
)'
echo ""

echo Add Liquidity
echo ================================================================
echo ""
dfx canister call --ic --identity alice core addLiquidity '(
  (principal "'$(dfx canister --ic id tokenA)'"), (principal "'$(dfx canister --ic id tokenB)'"),
  '500000', '500000', '1741447837000000000'
)'
echo ""