import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Option "mo:base/Option";

import Tokens "./libraries/Tokens";
import Root "./libraries/Root";

shared(msg) actor class BrownFi(owner_ : Principal) = this {

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
    type Subaccount = Blob; 

    public type ICRC2TokenActor = actor {
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
    public type PairInfo = {
        id : Text;
        bToken : Text;           //  Principal
        qToken : Text;           //  Principal     
        creator : Principal;
        var bReserve : Nat;
        var qReserve : Nat;
        var pLast : Float;      //  last swap price  
        var k : Float;          //  liquidity concentration
        var l : Float;          //  price reversal
        var feeRate : Float;
        var totalSupply : Nat;
        lpToken : Text;
    };
    public type PairInfoExt = {
        id : Text;
        bToken : Text;           //  Principal
        qToken : Text;           //  Principal
        creator : Principal;
        bReserve : Nat;
        qReserve : Nat;
        pLast : Float;
        k : Float;
        l : Float;
        feeRate : Float;
        totalSupply : Nat;
        lpToken : Text;
    };
    public type TransferReceipt = { 
        #Ok: Nat;
        #Err: Errors;
        #ICRCTransferError: ICRCTransferError;
    };
    public type TokenInfo = Tokens.TokenInfo;
    public type TokenAnalyticsInfo = Tokens.TokenAnalyticsInfo;
    public type TxReceipt = Result.Result<Nat, Text>;

    private stable var owner = owner_;
    private stable var feeTo = owner_;
    private stable var txCounter : Nat = 0;
    private stable var depositCounter : Nat = 0;
    private stable var tokenFee: Nat = 10000; // 0.0001 if decimal == 8
    private stable let blackhole : Principal = Principal.fromText("aaaaa-aa");

    private var tokens : Tokens.Tokens = Tokens.Tokens(feeTo, []);
    private var lpTokens : Tokens.Tokens = Tokens.Tokens(feeTo, []);
    private var pairs = HashMap.HashMap<Text, PairInfo>(1, Text.equal, Text.hash);

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
        assert(not tokens.hasToken(tid));

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
            var k = 0;
            var l = 0;
            var feeRate = 0.001;
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
        k_ : Float,          
        l_ : Float,
        feeRate_ : Float
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
                        ("pLast", #Text(_floatToText(info.pLast))),
                        ("k", #Text(_floatToText(info.k))),
                        ("l", #Text(_floatToText(info.l))),
                        ("feeRate", #Text(_floatToText(info.feeRate))),
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
                        ("pLast", #Text(_floatToText(newInfo.pLast))),
                        ("k", #Text(_floatToText(newInfo.k))),
                        ("l", #Text(_floatToText(newInfo.l))),
                        ("feeRate", #Text(_floatToText(newInfo.feeRate))),
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
            case (#Err(e)) { return #err("token transfer failed:" # tid); };
            case (#ICRCTransferError(e)) { return #err("token transfer failed:" # tid); };
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


    /* *************************************** Private Functions *************************************** */
    private func _transferFrom(
        tid : Text,
        tokenActor : ICRC2TokenActor,
        caller : Principal,
        value : Nat, 
        fee: Nat
    ) : async TransferReceipt{      
        var args = {
            from = { owner = caller; subaccount = null };
            to = { owner = Principal.fromActor(this); subaccount = null };
            amount = value;
        };
        var txid = await tokenActor.icrc2_transfer_from(args);  
        switch (txid){
            case (#Ok(id)) { return #Ok(id); };                 
            case (#Err(e)) { return #ICRCTransferError(e); };
        };              
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
    };

    private func _u64ToText(value : Nat) : Text {
        return Nat.toText(value);
    };

    private func _floatToText(value : Float) : Text {
        return Float.format(#exact, value);
    };

    system func inspect({
      caller : Principal;
      arg : Blob;
      msg : {
          #setOwner : () -> Principal;
          #setFeeTo : () -> Principal;
          #setToken : () -> Principal;
          #setPair : () -> (Principal, Principal);
          #deposit : () -> (Principal, Nat);
          #depositTo : () -> (Principal, Principal, Nat);
          #setPairConfig : () -> (Text, Text, Float, Float, Float);

          #getOwner : () -> ();
          #getFeeTo : () -> ();
          #getTokenMetadata : () -> Text;
          #getPair : () -> (Text, Text);
      }
    }) : Bool {
        switch (msg) {
            case (#setOwner _) { ( caller == owner ) };
            case (#setFeeTo _) { ( caller == owner ) };
            case (#setToken _) { ( caller == owner ) };
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

            case (#getOwner _) { true };
            case (#getFeeTo _) { true };
            case (#getTokenMetadata _) { true };
            case (#getPair _) { true };
        }
    };

    system func preupgrade() {

    };

    system func postupgrade() {

    };
}