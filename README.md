# Tari.ai - AI-Powered DCA Portfolio Manager

Tari.ai is a sophisticated DCA (Dollar-Cost Averaging) portfolio manager powered by AI, built with Next.js, TypeScript, and AgentKit. It provides real-time portfolio tracking, automated DCA execution, and AI-assisted investment insights.

## Features

- 🤖 **AI-Powered Assistant**: Intelligent chat interface for portfolio management and market analysis
- 📊 **DCA Timeline**: Real-time tracking of your DCA transactions and schedules
- 🔄 **Automated Execution**: Reliable automated DCA transactions on Rootstock
- 💫 **Beautiful UI**: Modern, responsive interface with smooth animations
- 🔒 **Secure**: Built with security-first practices for DeFi operations
- 📄 **Document Processing**: Integrated Upstage document parsing for automated command extraction from documents

## Custom ERC20 Token

ERC20 Token - 0x87fA90cD9eb770618F78B77fae5bB3d2d889ED63
## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- AgentKit
- Viem
- Upstage Document Parser API

### Backend
- Node.js
- Express
- Sushi SDK
- Viem
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- A Rootstock RPC URL
- A wallet private key for DCA execution
- Upstage API key for document processing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tari-ai.git
cd tari-ai
```

2. Install dependencies for both frontend and backend:
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. Create environment files:

Frontend (.env):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
UPSTAGE_API_KEY=your_upstage_api_key
```

Backend (.env):
```env
PRIVATE_KEY=your_private_key
RPC_URL=your_rootstock_rpc_url
PORT=5001
AMOUNT_ETH=0.01
SLIPPAGE=0.005
```

4. Start the development servers:

```bash
# Frontend (in root directory)
npm run dev

# Backend (in backend directory)
npm run dev
```

## Usage

### Setting Up DCA

1. Navigate to the DCA Records tab
2. Configure your DCA parameters:
   - Asset selection
   - Investment amount
   - Frequency
3. Start the DCA strategy

### Using the AI Assistant

The AI assistant can help you with:
- Analyzing market conditions
- Optimizing DCA strategies
- Understanding transaction history
- Getting market insights

Simply type your questions in the chat interface.

### Document Processing

The application supports document parsing through Upstage API integration:

- Upload documents containing DCA instructions
- Supports various formats (PDF, Images)
- Automatically extracts and processes commands
- Handles numbered (1., 2.), lettered (a., b.), and Roman numeral (I., II.) formats
- Real-time progress tracking of document processing

## API Endpoints

### DCA Management

```typescript
POST /dca/start
Body: { interval: number }

POST /dca/stop

GET /dca/status
Response: {
  isRunning: boolean,
  history: Array<{
    time: string,
    status: string,
    txHash?: string,
    error?: string
  }>
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [AgentKit](https://github.com/coinbase/agentkit)
- Powered by [Sushi SDK](https://github.com/sushiswap/sushi-sdk)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Document processing powered by [Upstage AI](https://upstage.ai)