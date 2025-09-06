# Tristero Trading Interface

A sophisticated simulated crypto trading interface built with Next.js 15, featuring real-time price data from Hyperliquid API, position management, and a modern dark-themed UI.

## 🚀 Live Demo

[Add your deployed URL here]

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Integration](#api-integration)
- [Design Decisions](#design-decisions)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

Tristero Trading Interface is a full-featured simulated trading platform that allows users to:

- Browse and select from 100+ crypto assets
- View real-time price data and historical charts
- Execute simulated trades with leverage
- Track open positions with P&L calculations
- Monitor trade history and account balances
- Experience a professional trading interface

Built as a technical assessment showcasing modern React patterns, state management, and API integration skills.

## ✨ Key Features

### Core Trading Features

- **Real-time Price Data**: Live price updates for all supported assets via Hyperliquid API
- **Asset Selection**: Browse and search through 100+ crypto markets with filtering
- **Trading Interface**: Place market orders with configurable leverage (10x)
- **Position Management**: View open positions with real-time P&L calculations
- **Trade History**: Complete transaction history with detailed trade information
- **Account Balances**: Real-time USDC balance and position tracking

### User Experience

- **Dark Theme**: Professional dark mode interface optimized for trading
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Updates**: Live price polling and position updates
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Smooth loading indicators throughout the app
- **Network Status**: Online/offline detection and handling

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for global state with persistence
- **Data Fetching**: TanStack Query for efficient API management
- **Component Architecture**: Modular, reusable component design
- **Performance**: Optimized rendering and data updates

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management

### API & Data

- **Hyperliquid API** - Real-time market data and trading
- **Ethers.js** - Ethereum wallet integration
- **Local Storage** - Persistent state management

### Development

- **Turbopack** - Fast bundling and development
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

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

// Server State (TanStack Query)
- Market data
- Price history
- Account data
- Positions
- Trade history
```

### Component Architecture

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── Header/           # Navigation and wallet
│   ├── Trade/            # Trading interface
│   ├── Positions/        # Position management
│   └── TradeHistory/     # Transaction history
├── hooks/                # Custom React hooks
├── lib/                  # API and service layer
├── state/                # Global state management
└── types/                # TypeScript definitions
```

### Data Flow

1. **Price Updates**: Real-time polling → Global state → UI updates
2. **Trading**: Form submission → API call → Position update → UI refresh
3. **Navigation**: Route changes → Component mounting → Data fetching

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
   # or
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

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

### Error Handling

- Network failure recovery
- API rate limiting
- Invalid data validation
- User-friendly error messages

## 🎨 Design Decisions

### Component Reusability

- **Common Components**: Created reusable `LoadingState`, `EmptyState`, and `TableHeader` components
- **Props-based Customization**: Flexible components that adapt to different contexts
- **DRY Principle**: Eliminated duplicate code across Positions and TradeHistory

### State Management Strategy

- **Zustand over Redux**: Chosen for simplicity and TypeScript integration
- **TanStack Query**: Handles server state with caching and background updates
- **Local Storage**: Persists user preferences and selected ticker

### Performance Optimizations

- **Real-time Updates**: Efficient price polling with change detection
- **Component Memoization**: Prevents unnecessary re-renders
- **Lazy Loading**: Route-based code splitting
- **Debounced Inputs**: Optimized search and form interactions

### UI/UX Decisions

- **Dark Theme**: Professional trading interface aesthetic
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Loading States**: Clear feedback during async operations
- **Error Boundaries**: Graceful error handling and recovery

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── positions/         # Positions page
│   └── trades/            # Trading page
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
│   └── TradeHistory/      # Transaction history
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

## 📸 Screenshots

### Trading Interface

- Market selection with search and filtering
- Real-time price chart with historical data
- Trading form with leverage and position sizing
- Account balance and position information

### Position Management

- Open positions table with P&L calculations
- Real-time price updates
- Close position functionality
- Responsive design for mobile

### Trade History

- Complete transaction history
- Detailed trade information
- Filtering and sorting capabilities
- Professional table layout
