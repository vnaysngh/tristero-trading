# Tristero Trading Interface

Tristero Trading Interface is a simulated crypto trading platform where users can trade 100+ assets with leverage,
track positions and history, view real-time data and charts, and analyze portfolio performance in a professional interface.

Built as a technical assessment showcasing modern React patterns, state management, and API integration skills.

## 🚀 Live Demo

[Watch the demo video](https://drive.google.com/file/d/1PtkbAu5H7VlAya4f9zTaGUF9DpyJkCnk/view?usp=sharing)

> **Note**: Wallet connection is only supported on desktop/web browsers. Mobile devices are not supported for wallet functionality.
> **Important**: To place orders, you must add your private key to the `.env` file. Without this, you can only view data but cannot execute trades.

## ✨ Key Features

### Core Trading Features

- **Real-time Price Data**: Live price updates for all supported assets via Hyperliquid API
- **Asset Selection**: Browse and search through 100+ crypto markets with filtering
- **Trading Interface**: Place market orders with configurable leverage (10x)
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

## 🏗 Architecture

### State Management

The application uses a hybrid state management approach:

```typescript
// Global App State (Zustand)
- Theme preferences
- Selected ticker
- Real-time prices
- Wallet connection
- Network status

// API State (React Query)
- Market data
- Price history
- Account data
- Positions
- Trade history
- Portfolio data
```

### Component Architecture

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── Header/           # Navigation and wallet
│   ├── Trade/            # Trading interface
│   ├── Positions/        # Position management
│   ├── TradeHistory/     # Transaction history
│   └── Portfolio/        # Portfolio analytics
├── hooks/                # Custom React hooks
├── lib/                  # API and service layer
├── state/                # Global state management
└── types/                # TypeScript definitions
```

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

### State Management Strategy

- **Zustand over Redux**: Chosen for simplicity and TypeScript integration with peristence.
- **TanStack Query**: Handles requests with caching and background updates

### Performance Optimizations

- **Real-time Updates**: Efficient price polling with change detection
- **Component Memoization**: Using latest version of React Compiler so I do not have to manually memoize
- **Lazy Loading**: Route-based code splitting (already implemented by Nextjs)
- **Debounced Inputs**: Optimized search and form interactions

### UI/UX Decisions

- **Dark Theme**: Professional trading interface aesthetic
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Loading States**: Clear feedback during async operations
- **Error Boundaries**: React Query library includes error boundary integration for network operations. By setting up error boundaries with fallback components, you get automatic error handling without additional configuration.

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
