import { ProjectMode, ProjectStatus, NodeStatus, DeploymentStatus } from './enums'

export interface AgencySettings {
  // GitHub
  githubToken?: string
  githubOrg?: string
  goldenBoilerplateRepo?: string
  goldenBoilerplateSha?: string
  // Object Storage (S3-compatible, works with Zerops Object Storage)
  storageAccessKeyId?: string
  storageSecretAccessKey?: string
  storageRegion?: string
  storageBucket?: string
  storageEndpoint?: string
}

export interface Agency {
  id: string
  name: string
  settings: AgencySettings
  createdAt: string
  updatedAt: string
}

export interface Deployment {
  id: string
  projectId: string
  buildStatus: DeploymentStatus
  githubRepoUrl: string | null
  zeropsServiceId: string | null
  zeropsAppUrl: string | null
  zipPath: string | null
  stepADone: boolean
  stepBDone: boolean
  stepCDone: boolean
  stepDDone: boolean
  // Computed client-side from zipPath or SSE
  zipReady?: boolean
  createdAt: string
  updatedAt: string
}

export interface AgentOutput {
  id: string
  projectId: string
  nodeId: number
  version: number
  status: NodeStatus
  jsonPayload: unknown | null
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  agencyId: string
  mode: ProjectMode
  concept: string
  status: ProjectStatus
  currentNode: number
  updatedAt: string
  agentOutputs?: AgentOutput[]
  deployment?: Deployment | null
  createdAt: string
}

export interface PipelineNodeState {
  id: number
  label: string
  status: NodeStatus
  payload: Record<string, unknown> | null
  version: number
  regenerationCount: number
  confidence?: number
  error?: string
}
