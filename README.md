### NovaXAgent

##AI-Powered Trading Strategy Research & Execution Platform

NovaXAgent is a modular, institutional-grade trading research and execution system designed to generate, test, and deploy algorithmic strategies using AI, real-time market data, and blockchain smart contracts.

## 🚀 Current Status

# Completed:

✅ AI-powered strategy generation engine

✅ Strategy backtesting engine (historical candles)

✅ WebSocket price streaming layer (forward testing)

✅ Smart contract for automated trade execution (Devnet)

✅ Backend engine architecture

✅ Risk management logic

✅ Worker-based strategy execution system

# In Progress / Partial:

⚠️ UI development (started but not completed due to limited frontend experience)

##🎯 What This Project Does

NovaXAgent allows users to:

Generate trading strategies using AI

Test strategies on historical data (backtest)

Forward-test strategies using live WebSocket prices

Execute approved strategies automatically via smart contract

Monitor live performance from dashboard

Secure funds inside a vault contract

🏗️ System Architecture
Frontend (Next.js / React)
        ↓
Backend API (Node.js / Fastify)
        ↓
AI Engine (Gemini)
        ↓
Trading Core (Strategy Engine + Workers)
        ↓
Blockchain (Smart Contract - Devnet)

🔌 Core Modules
1. AI Engine

Generates strategies

Optimizes parameters

Ranks performance

Explains logic

2. Strategy Engine

Real-time indicator calculation

Trade state machine

Risk control

Logging

3. Simulation Engine

Backtesting (historical candles)

Forward testing (live prices)

4. Execution Engine

Sends transactions to smart contract

Handles confirmations

Logs execution results

5. WebSocket Price Layer

Single connection

Multi-pair subscription

Auto reconnect

Heartbeat monitoring

6. Smart Contract (Devnet)

Vault management

Strategy execution

Ownership guards

Transaction validation

🧪 Current Features

Strategy backtesting engine

Forward testing via WebSocket

Risk controls (SL / TP)

ATR based sizing

Event-driven execution

Worker-based processing

Contract-based trade execution

🛠 Tech Stack
Layer	Technology
Frontend	Next.js, React
Backend	Node.js, Fastify
AI	Gemini
Database	Turso / libSQL
Blockchain	MultiversX (Devnet)
Streaming	WebSockets
Workers	PM2
Language	TypeScript
📌 Honest Note About UI

I attempted to build the frontend UI (sandbox terminal, dashboard, vault, etc.) but could not complete it due to limited experience with advanced frontend design and state management.

The backend and engine are fully functional and production-structured, but the UI layer remains a work in progress.

🧠 Smart Contract

A smart contract has been developed and deployed on Devnet that:

Executes trades automatically

Enforces ownership permissions

Stores vault balances

Supports strategy updates

🧩 Project Structure
apps/
 ├─ api
 ├─ strategy-engine
 ├─ ws-server
 ├─ workers
 ├─ ui (partial)
 ├─ smart-contract

🔒 Security
Layer	Protection
UI	Confirmation dialogs
Backend	Mode locks
Engine	Risk limits
Contract	Caller guards
Network	Devnet only
⚡ Roadmap
UI

Complete dashboard

Sandbox terminal

Strategy cards

Vault management

AI

Multi-strategy generation

Portfolio optimization

Risk-adjusted ranking

Engine

More indicators:

Bollinger Bands

VWAP

Ichimoku

Stochastic RSI

Trailing stop

Dynamic position sizing

Platform

Multi-user support

Authentication

Role-based permissions

Strategy marketplace

Execution

Mainnet support

Advanced transaction monitoring

Slippage protection

AI Agent

Chatbot for:

Starting/stopping strategies

Modifying risk

Executing trades

Portfolio insights

🔐 Smart Contract – NovaxVault (Devnet)

NovaXAgent uses a custom-built smart contract deployed on MultiversX Devnet to securely execute trades and manage funds.

Contract Info

Name: NovaxVault

Crate: novax-vault

Framework: multiversx-sc v0.64.0

Network: Devnet

Purpose: Secure automated trade execution

Constructor
constructor(router_address: Address)


Initializes the contract with the DEX router address.

Core Endpoint
executeSwap
executeSwap(
  token_out: TokenIdentifier,
  amount_out_min: BigUint
)


Description:

Called by the AI execution engine

Executes a swap on the DEX

Only callable by contract owner (AI agent wallet)

Accepts any token (* payable)

Security:

Ownership protected

Prevents unauthorized execution

Enforced on-chain

Readonly Endpoint
getRouterAddress()

Returns the configured router address.

Contract Capabilities

✔ Vault-based fund management
✔ Owner-only execution
✔ Slippage protection (amount_out_min)
✔ Supports any token
✔ Upgradeable
✔ Devnet restricted

Role in System
Execution Engine
      ↓
NovaxVault Smart Contract
      ↓
DEX Router
      ↓
Trade Execution

Why This Matters

This contract ensures:

• Funds never leave user custody
• Backend cannot steal funds
• All trades are on-chain
• Fully auditable
• Zero trust execution

Security Model
Layer	Protection
Caller	Owner-only
Execution	Slippage control
Network	Devnet only
Upgradability	Controlled
Future Plans

Mainnet deployment

Multi-strategy support

Emergency withdrawal

Multi-sig ownership

Fee management

🎯 Vision

NovaXAgent aims to become a:

Quant research lab

AI-powered trading assistant

Automated execution platform

Professional-grade strategy builder

⚠ Disclaimer

This project is for:

Educational

Research

Development purposes

Not financial advice.
Use at your own risk.

👨‍💻 Author

Built by Mohammed Zaid
Passionate about:

Quant trading

AI systems

Blockchain automation

⭐ Why This Project Stands Out

✔ Modular architecture
✔ Production-grade backend
✔ Smart contract integration
✔ AI research engine
✔ Forward testing infra
✔ Real execution layer
