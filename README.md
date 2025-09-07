# Tristero Trading Interface

Tristero Trading Interface is a crypto trading platform where users can trade 100+ assets with leverage, track positions and history, view real-time data and charts, and analyze portfolio performance in a professional interface. It uses real funds to execute orders on hyperliquid.

Built as a technical assessment showcasing modern React patterns, state management, and API integration skills.

## 🚀 Live Demo

[Watch the demo video](https://drive.google.com/file/d/1PtkbAu5H7VlAya4f9zTaGUF9DpyJkCnk/view?usp=sharing)

> **Note**: Wallet connection is only supported on desktop/web browsers. Mobile devices are not supported for wallet functionality.
> **Important**: To place orders, you must add your private key to the `.env` file. Without this, you can only view data but cannot execute trades.
> **⚠️ Real Trading**: This application connects to Hyperliquid's and works with real funds, not paper trading. Any order you place here can also be tracked on [Hyperliquid](app.hyperliquid.xyz)

## ✨ Key Features

### Core Trading Features

- **Real-time Price Data**: Live price updates for all supported assets via Hyperliquid API
- **Asset Selection**: Browse and search through 100+ crypto markets with filtering
- **Trading Interface**: Place market orders with max leverage 2x.
- **Position Management**: View open positions with real-time P&L calculations
- **Trade History**: Complete transaction history with detailed trade information
- **Portfolio Analytics**: Comprehensive portfolio performance tracking with charts and statistics
- **Account Balances**: Real-time USDC balance and position tracking

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features and compiler
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Zustand for global state with persistence
- **TanStack Query** -Efficient API management

### API & Data

- **Hyperliquid API** - Real-time market data and trading
- **Hyperliquid SDK** - To create and close orders
- **Ethers.js** - Ethereum wallet integration

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tristero-trading
   ```

2. **Install dependencies**

```bash
   pnpm install
   # or
   npm install
```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_PRIVATE_KEY=your_private_key_here
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

# or

npm run dev

````

5. **Open in browser**
Navigate to `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
````

## 🔌 API Integration

### Hyperliquid API Endpoints

The application integrates with Hyperliquid's public API:

```typescript
// Market Data
POST https://api.hyperliquid.xyz/info
Body: { "type": "meta" }

// Real-time Prices
POST https://api.hyperliquid.xyz/info
Body: { "type": "allMids" }

// Price History
POST https://api.hyperliquid.xyz/info
Body: {
  "type": "candleSnapshot",
  "req": {
    "coin": "ETH",
    "interval": "1h",
    "startTime": timestamp
  }
}
```

# 🏗️ Architecture & Design Decisions

This document elaborates on the architectural choices and design decisions made in the Tristero Trading application, explaining the reasoning behind each technical decision.

### Why Zustand for Global State?

- **Minimal Global State**: Only data that needs to be shared across multiple components/components that don't have a common parent
- **Performance**: Avoids unnecessary re-renders by keeping global state minimal
- **Simplicity**: Zustand provides a clean, simple API without the boilerplate of Redux
- **Persistence**: Built-in persistence for user preferences (theme) and critical data (wallet address)
- **Network Status**: Real-time network connectivity monitoring (isOnline) for better user experience

**Our App Example**:
We fetch user's open positions once and update mark prices + P&L calculations in real-time as we receive live price feeds. This approach eliminates the need to continuously fetch portfolio data or maintain it in global state, reducing API calls and improving performance.

**Why we chose to store prices inside Zustand**:
If we managed prices with local state, every tick update would bubble through parent components and cause unnecessary re-renders across the tree (e.g., updating ETH’s price could also re-render BTC and SOL tickers). Zustand solves this by:
• batching updates (setPricesBatch),
• enabling O(1) lookups of specific tickers,
• letting components subscribe only to the prices they care about (e.g., <Ticker coin="ETH" />),
• and persisting preferences while keeping ephemeral high-frequency state in memory.

This approach eliminates redundant API calls, avoids performance bottlenecks from frequent re-renders, and keeps the trading UI snappy during live price updates.

### Why React Query

We use TanStack Query to manage all server data. It handles caching, background refreshes, retries, and error handling automatically, and a big advantage is that we don’t need to wire up our own local state for loading or errors. For trading actions, we also get optimistic updates, so the UI feels instant while the request is still processing.

## ⚡ Performance Optimization Approach

### React 19 + React Compiler

Rely on React 19's automatic optimizations instead of manual `useMemo` and `useCallback`.

**Configuration**:

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    reactCompiler: true
  }
};
```

**Why this approach?**

- **Automatic Memoization**: React Compiler automatically optimizes components and hooks
- **Reduced Boilerplate**: No need for manual `useMemo`/`useCallback` everywhere
- **Better Performance**: Compiler can make more aggressive optimizations than manual memoization
- **Cleaner Code**: Focus on business logic rather than optimization details

## 🧩 Component Architecture

### Atomic Design Principles

Organize components using atomic design methodology for standardized UI patterns and clear component hierarchy. Most components are under 100 lines, some range between 100-150 lines, and the largest component (TradingForm) reaches 305 lines.

**Structure**:

```
components/
├── common/           # Atoms (LoadingState, EmptyState)
├── Header/          # Molecules (Navigation, WalletSection)
├── Trade/           # Organisms (TradingForm, MarketSelect)
├── Positions/       # Templates (PositionsTable)
└── Portfolio/       # Pages (PortfolioStats, PortfolioChart)
```

## 🔌 API Integration Patterns

### Service Layer Architecture

Create a service layer (`trading-service.ts`) that wraps the Hyperliquid SDK to hide SDK complexity from components. Also for future proofing, easy to switch SDKs or add features

### API Wrapper Pattern

Create API wrappers (`api.ts`) that handle common patterns to standardized error handling and response format

**Pattern**:

```typescript
// Service layer
async getPortfolio(userAddress: string): Promise<TradingResult>

// API wrapper
export async function getPortfolio(userAddress: string): Promise<ApiResponse<any>>

// React Query hook
export function usePortfolio(walletAddress: string)
```

## 🔒 Type Safety & Code Organization

### Type-First Development

Define types before implementation, use strict TypeScript configuration.

### Modular Type Organization

Split types into domain-specific files with centralized exports.

### Utility Function Organization

Split utilities into domain-specific files with centralized exports.

### Error Handling Strategy

Implement multiple layers of error handling.

**Layers**:

1. **API Layer**: Try-catch in service functions
2. **Query Layer**: TanStack Query error handling
3. **Component Layer**: Error boundaries and fallback UI
4. **User Layer**: User-friendly error messages

**Implementation**:

```typescript
<QueryClient>
  <ErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </ErrorBoundary>
</QueryClient>
```

### Dark Mode Support

Implement system-aware dark mode with manual toggle.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── positions/         # Positions page
│   ├── trades/            # Trading page
│   └── portfolio/         # Portfolio page
├── components/
│   ├── common/            # Shared UI components
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   └── TableHeader.tsx
│   ├── Header/            # Navigation components
│   ├── Trade/             # Trading interface
│   │   ├── Markets.tsx
│   │   ├── PriceChart.tsx
│   │   └── TradeForm/
│   ├── Positions/         # Position management
│   ├── TradeHistory/      # Transaction history
│   └── Portfolio/         # Portfolio analytics
├── hooks/                 # Custom React hooks
│   ├── useMarket.ts
│   ├── useTheme.ts
│   └── useWallet.ts
├── lib/                   # API and services
│   ├── api.ts
│   └── trading-service.ts
├── state/                 # Global state
│   └── store.ts
├── types/                 # TypeScript definitions
│   ├── ethereum.ts
│   └── trading.ts
└── utils/                 # Utility functions
    └── index.ts
```

## 📸 Screenshots & Demo

**View all screenshots and demo video:** [Google Drive Folder](https://drive.google.com/drive/folders/1ZUCu6YNzHiqLT-ZxF8rtUjga32R_DCvT?usp=sharing)

The folder contains:

- **Demo Video**: `tristero-trading-interface_ti67VVgA.mp4` - Complete application walkthrough
- **Screenshots**:
  - `market-landing-page.png` - Trading Interface
  - `markets-dropdown.png` - Market Select Dropdown
  - `create-new-position.png` - Trading Form with Input
  - `open-positions.png` - Open Positions
  - `trade-history.png` - Trade History
  - `portfolio.png` - Portfolio Analytics
