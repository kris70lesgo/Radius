# ForgeOS Node Studio — AI-Powered SaaS Factory on Zerops

![WeMakeDevs Zerops Challenge](https://img.shields.io/badge/WeMakeDevs-Zerops%20Challenge-6C47FF?style=for-the-badge)
![Solo Submission](https://img.shields.io/badge/Submission-Solo-111827?style=for-the-badge)

ForgeOS Node Studio turns a raw SaaS concept into a reviewed product plan, technical architecture, generated application scaffold, GitHub repository, and Zerops-ready deployment package. It combines a sequential multi-agent pipeline with human review, keeping every important product and engineering decision visible and editable.

## What It Does

1. A user enters a raw SaaS concept.
2. Four specialized AI agents process it sequentially: **Strategist → Business Analyst → Tech Lead → Shipyard**.
3. Every agent returns structured JSON that can be reviewed through a human-in-the-loop React Flow interface before the pipeline continues.
4. Shipyard clones a golden boilerplate, injects the generated Prisma schema and API routes, and pushes the finished scaffold to GitHub.
5. The generated repository includes a `zerops.yaml` configuration for straightforward deployment to Zerops.
6. Users can export handoff documents for **Claude Code**, **Cursor**, or plain Markdown to continue development in their preferred workflow.

## Pipeline Flow

```text
Concept Input
    ↓
Strategist (market analysis)
    ↓
Business Analyst (requirements)
    ↓
Tech Lead (architecture + Prisma schema)
    ↓
Shipyard (GitHub repository + Zerops-ready package)
```

| Stage | Responsibility |
| --- | --- |
| Concept Input | Captures the initial SaaS idea and context |
| Strategist | Defines the market, audience, positioning, MVP, monetization, and risks |
| Business Analyst | Produces personas, user stories, requirements, entities, and integrations |
| Tech Lead | Designs the architecture, Prisma schema, API routes, stack, and environment requirements |
| Shipyard | Generates the application scaffold, pushes it to GitHub, and packages it for Zerops |

## How ForgeOS Uses Zerops

Zerops is both the runtime for ForgeOS and the default deployment target for the applications it creates.

- **ForgeOS runs on Zerops:** the API uses `nodejs@22`, the Vite frontend uses static hosting, and state is provided by managed PostgreSQL and Valkey services.
- **Generated apps target Zerops:** Shipyard includes a generated `zerops.yaml` in every application package.
- **Infrastructure as Code:** `zerops-import.yaml` defines the complete ForgeOS service topology for repeatable project creation.
- **Private networking:** the API communicates with PostgreSQL and Valkey over Zerops service networking rather than exposing data services publicly.
- **GitHub integration:** the API and web services build and deploy automatically when changes are pushed to the connected repository.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Vite, React 18, TypeScript, `@xyflow/react` v12, Zustand, TanStack Query |
| Backend | Express, TypeScript, Prisma, BullMQ, IORedis |
| AI | NVIDIA NIM with DeepSeek V4 Pro through an OpenAI-compatible API |
| Infrastructure | Zerops, PostgreSQL, Valkey, Node.js 22 runtime, static hosting |

## Demo Mode

Add `?demo=true` to the application URL to run the complete experience with cached fixtures. Demo mode makes no external AI calls and requires no AI credentials, making the judging flow deterministic and reliable.

```text
http://localhost:5173?demo=true
```

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- Docker and Docker Compose

```bash
docker-compose up -d      # PostgreSQL + Redis
pnpm install
pnpm db:migrate
pnpm dev                  # API on :3001, Web on :5173
```

Visit [http://localhost:5173?demo=true](http://localhost:5173?demo=true) to use demo mode without external APIs.

For live inference and GitHub generation, copy `.env.example` to `.env` and configure the required credentials.

## Deploy to Zerops

1. Fork this repository or push it to your own GitHub repository.
2. Import `zerops-import.yaml` through the Zerops Dashboard or with the zCLI:

   ```bash
   zcli import zerops-import.yaml
   ```

3. Set secrets in the Zerops GUI, including `AI_API_KEY`, `GITHUB_TOKEN`, and the golden-boilerplate repository settings. Never commit these values.
4. Connect the GitHub repository to the `api` and `web` services, selecting the matching setup from `zerops.yaml` for each service.
5. Push to GitHub. Zerops builds and deploys both services automatically.

The imported project contains:

| Service | Zerops runtime | Purpose |
| --- | --- | --- |
| `api` | `nodejs@22` | Express API, Prisma, SSE, and BullMQ worker |
| `web` | Static | Production Vite frontend |
| `db` | PostgreSQL 16 | Application data |
| `cache` | Valkey 7.2 | BullMQ queues, cache, and pub/sub |

At runtime, `zerops.yaml` connects the API to managed services through Zerops-provided private connection strings:

```yaml
DATABASE_URL: ${db_connectionString}
REDIS_URL: ${cache_connectionString}
```

## Project Structure

```text
apps/api/             Express backend + BullMQ worker
apps/web/             Vite + React frontend
packages/shared/      Shared types, schemas, and SSE events
prisma/               Database schema and migrations
zerops.yaml           Zerops build and run configuration
zerops-import.yaml    Zerops Infrastructure as Code manifest
```

## Environment Variables

The full development template is available in `.env.example`. The main production secrets and settings are:

```env
AI_API_KEY=
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_MODEL=deepseek-ai/deepseek-v4-pro
GITHUB_TOKEN=
GITHUB_ORG=
GOLDEN_BOILERPLATE_REPO=
GOLDEN_BOILERPLATE_SHA=
```

## Verification

```bash
pnpm build
pnpm typecheck
pnpm ai:test    # Requires live AI credentials
```

## AI Tools Used

- **Claude Code (Amp):** development, implementation, and iteration
- **NVIDIA NIM / DeepSeek V4 Pro:** inference for the ForgeOS agent pipeline

## Hackathon Submission

Built as a **solo submission** for the **WeMakeDevs Zerops Challenge**.
