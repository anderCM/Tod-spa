# Tod
![Tod spa](https://static.wikia.nocookie.net/lgbt/images/5/53/Todd_Chavez.png/revision/latest?cb=20240325205726&path-prefix=es)

Web application for managing and reconciling financial transactions, sales, and digital wallets.

## Features

- **Authentication**: Secure login system with session management
- **Dashboard**: Overview with key metrics and distribution charts
- **Transactions**: Complete transaction listing with statuses and details
- **Sales**: Sales management and visualization
- **Reconciliations**: Creation and tracking of reconciliation processes
- **Reconciliation Rules**: Rule configuration for process automation

## Tech Stack

- **Frontend**: React 19 + Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Framework**: Bootstrap 5
- **Charts**: React Chartkick + Chart.js
- **HTTP Client**: Axios
- **Alerts**: SweetAlert2

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/anderCM/Tod-spa.git
cd vite-project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables (if needed):
```bash
cp .env.example .env
```

## Development

To run the project in development mode:

```bash
npm run dev
# or
yarn dev
```

The development server will be available at `http://localhost:5173`

## Build

To build the project for production:

```bash
npm run build
# or
yarn build
```

The compiled files will be generated in the `dist/` directory

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build application for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter to check code

## API Endpoints

The system connects to the following endpoints:

- `POST /login` - User authentication
- `GET /transactions` - Get transactions
- `GET /sales` - Get sales
- `GET /wallets` - Get wallets
- `GET /reconciliations` - Get reconciliations
- `POST /reconciliations` - Create new reconciliation
- `GET /reconciliation_rules` - Get reconciliation rules

## Main Features

### Dashboard
- Key metrics visualization (transactions, sales, total)
- Pie chart showing operations distribution

### Transactions
- Paginated listing
- Status filters (completed, pending, failed)
- Transaction details

### Sales
- Sales records with unique numbers
- Status and total amounts
- Detailed information per sale

### Reconciliations
- Creation with date ranges
- Expandable view with item details
- Classification: matched, unmatched, disputed
- Success metrics and amounts

## Security

- Protected routes with authentication verification
- Secure session management
- Automatic logout on authorization errors

