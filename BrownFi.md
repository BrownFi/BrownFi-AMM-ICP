# BrownAMM Introduction
**Novel AMM protocol with high CE & tailored market making strategies**  

## Fundamental problems
- Uniswap v2 is simple but low Capital Efficiency (CE)
- Uniswap v3 has high CE but complicated UX for LPs, non-fungible LP tokens. It requires manually adjusting bins &  unbalanced inventory.
## Solution (a novel AMM - Elastic PLOB): transform MM to asset allocation
We invent a novel price discovery mechanism, namely, **Elastic PLOB** to tailor CE & market making on AMM, while keeping simple UX, fungibility & reusability of LP tokens of Uniswap v2. PLOB stands for Parameterized Limit Order-Book, which inspires Octan model.

## Conceptualization
BrownFi proposes a novel AMM model, where LPs allocate their liquidity into the pool according to a bonding curve that mimics the general shape of a traditional limit orderbook (LOB). We introduce a novel concept, *Elastic Factor*, to allow the liquidity concentration of the AMM to be automatically adjusted according to the relative trading size. This elasticity ensures unbounded liquidity, thus the pool never runs out of liquidity regardless of the trading size. Our general Elastic model covers the special case of the constant-product market making model $xy=k$. More importantly, it opens a new door to create arbitrary AMM with customized local orderbook shape around the market price as well as tailored liquidity concentration.

The major contribution of this model is that, when the AMM is locally V-shaped, both impermanent loss (IL) and loss-versus-rebalancing (LVR) in this model asymptotically vanish when the trading frequency is high or, equivalently when the pool size is large. Therefore, the pool size will behave exactly like a rebalancing portfolio in the geometric Brownian motion model.

Some other novelties of the model are as follows.
- Possesses desired statistical properties of the traditional LOB model, for instance locally V-shaped (or square root price impact) and price reversals.
- Offers much higher concentrated liquidity than Uniswap V2. To be more precise, its capital efficiency is about 400 times higher than that of the Uniswap V2 model at typical 2% around the mid price.
- Opens a new door for flexible market making (MM) strategies for LPs, thus transforming the MM problem to a multi-funds asset allocation problem. 

Note: loss-versus-rebalancing (LVR) is an important problem among among [Nakamoto challenges](https://a16zcrypto.com/posts/announcement/introducing-the-nakamoto-challenge-addressing-the-toughest-problems-in-crypto/) proposed by A16Z. BrownFi Elastic model is a response to the problem.
## BrownFi: market proposition & USP
![image](https://github.com/Octan-Labs/BrownFi-AMM-ICP/assets/45308207/a832fe9e-004c-487f-82e4-b44209da73f8)


This repo is in development.
Please stay tuned for our updates. Contact Telegram: @paven86  
Visit [BrownFi pitchdeck](https://drive.google.com/open?id=110ZHCGQ5dIzrrAkMctXfm20SOVNk7mt1&usp=drive_fs)


## Math behinds
The core swap function of BrownFi is based on an invention of a price discovery mechanism: 
- Given a pair of tokens X and Y, where X is base token (e.g. ETH) and Y is quote token (e.g. USDT). 
- Assume that the pool reserve has $x_0$ tokens X and $y_0$ tokens Y with the initial price is $P_0=y_0/x_0.$
- For any trade input of $dx$ into the pool, we compute the average trading price $\bar{P} = P_0 * (1 + 2R/3),$ where $R$ denotes price impact factor.
- Price impact $R=K * f(dx)$ is proportionate to relative order size $dx.$ Parameter $K$ is usually set LARGE for HIGH volatility, and small for low volatility. We prove that for a certain $K$ and a suitable function $f(dx)$, our elastic PLOB model is the same as CPMM model of Uniswap V2.
- Finally, we compute the trade output based on the input and the computed average trading price.
> BrownFi AMM is solely based on research papers on Elatic PLOB model, peer-reviewed by scientists in the fields and accepted for publication on [IEEE Access](https://ieeeaccess.ieee.org/), a globally notable academic journal with high impact factor.  


### High Level Architecture

<p align="center">
  <img src="images/docs/Highlevel_Architecture.png" alt="High Level Architecture" style="height: 275px; width: 275px;"/>
</p>

### Use Case Diagram

<p align="center">
  <img src="images/docs/Use_Case.png" alt="BrownFi Use Case Diagram" style="height: 500px; width: 250px"/>
</p>

### Flow Chart Diagrams

##### Set Owner

<p align="center">
  <img src="images/docs/setOwner.png" alt="Set New Owner Flow Chart" style="height: 300px; width: 225px;"/>
</p>

##### Set FeeTo

<p align="center">
  <img src="images/docs/setFeeTo.png" alt="Set New FeeTo Flow Chart" style="height: 300px; width: 225px;"/>
</p>

##### Set Token

<p align="center">
  <img src="images/docs/setToken.png" alt="Register Token Flow Chart" style="height: 350px; width: 350px;"/>
</p>

##### Set Pair Config

<p align="center">
  <img src="images/docs/setPairConfig.png" alt="Update Pair Configurations Flow Chart" style="height: 350px; width: 450px;"/>
</p>

##### Set Pair

<p align="center">
  <img src="images/docs/setPair.png" alt="Create Pair Flow Chart" style="height: 300px; width: 800px;"/>
</p>

##### Deposit

<p align="center">
  <img src="images/docs/deposit.png" alt="Deposit Flow Chart" style="height: 400px; width: 550px;"/>
</p>

##### DepositTo

<p align="center">
  <img src="images/docs/depositTo.png" alt="DepositTo Flow Chart" style="height: 400px; width: 550px;"/>
</p>

