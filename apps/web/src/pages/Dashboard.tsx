import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Rocket, Trash2, ArrowRight, Folder } from "lucide-react";
import { NodeStatus, Project, ProjectStatus } from "@radius/shared";
import { toast } from "sonner";
import { SettingsModal } from "../components/modals/SettingsModal";
import { ConceptWizard } from "../components/modals/ConceptWizard";
import { Sidebar } from "../components/Sidebar";
import { ProjectCard } from "../components/ui/project-card";
import { ProjectFileIcon } from "../components/ui/custom-icons";
import { Button } from "../components/ui/base/buttons/button";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const DEMO_AGENCY_ID = "demo-agency-cuid";

function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{
        backgroundColor: "#111114",
        border: "1px solid #222228",
        borderRadius: "14px",
        padding: "18px",
        height: "170px",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-[10px] bg-[#1A1A1E]" />
        <div className="h-5 w-16 rounded-full bg-[#1A1A1E]" />
      </div>
      <div className="h-5 w-3/4 bg-[#1A1A1E] rounded mb-3" />
      <div className="h-4 w-1/2 bg-[#1A1A1E] rounded" />
    </div>
  );
}

const NODE_LABELS = ["Concept", "Strategist", "Analyst", "Tech Lead", "Shipyard"];

export function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const queryClient = useQueryClient();

  const [agencyId, setAgencyId] = useState<string | null>(null);

  // Fetch session to determine agency ID
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`${API_BASE}/api/session`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch session");
        const data = await res.json();

        if (data.mode === "github" && data.githubUser) {
          // GitHub user — unique agency per GitHub account, starts empty
          setAgencyId(`github-${data.githubUser.id}`);
        } else {
          // Demo or no session — use shared demo agency
          setAgencyId(DEMO_AGENCY_ID);
        }
      } catch {
        // Fallback to demo agency
        setAgencyId(DEMO_AGENCY_ID);
      }
    }
    fetchSession();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", agencyId],
    queryFn: () => api.listProjects(agencyId!, 1),
    enabled: !!agencyId,
    staleTime: 30_000,
    refetchInterval: 5000,
  });

  const handleProjectSubmit = async (concept: string) => {
    try {
      const { projectId } = await api.createProject({ concept, agencyId: agencyId! });
      navigate(`/studio/${projectId}`);
    } catch (err: unknown) {
      toast.error("Failed to create project", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
      throw err;
    }
  };

  const getLatestByNode = (p: Project) => {
    const outputs = p.agentOutputs ?? [];
    const latestByNode = new Map<number, (typeof outputs)[number]>();
    for (const output of outputs) {
      const prev = latestByNode.get(output.nodeId);
      if (!prev || output.version > prev.version) {
        latestByNode.set(output.nodeId, output);
      }
    }
    return latestByNode;
  };

  const getEffectiveStatus = (p: Project): ProjectStatus => {
    const latestByNode = getLatestByNode(p);
    const latestStatuses = Array.from(latestByNode.values()).map((o) => o.status);

    if (latestStatuses.includes(NodeStatus.FAILED)) {
      return ProjectStatus.FAILED;
    }

    const shipyardStatus = latestByNode.get(4)?.status;
    const isDeploymentComplete =
      shipyardStatus === NodeStatus.APPROVED ||
      p.deployment?.buildStatus === "ACTIVE" ||
      !!p.deployment?.stepDDone ||
      p.status === ProjectStatus.COMPLETED;
    if (isDeploymentComplete) {
      return ProjectStatus.COMPLETED;
    }

    if (latestStatuses.includes(NodeStatus.REVIEW)) {
      return ProjectStatus.AWAITING_REVIEW;
    }

    if (
      latestStatuses.some((s) =>
        [NodeStatus.QUEUED, NodeStatus.PROCESSING, NodeStatus.REGENERATING].includes(s),
      )
    ) {
      return ProjectStatus.RUNNING;
    }

    return p.status;
  };

  const getDisplayNode = (p: Project): number => {
    const latestByNode = getLatestByNode(p);

    const failedNode = Array.from(latestByNode.values())
      .filter((o) => o.status === NodeStatus.FAILED)
      .sort((a, b) => b.version - a.version)[0];
    if (failedNode) return failedNode.nodeId;

    const reviewNode = Array.from(latestByNode.values()).find(
      (o) => o.status === NodeStatus.REVIEW,
    );
    if (reviewNode) return reviewNode.nodeId;

    const activeNode = Array.from(latestByNode.values()).find((o) =>
      [NodeStatus.QUEUED, NodeStatus.PROCESSING, NodeStatus.REGENERATING].includes(o.status),
    );
    if (activeNode) return activeNode.nodeId;

    if (
      latestByNode.get(4)?.status === NodeStatus.APPROVED ||
      p.deployment?.buildStatus === "ACTIVE" ||
      p.deployment?.stepDDone
    ) {
      return 4;
    }

    return p.currentNode;
  };

  const getStatusInfo = (p: Project) => {
    const status = getEffectiveStatus(p);
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completed",
          className: "px-2.5 py-1 rounded-full text-[11px] font-medium",
          style: { backgroundColor: "rgba(34,197,94,0.08)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.12)" },
        };
      case "AWAITING_REVIEW":
        return {
          label: "In Review",
          className: "px-2.5 py-1 rounded-full text-[11px] font-medium",
          style: { backgroundColor: "rgba(124,58,237,0.08)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.12)" },
        };
      case "RUNNING":
        return {
          label: "In Progress",
          className: "px-2.5 py-1 rounded-full text-[11px] font-medium",
          style: { backgroundColor: "rgba(59,130,246,0.08)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.12)" },
        };
      case "FAILED":
        return {
          label: "Failed",
          className: "px-2.5 py-1 rounded-full text-[11px] font-medium",
          style: { backgroundColor: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.12)" },
        };
      default:
        return {
          label: "Draft",
          className: "px-2.5 py-1 rounded-full text-[11px] font-medium",
          style: { backgroundColor: "rgba(255,255,255,0.04)", color: "#71717A", border: "1px solid rgba(255,255,255,0.06)" },
        };
    }
  };

  const formatDate = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `Created ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen w-full font-sans" style={{ backgroundColor: "#09090B" }}>
      {/* Subtle radial vignette */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99,102,241,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex gap-4 p-4">
        <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />

        {/* Main content */}
        <div
          className="flex-1 flex flex-col"
          style={{
            padding: "48px",
            minHeight: "calc(100vh - 32px)",
          }}
        >
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h1
                className="text-white font-semibold mb-2"
                style={{ fontSize: "32px", fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                Projects
              </h1>
              <p className="text-[#71717A] text-sm" style={{ fontWeight: 400 }}>
                Build and deploy SaaS products with AI agents
              </p>
            </div>

            <Button
              size="md"
              color="primary"
              iconLeading={<Plus data-icon size={16} />}
              onClick={() => setIsModalOpen(true)}
              className="h-12 rounded-[14px] px-4 before:hidden"
            >
              New Project
            </Button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : data?.projects.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-4 text-center"
              style={{
                border: "1px dashed #27272A",
                borderRadius: "20px",
                padding: "64px 32px",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  backgroundColor: "#111114",
                  border: "1px solid #222228",
                }}
              >
                <Rocket size={24} className="text-[#52525B]" />
              </div>
              <div>
                <p className="text-[#FAFAFA] font-medium text-base mb-1">No projects yet</p>
                <p className="text-[#71717A] text-sm">
                  Describe a SaaS idea and let our AI agents build it for you.
                </p>
              </div>
              <Button
                size="md"
                color="primary"
                iconLeading={<Plus data-icon size={16} />}
                onClick={() => setIsModalOpen(true)}
                className="h-12 rounded-[14px] px-4 mt-2 before:hidden"
              >
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
              {data?.projects.map((project) => {
                const statusInfo = getStatusInfo(project);
                const displayNode = getDisplayNode(project);
                return (
                  <ProjectCard
                    key={project.id}
                    title={project.concept}
                    description={formatDate(new Date(project.createdAt))}
                    icon={<ProjectFileIcon width={28} height={28} />}
                    statusBadge={
                      <span className={statusInfo.className} style={statusInfo.style}>
                        {statusInfo.label}
                      </span>
                    }
                    onClick={() => navigate(`/studio/${project.id}`)}
                  >
                    {/* Footer left: node info */}
                    <div className="flex items-center gap-1.5 text-xs text-[#52525B]">
                      <Folder size={13} strokeWidth={1.8} />
                      <span>Node {displayNode} · {NODE_LABELS[displayNode] ?? "—"}</span>
                    </div>

                    {/* Footer right: actions */}
                    <div className="flex items-center gap-3">
                      <button
                        className="flex items-center gap-1 text-xs font-medium text-[#71717A] hover:text-[#FAFAFA] transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/studio/${project.id}`);
                        }}
                      >
                        Open
                        <ArrowRight size={12} />
                      </button>
                      <button
                        className="p-1 rounded text-[#52525B] hover:text-[#F87171] transition-colors duration-200"
                        title="Delete project"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm(`Delete "${project.concept}"?`)) return;
                          try {
                            await api.deleteProject(project.id);
                            queryClient.invalidateQueries({ queryKey: ["projects"] });
                            toast.success("Project deleted");
                          } catch (err: unknown) {
                            toast.error("Failed to delete", {
                              description: err instanceof Error ? err.message : "Unknown error",
                            });
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </ProjectCard>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ConceptWizard
          agencyId={agencyId!}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleProjectSubmit}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          agencyId={agencyId!}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
