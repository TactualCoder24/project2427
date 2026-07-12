# VIDVAS AI - Intelligent Workflow Automation Platform

Transform your business with **VIDVAS AI** (विद्वस् — Sanskrit for "Intelligence"), a powerful no-code/low-code automation platform that combines AI agents with workflow automation, similar to n8n but powered by intelligent AI agents.

## Features

### 🤖 AI Agents
Deploy specialized AI agents for various automation tasks:
- **RAG Pipeline & Chatbot** - Document retrieval and intelligent conversation
- **Product Videos Generator** - AI-powered video creation for marketing
- **RAG Workflow Agent** - Intelligent document processing and knowledge extraction
- **Technical Analyst Agent** - Market data, code review, and performance analytics
- And many more specialized agents

### 🔄 Workflow Builder
Create powerful automation workflows with n8n-like functionality:
- **Drag-and-drop workflow editor** - Build complex automations visually
- **Multiple trigger types** - Manual, scheduled, webhook, and event-based triggers
- **Execution dashboard** - Monitor workflow runs and performance
- **Workflow versioning** - Track changes and manage workflow history

### 🔗 Integration Hub
Connect with popular platforms:
- **Communication**: Gmail, Slack
- **Development**: GitHub
- **Productivity**: Notion, Google Calendar
- **And more** coming soon

### 📊 Execution Monitoring
- Real-time execution tracking
- Performance metrics and analytics
- Error handling and retry logic
- Detailed execution history

### 👤 Persona Management
- Create and manage AI personas
- Customize agent behavior
- Save custom configurations

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **APIs**: Google OAuth, REST integrations
- **Build Tool**: React Scripts / Webpack

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Google OAuth credentials (for authentication)
- Supabase project (for backend)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_key
```

### Development

```bash
npm start
```

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page reloads on changes. Console will show lint errors.

### Build

```bash
npm run build
```

Builds the app for production to the `build` folder. The build is optimized and minified for deployment.

### Testing

```bash
npm test
```

Launches the test runner in interactive watch mode.

## Project Structure

```
src/
├── pages/              # Route pages (Home, Dashboard, WorkflowBuilder, etc.)
├── components/         # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
└── App.tsx             # Main app component
```

## Key Pages

- `/` - Home/landing page
- `/agents` - Browse available AI agents
- `/workflows` - Workflow builder interface
- `/executions` - Monitor workflow executions
- `/integrations` - Connect external services
- `/personas` - Manage AI personas
- `/playground` - AI playground for testing
- `/dashboard` - User dashboard
- `/docs` - Documentation
- `/contact` - Contact us

## Authentication

VIDVAS AI uses Google OAuth for authentication. Users can sign in with their Google account and authorize integrations with connected services.

## Contributing

Coming soon.

## License

Coming soon.
