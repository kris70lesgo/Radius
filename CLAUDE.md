# ForgeOS Node Studio

## What This Is

Multi-agent SaaS incubation platform for the WeMakeDevs Zerops Challenge.
Input: raw SaaS concept → Output: deployed boilerplate on Zerops via GitHub.

## Stack

- Frontend: Vite + React 18 + TypeScript + @xyflow/react v12 + Zustand + TanStack Query v5
- Backend: Express + TypeScript + Prisma + BullMQ + IORedis
- DB: PostgreSQL (Zerops Managed PostgreSQL in prod, docker-compose locally)
- Queue: Redis + BullMQ (queue name: 'agentPipeline') (Zerops Valkey in prod)
- AI: NVIDIA NIM (deepseek-ai/deepseek-v4-pro) at https://integrate.api.nvidia.com/v1
- Deploy: Zerops App Platform (via GitHub integration + zerops.yaml)

## Pipeline Nodes

- Node 0: Concept Input (user entry)
- Node 1: Strategist (market analysis → JSON)
- Node 2: Business Analyst (requirements → JSON)
- Node 3: Tech Lead (architecture + Prisma schema → JSON)
- Node 4: Shipyard (clone boilerplate → push GitHub → Zerops-ready package)

## Key Patterns

- All agents MUST output JSON only — strip markdown fences before JSON.parse()
- NodeStatus enum: LOCKED → QUEUED → PROCESSING → REVIEW → APPROVED/FAILED/REGENERATING
- SSE channel per project: `project:${id}:events` (Redis pub/sub)
- Max 5 regenerations per node (check AgentOutput version count before queuing)
- Demo mode: ?demo=true skips all external API calls

## Packages

- Shared types: packages/shared (import as @forgeos/shared)
- API: apps/api (port 3001)
- Web: apps/web (port 5173)

## Commands

- pnpm dev → starts all apps
- pnpm seed → seeds DB with demo agency
- pnpm db:migrate → runs prisma migrate dev
- pnpm db:generate → runs prisma generate
- pnpm db:studio → runs prisma studio
- docker-compose up → starts local Postgres + Redis

## Zerops Deployment

- zerops.yaml: build & run config for api (nodejs@22) and web (static) services
- zerops-import.yaml: infrastructure provisioning (api, web, db, cache)
- Connect GitHub repo to Zerops services for auto-deploy on push
- DB/Redis connection strings injected via Zerops env variable references

## See CONTEXT.md for full project context
