import Array        "mo:base/Array";
import Blob         "mo:base/Blob";
import Error        "mo:base/Error";
import Float        "mo:base/Float";
import HashMap      "mo:base/HashMap";
import Iter         "mo:base/Iter";
import Nat          "mo:base/Nat";
import Nat8         "mo:base/Nat8";
import Option       "mo:base/Option";
import Principal    "mo:base/Principal";
import Result       "mo:base/Result";
import Text         "mo:base/Text";
import Time         "mo:base/Time";
import Buffer       "mo:base/Buffer";

import Tokens       "./libraries/Tokens";
import Root         "./libraries/Root";
import Utils        "./libraries/Utils";
import Cap          "./libraries/Cap";

shared(msg) actor class BrownFi(owner_ : Principal, bfId: Principal, capId_: Principal) = this {

    type Errors = {
        #InsufficientBalance;
        #InsufficientAllowance;
        #LedgerTrap;
        #AmountTooSmall;
        #BlockUsed;
        #ErrorOperationStyle;
        #ErrorTo;
        #Other:Text;
    };
    type ICRCTransferError = {
        #BadFee : { expected_fee : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #InsufficientFunds : { balance : Nat };
        #InsufficientAllowance : { allowance : Nat };
        #TooOld;
        #CreatedInFuture : { ledger_time : Nat64 };
        #Duplicate : { duplicate_of : Nat };
        #TemporarilyUnavailable;
        #GenericError : { message : Text; error_code : Nat };
        #Expired; //only for approve
        #CustomError:Text; // custom error for sonic logic
    };
    type ICRCTokenTxReceipt = {
        #Ok : Nat;
        #Err : ICRCTransferError;
    }; 
    type ICRCAccount =  {
        owner : Principal;
        subaccount : ?Subaccount;
    };
    type ICRCMetaDataValue = { #Nat8 : Nat8; #Nat : Nat; #Int : Int; #Blob : Blob; #Text : Text };
    type ICRCTransferArg = {
        from_subaccount :?Subaccount;
        to : ICRCAccount;
        amount : Nat;
    };     
    type ICRC2TransferArg = {
        from : ICRCAccount;
        to : ICRCAccount;
        amount : Nat;
    };   
    type Metadata = {
        logo : Text;
        name : Text;
        symbol : Text;
        decimals : Nat8;
        totalSupply : Nat;
        owner : Principal;
        fee : Nat;
    };
    type WithdrawState = {
        tokenId : Text;
        caller : Principal;     //  Principal ID of an account that sent a withdrawal request, but it failed
        amount : Nat;
        refundStatus : Bool
    };
    type UserInfo = {
        balances: [(Text, Nat)];
        lpBalances: [(Text, Nat)];
    };
    type SwapUpdate = {
        p1 : Nat;         //  update new `price` value after swapping
        x1 : Nat;         //  new value of `bReserve` after swapping
        y1 : Nat;         //  new value of `qReserve` after swapping
        dy : Nat;         //  amount of `qToken` needs to pay (before fee)
        fee : Nat         //  tx fee amount
    };
    type CapSettings={
        CapRootBucketId:?Text;
        CapId:Text;
    };
    type Subaccount = Blob; 

    type ICRC2TokenActor = actor {
        icrc2_approve: shared (from_subaccount :?Subaccount, spender: Principal, amount : Nat) -> async ICRCTokenTxReceipt;
        icrc2_allowance: shared (account  :Subaccount, spender: Principal) -> async (allowance: Nat, expires_at: ?Nat64);
        icrc1_balance_of: (account: ICRCAccount) -> async Nat;
        icrc1_decimals: () -> async Nat8;
        icrc1_name: () -> async Text;
        icrc1_symbol: () -> async Text;
        icrc1_metadata: () -> async [(Text, ICRCMetaDataValue)];
        icrc1_total_supply: () -> async Nat;
        icrc2_transfer_from : shared (ICRC2TransferArg) -> async ICRCTokenTxReceipt;
        icrc1_transfer: shared (ICRCTransferArg) -> async ICRCTokenTxReceipt;
    };
    type PairInfo = {
        id : Text;
        bToken : Text;           //  Principal
        qToken : Text;           //  Principal     
        creator : Principal;
        var bReserve : Nat;
        var qReserve : Nat;
        var pLast : Nat;        //  last swap price  
        var k : Nat;            //  liquidity concentration
        var l : Nat;            //  price reversal
        var feeRate : Nat;
        var totalSupply : Nat;
        lpToken : Text;
    };
    type TransferReceipt = { 
        #Ok: Nat;
        #Err: Errors;
        #ICRCTransferError: ICRCTransferError;
    };
    type TokenInfo = Tokens.TokenInfo;

    public type TokenInfoExt = Tokens.TokenInfoExt;
    public type TokenAnalyticsInfo = Tokens.TokenAnalyticsInfo;
    public type TxReceipt = Result.Result<Nat, Text>;
    public type QuoteTxReceipt = Result.Result<Nat, Text>;
    public type PairInfoExt = {
        id : Text;
        bToken : Text;           //  Principal
        qToken : Text;           //  Principal
        creator : Principal;
        bReserve : Nat;
        qReserve : Nat;
        pLast : Nat;
        k : Nat;
        l : Nat;
        feeRate : Nat;
        totalSupply : Nat;
        lpToken : Text;
    };

    private stable var owner = owner_;
    private stable var feeTo = owner_;
    private stable var txCounter : Nat = 0;
    private stable var _depositCounter : Nat = 0;
    private stable var ticketNo : Nat = 0;      //  being used to track failed withdraws
    private stable var tokenFee: Nat = 10000; // 0.0001 if decimal == 8
    private stable let blackhole : Principal = Principal.fromText("aaaaa-aa");
    private stable let scale : Nat = 100_000_000;
    private stable var capId: Text = Principal.toText(capId_);

    private var tokens : Tokens.Tokens = Tokens.Tokens(feeTo, []);
    private var lpTokens : Tokens.Tokens = Tokens.Tokens(feeTo, []);
    private var pairs = HashMap.HashMap<Text, PairInfo>(1, Text.equal, Text.hash);
    private var failedWithdraws = HashMap.HashMap<Text, WithdrawState>(1, Text.equal, Text.hash);  

    //  migrate data when upgrade Canister
    private var mTokens : [(Text, TokenInfoExt, [(Principal, Nat)], [(Principal, [(Principal, Nat)])])] = [];
    private var mLPTokens : [(Text, TokenInfoExt, [(Principal, Nat)], [(Principal, [(Principal, Nat)])])] = [];
    private var mPairs : [(Text, PairInfo)] = [];
    private var mFailedWithdraws : [(Text, WithdrawState)] = [];

    private var cap: Cap.Cap = Cap.Cap(bfId, capId, 1_000_000_000_000);

    /*
      - Call to set new `owner` of the Canister
      - Requirement: 
        - `msg.caller` must be `owner`
        - `newOwner` must not be `blackhole`
      - Params:
        - `newOwner`: the Principal ID of a new `owner`
    */
    public shared(msg) func setOwner(newOwner : Principal) : async Bool {
        assert(msg.caller == owner and newOwner != blackhole);
        owner := newOwner;
        return true;
    };

    /*
      - Call to set new `feeTo` of the Canister
      - Requirement: 
        - `msg.caller` must be `owner`
        - `newFeeTo` must not be `blackhole`
      - Params:
        - `newFeeTo`: the Principal ID of a new `feeTo`
    */
    public shared(msg) func setFeeTo(newFeeTo : Principal) : async Bool {
        assert(msg.caller == owner and newFeeTo != blackhole);
        feeTo := newFeeTo;
        return true;
    };

    /*
      - Call to set authorized token
      - Requirement: `msg.caller` must be `owner`
      - Params:
        - `tokenId`: the Principal ID of the Canister
    */
    public shared(msg) func setToken(tokenId : Principal) : async Bool {
        assert(msg.caller == owner);
        //  Check whether `tokenId` has been already set before
        let tid : Text = Principal.toText(tokenId);
        // assert(not tokens.hasToken(tid));

        let tokenActor : ICRC2TokenActor = actor(tid);
        let metadata = await _getMetadata(tokenActor, tokenId);

        let tokenInfo : TokenInfo = {
            id = tid;
            var name = metadata.name;
            var symbol = metadata.symbol;
            var decimals = metadata.decimals;
            var fee = metadata.fee;
            var totalSupply = 0;
            balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
            allowances = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(1, Principal.equal, Principal.hash);
        };
        assert(tokens.createToken(tid, tokenInfo));
        ignore _addRecord(msg.caller, "setToken", [("tokenId", #Text(tid))]);

        txCounter += 1;
        return true;
    };

    /*
      - Call to updat new Principal ID of Certified Asset Provenance (CAP) Canister
      - Requirement: `msg.caller` must be `owner`
      - Params:
        - `newCapId`: the Pricipal ID of CAP Canister
    */
    public shared(msg) func setCapId (newCapId : Principal) : async Bool {
        assert(msg.caller == owner);
        capId := Principal.toText(newCapId);
        
        return cap.setRouterId(capId);
    };

    /*
      - Call to create a pool for a token pair (`token0`/`token1`)
      - Requirement: 
        - `msg.caller` can be ANY
        - `bToken` and `qToken` must be registered by `owner`
      - Params:
        - `bToken`: the Principal ID of the base token Canister
        - `qToken`: the Principal ID of the quote token Canister
    */
    public shared(msg) func setPair(bToken : Principal, qToken : Principal) : async TxReceipt {
        let btid : Text = Principal.toText(bToken);
        let qtid : Text = Principal.toText(qToken);
        assert(
            btid != qtid and bToken != blackhole and qToken != blackhole and
            tokens.hasToken(btid) and tokens.hasToken(qtid)
        );

        // the sorting is necessary when supporting two-way swapping
        // let (t0, t1) = Utils.sortTokens(btid, qtid);
        let pair = btid # ":" # qtid;
        assert(
            not Option.isSome(pairs.get(pair)) and 
            not lpTokens.hasToken(pair)
        );
        let bName = tokens.getSymbol(btid);
        let qName = tokens.getSymbol(qtid);
        let lpName = bName # "-" # qName;
        let lp : TokenInfo = {
            id = pair;
            var name = lpName # "-LP";
            var symbol = lpName # "-LP";
            var decimals = 8;
            var fee = tokenFee;       // 0.0001 fee for transfer/approve
            var totalSupply = 0;
            balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
            allowances = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(1, Principal.equal, Principal.hash);
        };
        let pairInfo : PairInfo = {
            id = pair;
            bToken = btid;
            qToken = qtid;
            creator = msg.caller;
            var bReserve = 0;
            var qReserve = 0;
            var pLast = 0;
            var k = 5_000_000;            //  liquidity concentration = 0.05 = 5_000_000 / 100_000_000
            var l = 100_000_000;          //  price reversal = 1.0 = 100_000_000 / 100_000_000
            var feeRate = 100_000;        //  feeRate = 0.001 = 100_000 / 100_000_000 
            var totalSupply = 0;
            lpToken = pair;
        };
        pairs.put(pair, pairInfo);
        ignore lpTokens.createToken(pair, lp);
        ignore _addRecord(
            msg.caller, "setPair", 
            [
                ("pairId", #Text(pair)),
                ("bToken", #Text(btid)),
                ("qToken", #Text(qtid))
            ]
        );
        txCounter += 1;
        return #ok(txCounter - 1);
    };

    /*
      - Call to update new value of current pair's configurations
      - Requirement: 
        - `msg.caller` must be `owner`
        - `bToken` and `qToken` must be registered by `owner`
        - A pair, created by `bToken` and `qToken`, must exist
      - Params:
        - `bToken`: the Principal ID of the base token Canister
        - `qToken`: the Principal ID of the quote token Canister
        - `k_`: a new value of liquidity concentration
        - `l_`: a new value of price reversal
        - `feeRate_`: a new value of fee rate
    */
    public shared(msg) func setPairConfig(
        bToken : Text,
        qToken : Text,
        k_ : Nat,          
        l_ : Nat,
        feeRate_ : Nat
    ) : async Bool {
        assert(msg.caller == owner);

        let pair = bToken # ":" # qToken;
        assert(Option.isSome(pairs.get(pair)));
        switch (pairs.get(pair)) {
            case (?info) {
                ignore _addRecord(
                    msg.caller, "setPairConfig-pre", 
                    [
                        ("pairId", #Text(info.id)),
                        ("bToken", #Text(info.bToken)),
                        ("qToken", #Text(info.qToken)),
                        ("creator", #Principal(info.creator)),
                        ("bReserve", #Text(_u64ToText(info.bReserve))),
                        ("qReserve", #Text(_u64ToText(info.qReserve))),
                        ("pLast", #Text(_u64ToText(info.pLast))),
                        ("k", #Text(_u64ToText(info.k))),
                        ("l", #Text(_u64ToText(info.l))),
                        ("feeRate", #Text(_u64ToText(info.feeRate))),
                        ("totalSupply", #Text(_u64ToText(info.totalSupply))),
                        ("lpToken", #Text(info.lpToken))
                    ]
                );
                let newInfo : PairInfo = {
                    id = info.id;
                    bToken = info.bToken;
                    qToken = info.qToken;
                    creator = info.creator;
                    var bReserve = info.bReserve;
                    var qReserve = info.qReserve;
                    var pLast = info.pLast;
                    var k = k_;
                    var l = l_;
                    var feeRate = l_;
                    var totalSupply = info.totalSupply;
                    lpToken = info.lpToken;
                };
                pairs.put(pair, newInfo);
                ignore _addRecord(
                    msg.caller, "setPairConfig-post", 
                    [
                        ("pairId", #Text(newInfo.id)),
                        ("bToken", #Text(newInfo.bToken)),
                        ("qToken", #Text(newInfo.qToken)),
                        ("creator", #Principal(newInfo.creator)),
                        ("bReserve", #Text(_u64ToText(newInfo.bReserve))),
                        ("qReserve", #Text(_u64ToText(newInfo.qReserve))),
                        ("pLast", #Text(_u64ToText(newInfo.pLast))),
                        ("k", #Text(_u64ToText(newInfo.k))),
                        ("l", #Text(_u64ToText(newInfo.l))),
                        ("feeRate", #Text(_u64ToText(newInfo.feeRate))),
                        ("totalSupply", #Text(_u64ToText(newInfo.totalSupply))),
                        ("lpToken", #Text(newInfo.lpToken))
                    ]
                );
            };
            case (_) {};    //  already check by assert()
        };
        txCounter += 1;
        return true;
    };

    /*
      - Deposit `amount` of `tokenId` into the canister
      - Requirement: 
        - `msg.caller` can be ANY
        - `tokenId` must be registered by `owner`
        - `amount` must be greater or equal the `tokenFee`
      - Params:
        - `tokenId`: the Principal ID of a token canister
        - `amount`: deposit amount
    */
    public shared(msg) func deposit(tokenId : Principal, amount : Nat) : async TxReceipt {
        let tid : Text = Principal.toText(tokenId);
        let fee : Nat = tokens.getFee(tid);
        if (tokens.hasToken(tid) == false) return #err("Token not supported: " # tid);
        if (amount < fee) return #err("Amount should be greater than fee: " # Nat.toText(fee)); 
        assert(tokens.hasToken(tid) and amount >= fee);
        
        ignore _addRecord(
            msg.caller, "deposit-init", 
            [
                ("tokenId", #Text(tid)),
                ("from", #Principal(msg.caller)),
                ("to", #Principal(msg.caller)),
                ("amount", #Text(_u64ToText(amount))),
                ("fee", #Text(_u64ToText(fee))),
                ("balance", #Text(_u64ToText(tokens.balanceOf(tid, msg.caller)))),
                ("totalSupply", #Text(_u64ToText(tokens.totalSupply(tid))))
            ]
        );

        let tokenActor : ICRC2TokenActor = actor(tid);
        let txid = switch (await _transferFrom(tid, tokenActor, msg.caller, amount, fee)) {
            case (#Ok(id)) { id; };
            case (#Err(e)) { return #err("token transfer failed:" # debug_show(e)); };
            case (#ICRCTransferError(e)) { return #err("token transfer failed:" # debug_show(e)); };
        };

        ignore tokens.mint(tid, msg.caller, amount);
        ignore _addRecord(
            msg.caller, "deposit", 
            [
                ("tokenId", #Text(tid)),
                ("txid", #Text(_u64ToText(txid))),
                ("from", #Principal(msg.caller)),
                ("to", #Principal(msg.caller)),
                ("amount", #Text(_u64ToText(amount))),
                ("fee", #Text(_u64ToText(0))),
                ("balance", #Text(_u64ToText(tokens.balanceOf(tid, msg.caller)))),
                ("totalSupply", #Text(_u64ToText(tokens.totalSupply(tid))))
            ]
        );
        txCounter += 1;
        return #ok(txCounter - 1);
    };

    /*
      - Deposit `amount` of `tokenId` into the canister
      - Note: This function is different than the one above
        It supports `msg.sender` and a receiver `to` are two different account
      - Requirement: 
        - `msg.caller` can be ANY
        - `tokenId` must be registered by `owner`
        - `amount` must be greater or equal the `tokenFee`
      - Params:
        - `tokenId`: the Principal ID of a token canister
        - `to`: the Principal ID of a receiver
        - `amount`: deposit amount
    */
    public shared(msg) func depositTo(tokenId : Principal, to : Principal, amount : Nat) : async TxReceipt {
        let tid : Text = Principal.toText(tokenId);
        let fee : Nat = tokens.getFee(tid);
        assert(tokens.hasToken(tid) and amount >= fee);

        ignore _addRecord(
            msg.caller, "depositTo-init", 
            [
                ("tokenId", #Text(tid)),
                ("from", #Principal(msg.caller)),
                ("to", #Principal(to)),
                ("amount", #Text(_u64ToText(amount))),
                ("fee", #Text(_u64ToText(fee))),
                ("balance", #Text(_u64ToText(tokens.balanceOf(tid, to)))),
                ("totalSupply", #Text(_u64ToText(tokens.totalSupply(tid))))
            ]
        );

        let tokenActor : ICRC2TokenActor = actor(tid);
        let txid = switch(await _transferFrom(tid, tokenActor, msg.caller, amount, fee)) {
            case (#Ok(id)) { id };
            case (#Err(e)) { return #err("token transfer failed:" # tid); };
            case (#ICRCTransferError(e)) { return #err("token transfer failed:" # tid); };
        };

        ignore tokens.mint(tid, to, amount);
        ignore _addRecord(
            msg.caller, "deposit", 
            [
                ("tokenId", #Text(tid)),
                ("txid", #Text(_u64ToText(txid))),
                ("from", #Principal(msg.caller)),
                ("to", #Principal(to)),
                ("amount", #Text(_u64ToText(amount))),
                ("fee", #Text(_u64ToText(0))),
                ("balance", #Text(_u64ToText(tokens.balanceOf(tid, to)))),
                ("totalSupply", #Text(_u64ToText(tokens.totalSupply(tid))))
            ]
        );
        txCounter += 1;
        return #ok(txCounter - 1);
    };

    public shared(msg) func addLiquidity(
        bToken : Principal,
        qToken : Principal,
        bAmount : Nat,
        qAmount : Nat,
        deadline : Int
    ) : async TxReceipt {
        if (Time.now() > deadline) return #err("Tx expired");
        if (bAmount == 0 or qAmount == 0) return #err("Amount should not be zero");

        let btid : Text = Principal.toText(bToken);
        let qtid : Text = Principal.toText(qToken);
        if (tokens.hasToken(btid) == false) return #err("Token not supported: " # btid);
        if (tokens.hasToken(qtid) == false) return #err("Token not supported: " # qtid);
        if (tokens.balanceOf(btid, msg.caller) < bAmount) return #err("insufficient balance: " # btid);
        if (tokens.balanceOf(qtid, msg.caller) < qAmount) return #err("insufficient balance: " # qtid);
        var pair : PairInfo = switch (pairs.get(btid # ":" # qtid)) {
            case (?p) { p; };
            case (_) return #err("Pair not existed");
        };
        if (tokens.zeroFeeTransfer(btid, msg.caller, Principal.fromActor(this), bAmount) == false)
            return #err("Transfer failed: " # btid);
        if (tokens.zeroFeeTransfer(qtid, msg.caller, Principal.fromActor(this), qAmount) == false)
            return #err("Transfer failed: " # qtid);
        
        pair.bReserve += bAmount;
        pair.qReserve += qAmount;
        let bDecimals : Nat8 = tokens.getMetadata(btid).decimals;
        let qDecimals : Nat8 = tokens.getMetadata(qtid).decimals;
        pair.pLast := (pair.qReserve * 10**Nat8.toNat(bDecimals) * scale) / (pair.bReserve * 10**Nat8.toNat(qDecimals));
        pairs.put(pair.id, pair);

        txCounter += 1;
        return #ok(txCounter - 1);
    };

    public shared(msg) func swap(
        bToken : Principal,
        qToken : Principal,
        amount : Nat,
        deadline : Int
    ) : async TxReceipt {
        if (Time.now() > deadline) return #err("Tx expired");
        if (amount == 0) return #err("Amount should not be zero");

        let btid : Text = Principal.toText(bToken);
        let qtid : Text = Principal.toText(qToken);
        if (tokens.hasToken(btid) == false) return #err("Token not supported: " # btid);
        if (tokens.hasToken(qtid) == false) return #err("Token not supported: " # qtid);
        var pair : PairInfo = switch (pairs.get(btid # ":" # qtid)) {
            case (?p) { p; };
            case (_) return #err("Pair not existed");
        };
        if (amount >= pair.bReserve) return #err("Exceed pool reserve: " # btid);

        let updateInfo : SwapUpdate = _getSwapUpdate(pair, amount);
        let pAmount : Nat = updateInfo.dy + updateInfo.fee;
        if (tokens.balanceOf(qtid, msg.caller) < (pAmount)) return #err("Insufficient balance: "#Nat.toText(tokens.balanceOf(qtid, msg.caller))#"<"#Nat.toText(pAmount));
        // send quote token from caller to this canister
        if (tokens.zeroFeeTransfer(qtid, msg.caller, Principal.fromActor(this), pAmount) == false)
            return #err("Transfer failed: " # qtid);
        // send base token from this canister to caller
        if (tokens.zeroFeeTransfer(btid, Principal.fromActor(this), msg.caller, amount) == false)
            return #err("Transfer failed: " # btid);
        
        pair.pLast := updateInfo.p1;
        pair.qReserve := updateInfo.y1;
        pair.bReserve := updateInfo.x1;
        pairs.put(pair.id, pair);

        txCounter += 1;
        return #ok(txCounter - 1);
    };

    public shared(msg) func quote(
        bToken : Principal,
        qToken : Principal,
        amount : Nat,
    ) : async QuoteTxReceipt {
        if (amount == 0) return #err("Amount should not be zero");

        let btid : Text = Principal.toText(bToken);
        let qtid : Text = Principal.toText(qToken);
        if (tokens.hasToken(btid) == false) return #err("Token not supported: " # btid);
        if (tokens.hasToken(qtid) == false) return #err("Token not supported: " # qtid);
        var pair : PairInfo = switch (pairs.get(btid # ":" # qtid)) {
            case (?p) { p; };
            case (_) return #err("Pair not existed");
        };
        if (amount >= pair.bReserve) return #err("Exceed pool reserve: " # btid);

        let updateInfo : SwapUpdate = _getSwapUpdate(pair, amount);
        let pAmount : Nat = updateInfo.dy + updateInfo.fee;
        return #ok(pAmount);
    };

    /*
      - Withdraw `amount` of `tokenId` to `msg.caller`
      - Requirement: 
        - `msg.caller` can be ANY
        - `tokenId` must be registered by `owner`
        - `amount` must be less than or equal a current recorded balance
      - Params:
        - `tokenId`: the Principal ID of a token canister
        - `amount`: withdrawing amount
    */
    public shared(msg) func withdraw(tokenId : Principal, amount : Nat) : async TxReceipt {
        let tid: Text = Principal.toText(tokenId);
        assert(tokens.hasToken(tid));

        ignore _addRecord(
            msg.caller, "withdraw-pre", 
            [
                ("tokenId", #Text(tid)),
                ("from", #Principal(msg.caller)),
                ("to", #Principal(msg.caller)),
                ("amount", #Text(_u64ToText(amount))),
                ("fee", #Text(_u64ToText(tokens.getFee(tid)))),
                ("balance", #Text(_u64ToText(tokens.balanceOf(tid, msg.caller)))),
                ("totalSupply", #Text(_u64ToText(tokens.totalSupply(tid))))
            ]
        );
        
        if (tokens.burn(tid, msg.caller, amount)) {
            let tokenActor : ICRC2TokenActor = actor(tid);
            let fee = tokens.getFee(tid);
            var txid : Nat = 0;
            try {
                var withdrawAmount : Nat = amount - fee;
                switch(await _transfer(tokenActor, msg.caller, withdrawAmount)) {
                    case(#Ok(id)) { txid := id; };
                    case(#Err(e)) {
                        ignore tokens.mint(tid, msg.caller, amount);
                        return #err("token transfer failed:" # tid);
                    };
                    case(#ICRCTransferError(e)) {
                        ignore tokens.mint(tid, msg.caller, amount);
                        return #err("token transfer failed:" # tid);
                    };
                };
            } catch (e) {
                let ticketId : Text = _failedWithdraw(tid, msg.caller, amount);
                ignore _addRecord(
                    msg.caller, "withdraw-failed", 
                    [
                        ("ticketId", #Text(ticketId)),
                        ("tokenId", #Text(tid)),
                        ("from", #Principal(msg.caller)),
                        ("to", #Principal(msg.caller)),
                        ("amount", #Text(_u64ToText(amount))),
                        ("fee", #Text(_u64ToText(tokens.getFee(tid)))),
                        ("balance", #Text(_u64ToText(tokens.balanceOf(tid, msg.caller)))),
                        ("totalSupply", #Text(_u64ToText(tokens.totalSupply(tid)))),
                        ("Error", #Text(Error.message(e))),
                    ]
                );
                return #err("token transfer failed:" # ticketId);
            };
            ignore _addRecord(
                msg.caller, "withdraw", 
                [
                    ("tokenId", #Text(tid)),
                    ("txid", #Text(_u64ToText(txid))),
                    ("from", #Principal(msg.caller)),
                    ("to", #Principal(msg.caller)),
                    ("amount", #Text(_u64ToText(amount))),
                    ("fee", #Text(_u64ToText(fee))),
                    ("balance", #Text(_u64ToText(tokens.balanceOf(tid, msg.caller)))),
                    ("totalSupply", #Text(_u64ToText(tokens.totalSupply(tid))))
                ]
            );
            txCounter += 1;
            return #ok(txCounter - 1);
        }; 
        return #err("burn token failed:" # tid);
    };

    /*
      - Query the Principal ID of the current `owner`
      - Requirements: `msg.caller` can be ANY
      - Returns:
        - Principal ID of `owner`
    */
    public query func getOwner() : async Principal {
        return owner;
    };

    /*
      - Query the Principal ID of the current `feeTo`
      - Requirements: `msg.caller` can be ANY
      - Returns:
        - Principal ID of `feeTo`
    */
    public query func getFeeTo() : async Principal {
        return feeTo;
    };

    /*
      - Query the metadata of supported token `tokenId`
      - Requirements: `msg.caller` can be ANY
      - Params: 
        - `tokenId` the Principal ID of querying token (as Text)
      - Returns:
        - TokenAnalyticsInfo: (name, symbol, decimals, fee, totalSupply)
    */
    public query func getTokenMetadata(tokenId : Text) : async TokenAnalyticsInfo {
        return tokens.getMetadata(tokenId);
    };

    /*
      - Query the metadata of a created token pair
      - Requirements: `msg.caller` can be ANY
      - Params: 
        - `bToken` the Principal ID of the base token (as Text)
        - `qToken` the Principal ID of the quote token (as Text)
      - Returns:
        - PairInfoExt: (id, bToken, qToken, creator, bReserve, qReserve, pLast, k, l, feeRate, totalSupply, lpToken)
    */
    public query func getPair(bToken: Text, qToken: Text) : async ?PairInfoExt {
        let pair = bToken # ":" # qToken;
        let pairInfo = switch(pairs.get(pair)) {
            case (?p) {
                let info : PairInfoExt = {
                    id = p.id;
                    bToken = p.bToken;
                    qToken = p.qToken;
                    creator = p.creator;
                    bReserve = p.bReserve;
                    qReserve = p.qReserve;
                    pLast = p.pLast;
                    k = p.k;
                    l = p.l;
                    feeRate = p.feeRate;
                    totalSupply = p.totalSupply;
                    lpToken = p.lpToken;
                };
                ?info
            };
            case(_) {
                return null;
            };
        };
        return pairInfo;
    };

    /*
      - Query current balances of `user`
      - Requirements: `msg.caller` can be ANY
      - Params: 
        - `user` the User's Principal ID
      - Returns:
        - UserInfo: {balances : [Text, Nat], lpBalances : [Text, Nat]}
    */
    public query func getUserInfo(user : Principal): async UserInfo {
        {
            balances = tokens.getBalances(user);
            lpBalances = lpTokens.getBalances(user);
        }
    };

    /*
      - Calculate the amount of `qToken` that `msg.caller` needs to pay in swapping
      - Requirements: `msg.caller` can be ANY
      - Params: 
        - `bToken` the Principal ID of `bToken`
        - `qToken` the Principal ID of `qToken`
        - `oAmount` the exact amount of `bToken` that `msg.caller` wants to receive
      - Returns:
        - iAmount: the amount of `qToken` that `msg.caller` needs to pay (included tx_fee)
    */
    public shared(msg) func getAmountIn(
        bToken : Principal,
        qToken : Principal,
        oAmount : Nat
    ) : async TxReceipt {
        if (oAmount == 0) return #err("Amount should not be zero");

        let btid : Text = Principal.toText(bToken);
        let qtid : Text = Principal.toText(qToken);
        if (tokens.hasToken(btid) == false) return #err("Token not supported: " # btid);
        if (tokens.hasToken(qtid) == false) return #err("Token not supported: " # qtid);
        var pair : PairInfo = switch (pairs.get(btid # ":" # qtid)) {
            case (?p) { p; };
            case (_) return #err("Pair not existed");
        };
        if (oAmount >= pair.bReserve) return #err("Exceed pool reserve: " # btid);
        let updateInfo : SwapUpdate = _getSwapUpdate(pair, oAmount);
        let iAmount : Nat = updateInfo.dy + updateInfo.fee;

        return #ok(iAmount);
    };

    /*
      - Retrieve a list of supported tokens
      - Requirements: `msg.caller` can be ANY
      - Returns:
        - [TokenInfoExt]: [{id, name, symbol, decimals, fee, totalSupply}]
    */
    public shared(msg) func getTokenList() : async [TokenInfoExt] {
        return tokens.tokenList();
    };

    public shared(msg) func getPairList() : async [PairInfoExt] {
        let pairList = Buffer.Buffer<PairInfoExt>(pairs.size());
        for ((k, v) in pairs.entries()) {
            let info : PairInfoExt = {
                id = v.id;
                bToken = v.bToken;
                qToken = v.qToken;
                creator = v.creator;
                bReserve = v.bReserve;
                qReserve = v.qReserve;
                pLast = v.pLast;
                k = v.k;
                l = v.l;
                feeRate = v.feeRate;
                totalSupply = v.totalSupply;
                lpToken = v.lpToken;
            };

            pairList.add(info);
        };
        return Buffer.toArray(pairList);
    };
    
    public shared(msg) func getPairListByCreator(creator : Principal): async [PairInfoExt] {
        let pairList = await getPairList();
        return Array.filter<PairInfoExt>(pairList, func pair = pair.creator == creator);
    };

    /*
      - Retrieve a current balance of `user`
      - Requirements: `msg.caller` can be ANY
      - Params: 
        - `tokenId` the Principal ID of `token` (as Text)
        - `user` the Principal ID of an account that needs to query
      - Returns:
        - balance: user's current balance
    */
    public shared(msg) func balanceOf(tokenId : Text, user : Principal) : async Nat {
        if(Text.contains(tokenId, #text ":")) {
            return lpTokens.balanceOf(tokenId, user);
        } else {
            return tokens.balanceOf(tokenId, user);
        };
    };

    /*
      - Retrieve a current Certified Asset Provenance (CAP) settings
      - Requirements: `msg.caller` can be ANY
      - Returns:
        - CapSettings object:
          - CapRootBucketId: as Text (option)
          - CapId: the Pricipal ID (as Text) of CAP Canister
    */
    public shared(msg) func getCapSetting() : async CapSettings {
      return ({
        CapRootBucketId = cap.getRootBucketId();
        CapId = capId;
      });
    };

    /* *************************************** Private Functions *************************************** */
    private func _transfer(tokenActor : ICRC2TokenActor, caller : Principal, amount : Nat) : async TransferReceipt {
        var defaultSubaccount : Blob = Utils.defaultSubAccount();
        var args : ICRCTransferArg =
        {
            from_subaccount = ?defaultSubaccount;
            to = { owner = caller; subaccount = ?defaultSubaccount };
            amount = amount;
        };
        switch (await tokenActor.icrc1_transfer(args)) {
            case(#Ok(id)) { return #Ok(id); };
            case(#Err(e)) { return #ICRCTransferError(e); };
        };
    };

    private func _transferFrom(
        tid : Text,
        tokenActor : ICRC2TokenActor,
        caller : Principal,
        amount : Nat, 
        fee: Nat
    ) : async TransferReceipt{      
        var args = {
            from = { owner = caller; subaccount = null };
            to = { owner = Principal.fromActor(this); subaccount = null };
            amount = amount;
        };
        switch (await tokenActor.icrc2_transfer_from(args)){
            case (#Ok(id)) { return #Ok(id); };                 
            case (#Err(e)) { return #ICRCTransferError(e); };
        };              
    };

    private func _getSwapUpdate(pair : PairInfo, oAmount : Nat) : SwapUpdate {
        let sqrtDx : Nat = Utils.sqrt(oAmount);
        let sqrtX0 : Nat = Utils.sqrt(pair.bReserve);
        let temp : Nat = sqrtX0 - sqrtDx;

        let Dy : Nat = (pair.pLast * oAmount * (3 * temp * scale + 2 * pair.k * sqrtDx) / (3 * temp)) / (scale**2); 
        let P1 : Nat = (pair.pLast * (temp * scale**2 + pair.k * pair.l * sqrtDx) / (temp)) / (scale**2);
        let txFee : Nat = (Dy * pair.feeRate) / scale;
        let y1 : Nat = pair.qReserve + Dy + txFee;
        let x1 : Nat = pair.bReserve - oAmount;

        let update : SwapUpdate = {
            p1 = P1;
            x1 = x1;
            y1 = y1;
            dy = Dy;
            fee = txFee;
        };

        return update;
    };

    private func _failedWithdraw(tokenId : Text, caller : Principal, amount : Nat) : Text {
        ticketNo += 1;
        let ticketId : Text = _u64ToText(ticketNo);
        failedWithdraws.put(
            ticketId,
            {
              tokenId = tokenId; 
              caller = caller; 
              amount = amount; 
              refundStatus = false
            }
        );
        return ticketId;
    };

    private func _getMetadata(tokenActor : ICRC2TokenActor, tokenId : Principal) : async Metadata {
        var metadata = await tokenActor.icrc1_metadata();
        var totalSupply = await tokenActor.icrc1_total_supply();
        var name : Text = "";
        var symbol : Text = "";
        var fee : Nat = 0;
        var decimals : Nat = 0;

        for (data in metadata.vals()) {
            switch (data.0) {
                case ("icrc1:name") {
                    switch (data.1) {
                        case(#Text(name_)) {
                            name := name_;
                        };
                        case(_) {};
                    }
                };
                case ("icrc1:symbol") {
                    switch (data.1) {
                        case (#Text(symbol_)) {
                            symbol := symbol_;
                        };
                        case(_) {};
                    }
                };
                case ("icrc1:decimals") {
                    switch (data.1) {
                        case (#Nat(decimals_)) {
                            decimals := decimals_;
                        };
                        case (_) {};
                    };
                };
                case ("icrc1:fee") {
                    switch (data.1) {
                        case (#Nat(fee_)) {
                            fee := fee_;
                        };
                        case (_) {};
                    };
                };
                case (_) {};
            };
        };
        var meta : Metadata = {
            logo = "";
            name = name;
            symbol = symbol;
            decimals = Nat8.fromNat(decimals);
            totalSupply = totalSupply;
            fee = fee;
            owner = tokenId;
        };
        return meta;
    };

    private func _addRecord(caller : Principal, operation_ : Text, details_ : [(Text, Root.DetailValue)]) : async () {
        let record : Root.IndefiniteEvent = {
            caller = caller;
            operation = operation_;
            details = details_;
        };
        ignore cap.insert(record);
    };

    private func _u64ToText(value : Nat) : Text {
        return Nat.toText(value);
    };

    private func _floatToText(value : Float) : Text {
        return Float.format(#exact, value);
    };

    //  These two below functions used to migrate data: pre-upgrade and post-upgrade Canister
    private func _mapToArray(x: [(Text, TokenInfo)]) : [(Text, TokenInfoExt, [(Principal, Nat)], [(Principal, [(Principal, Nat)])])] {
        var size : Nat = x.size();
        var token : TokenInfoExt = {
            id = "";
            name = "";
            symbol = "";
            decimals = 0;
            fee = 0;
            totalSupply = 0;
        };
        var res_temp: [var (Text, TokenInfoExt, [(Principal, Nat)], [(Principal, [(Principal, Nat)])])] = Array.init<(Text, TokenInfoExt, [(Principal, Nat)], [(Principal, [(Principal, Nat)])])>(size, ("", token, [],[]));
        size := 0;
        for ((k, v) in x.vals()) {
            let _token : TokenInfoExt = {
                id = v.id;
                name = v.name;
                symbol = v.symbol;
                decimals = v.decimals;
                fee = v.fee;
                totalSupply = v.totalSupply;
            };
            var allowances_size : Nat = v.allowances.size();
            var allowances_temp : [var (Principal, [(Principal, Nat)])] = Array.init<(Principal, [(Principal, Nat)])>(allowances_size, (owner, []));
            allowances_size := 0;
            for ((i,j) in v.allowances.entries()) {
                allowances_temp[allowances_size] := (i, Iter.toArray(j.entries()));
                allowances_size += 1;
            };
            let allowances_temp_ = Array.freeze(allowances_temp);
            res_temp[size] := (k, _token, Iter.toArray(v.balances.entries()), allowances_temp_);
            size += 1;
        };
        return Array.freeze(res_temp);
    };

    private func _arrayToMap(x: [(Text, TokenInfoExt, [(Principal, Nat)], [(Principal, [(Principal, Nat)])])]) : [(Text, TokenInfo)] {
        var _token : TokenInfo = {
            id = "";
            var name = "";
            var symbol = "";
            var decimals = 0;
            var fee = 0;
            var totalSupply = 0;
            balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
            allowances = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(1, Principal.equal, Principal.hash);
        };
        var size = x.size();
        var res_temp: [var (Text, TokenInfo)] = Array.init<(Text, TokenInfo)>(size, ("", _token));
        size := 0;
        for ((a, b, c, d) in x.vals()) {
            var map2_temp = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(1, Principal.equal, Principal.hash);
            for ((k, v) in d.vals()) {
                let allowed_temp = HashMap.fromIter<Principal, Nat>(v.vals(), 1, Principal.equal, Principal.hash);
                map2_temp.put(k, allowed_temp);
            };
            let token: TokenInfo = {
                id = b.id;
                var name = b.name;
                var symbol = b.symbol;
                var decimals = b.decimals;
                var fee = b.fee;
                var totalSupply = b.totalSupply;
                balances = HashMap.fromIter<Principal, Nat>(c.vals(), 1, Principal.equal, Principal.hash);
                allowances = map2_temp;
            };
            res_temp[size] := (a, token);
            size += 1;
        };
        return Array.freeze(res_temp);
    };

    system func inspect({
      caller : Principal;
      arg : Blob;
      msg : {
          #setOwner : () -> Principal;
          #setFeeTo : () -> Principal;
          #setToken : () -> Principal;
          #setCapId : () -> Principal;
          #setPair : () -> (Principal, Principal);
          #deposit : () -> (Principal, Nat);
          #depositTo : () -> (Principal, Principal, Nat);
          #setPairConfig : () -> (Text, Text, Nat, Nat, Nat);
          #withdraw : () -> (Principal, Nat);
          #addLiquidity : () -> (Principal, Principal, Nat, Nat, Int);
          #swap : () -> (Principal, Principal, Nat, Int);
          #quote : () -> (Principal, Principal, Nat);

          #getOwner : () -> ();
          #getFeeTo : () -> ();
          #getTokenMetadata : () -> Text;
          #getPair : () -> (Text, Text);
          #getUserInfo : () -> Principal;
          #getAmountIn : () -> (Principal, Principal, Nat);
          #getTokenList : () -> ();
          #getPairList : () -> ();
          #getPairListByCreator : () -> (Principal);
          #balanceOf : () -> (Text, Principal);
          #getCapSetting : () -> ();
      }
    }) : Bool {
        switch (msg) {
            case (#setOwner _) { ( caller == owner ) };
            case (#setFeeTo _) { ( caller == owner ) };
            case (#setToken _) { ( caller == owner ) };
            case (#setCapId _) { ( caller == owner ) };
            case (#setPair _) { true };
            case (#setPairConfig d) {
                var pair = d().0 # ":" # d().1;
                if (Option.isSome(pairs.get(pair)) == false or caller != owner) return false;
                return true;
            };
            case (#deposit d) { 
                var tid : Text = Principal.toText(d().0);      
                if (tokens.hasToken(tid) == false or Principal.isAnonymous(caller)) return false;
                return true;
            };
            case (#depositTo d) { 
                var tid : Text = Principal.toText(d().0);               
                var to : Principal = d().1;
                var amount : Nat = d().2;
                var fee: Nat = tokens.getFee(tid);
                if (
                    tokens.hasToken(tid) == false or 
                    Principal.isAnonymous(to) or 
                    Nat.less(amount,fee) or 
                    Principal.isAnonymous(caller)
                ) return false;
                return true;
            };
            case (#addLiquidity d) { true };
            case (#swap d) { true };
            case (#withdraw d) {
                var tid : Text = Principal.toText(d().0);
                if (tokens.hasToken(tid) == false or Principal.isAnonymous(caller)) return false;
                return true;
            };
            case (#quote d) { true };

            case (#getOwner _) { true };
            case (#getFeeTo _) { true };
            case (#getTokenMetadata _) { true };
            case (#getPair _) { true };
            case (#getUserInfo _) { true };
            case (#getAmountIn _) { true };
            case (#getTokenList _) { true };
            case (#getPairList _) { true };
            case (#getPairListByCreator _) { true };
            case (#balanceOf _) { true };
            case (#getCapSetting _) { true };
        }
    };

    system func preupgrade() {
        mPairs := Iter.toArray(pairs.entries());
        mFailedWithdraws := Iter.toArray(failedWithdraws.entries());
        mLPTokens := _mapToArray(lpTokens.getTokenInfoList());
        mTokens := _mapToArray(tokens.getTokenInfoList());
    };

    system func postupgrade() {
        pairs := HashMap.fromIter<Text, PairInfo>(mPairs.vals(), mPairs.size(), Text.equal, Text.hash);
        failedWithdraws := HashMap.fromIter<Text, WithdrawState>(mFailedWithdraws.vals(), mFailedWithdraws.size(), Text.equal, Text.hash);
        lpTokens := Tokens.Tokens(feeTo, _arrayToMap(mLPTokens));
        tokens := Tokens.Tokens(feeTo, _arrayToMap(mTokens));

        mPairs := [];
        mFailedWithdraws := [];
        mLPTokens := [];
        mTokens := [];
    };
}