import { useNavigate, useLocation } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import { Logo } from "./ui/logo";
import { cn } from "../lib/utils";

interface SidebarProps {
  onSettingsClick?: () => void;
}

export function Sidebar({ onSettingsClick }: SidebarProps) {
  void onSettingsClick;
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === "/dashboard";

  return (
    <aside
      className="flex shrink-0 flex-col"
      style={{
        width: "260px",
        padding: "32px 24px",
        backgroundColor: "#0E0E11",
        borderRadius: "20px",
        border: "1px solid #1E1E22",
        height: "calc(100vh - 32px)",
        position: "sticky",
        top: "16px",
      }}
    >
      {/* Logo + wordmark */}
      <div className="mb-10 flex items-center gap-3 px-1">
        <Logo className="h-8 w-auto" />
        <span className="text-lg font-semibold tracking-tight text-white select-none">
          Radius
        </span>
      </div>

      {/* Navigation — only Projects */}
      <nav className="flex flex-col gap-1">
        <button
          onClick={() => navigate("/dashboard")}
          className={cn(
            "group relative flex items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 ease-out",
            isActive
              ? "bg-[#16161A] border border-[#27272A] text-[#FAFAFA]"
              : "border border-transparent text-[#71717A] hover:bg-[#131316] hover:text-[#A1A1AA]",
          )}
          style={{ height: "44px" }}
        >
          {isActive && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full bg-[#7C3AED]"
              style={{ width: "3px", height: "20px" }}
            />
          )}
          <span
            className={cn(
              "transition-colors",
              isActive ? "text-[#A1A1AA]" : "text-[#52525B] group-hover:text-[#71717A]",
            )}
          >
            <FolderOpen size={18} strokeWidth={1.8} />
          </span>
          Projects
        </button>
      </nav>
    </aside>
  );
}
