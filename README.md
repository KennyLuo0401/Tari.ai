# **Tari.ai – AI-Powered DCA Portfolio Manager**

**Tari.ai** is a sophisticated DCA (Dollar-Cost Averaging) portfolio manager powered by AI, built with Next.js, TypeScript, and AgentKit. It combines document parsing, multi-agent AI logic, and Rootstock smart contract execution to provide real-time portfolio tracking, automated DCA, and AI-assisted investment insights.

## **🔍 How It Works**

Below is a simple illustration of how Tari.ai processes financial news and executes investments in four main steps:

**Document Understanding (Upstage)** Users upload financial reports, market news, or PDF documents. The Upstage API parses them, extracting key details, DCA instructions, and sentiment.

**Multi-Agent Discussion (Gensyn RL Swarm)** Multiple AI agents (simulated with OpenAI APIs) critique each other’s proposals and converge on a consensus for how to adjust the DCA strategy.

**Smart Contract Execution (Rootstock)** Once consensus is reached, Tari.ai calls a DCA smart contract on Rootstock. The contract executes or modifies an on-chain investment according to AI recommendations.

**On-chain Record & Frontend Interface** The transaction is recorded on Rootstock, and the Next.js dashboard updates the DCA record in real time—ensuring transparent, verifiable investment actions powered by AI.

## **💡 Why It Matters**

- Simplifies crypto investing through plain-language interaction.

- Uses multi-agent reasoning for more balanced decisions.

- Bridges AI insight directly into decentralized finance.

## **⚙️ Tech Stack**
**Frontend**
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- AgentKit
- Viem
- Upstage Document Parser API

**Backend**
- Node.js
- Express 
- Sushi SDK 
- Viem
- TypeScript

## **Getting Started**
**Prerequisites**
- Node.js 18+
- Yarn or npm 
- A Rootstock RPC URL
- A wallet private key for DCA execution
- Upstage API key

**Installation**
  
**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/tari-ai.git
cd tari-ai
```

**2. Install dependencies (frontend & backend):**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```
**3. Create environment files:**

**- Frontend (.env):**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
UPSTAGE_API_KEY=your_upstage_api_key
```
**- Backend (.env):**
```bash
PRIVATE_KEY=your_private_key
RPC_URL=your_rootstock_rpc_url
PORT=5001
AMOUNT_ETH=0.01
SLIPPAGE=0.005
```
**4.Start the development servers:**
```bash
# Frontend (in root directory)
npm run dev

# Backend (in backend directory)
npm run dev
```
## **Usage**

**Setting Up DCA**
1. Go to the DCA Records tab.
2. Configure DCA parameters (asset, amount, frequency).
3. Click Start to begin.

**Using the AI Assistant**

**Ask the AI for:**
- Market analysis
- DCA optimization
- Transaction history
- General insights
  
**Document Processing**
- Upload documents (PDF, images, etc.) containing DCA instructions
- Upstage automatically extracts commands and sentiment

## **API Endpoints**

**DCA Management**

- POST ```/dca/start```
- Body: ```{ interval: number }```

- POST ```/dca/stop```
- GET ```/dca/status```
```bash
{
  "isRunning": boolean,
  "history": [
    {
      "time": string,
      "status": string,
      "txHash"?: string,
      "error"?: string
    }
  ]
}
```

## **Contributing**
1. Fork the repo
2. Create a branch (```git checkout -b feature/AmazingFeature```)
3. Commit changes (```git commit -m 'Add AmazingFeature'```)
4. Push (```git push origin feature/AmazingFeature```)
5. Open a Pull Request

## **License**
Licensed under the MIT License. See LICENSE for details.

## **Acknowledgments**
- Built with AgentKit
- Powered by Sushi SDK
- Inspired by shadcn/ui
- Document processing by Upstage AI

## **Further Details**

**Demo:** https://youtu.be/5nfZQNRJMfE

**GitHub:** https://github.com/KennyLuo0401/Tari.ai
