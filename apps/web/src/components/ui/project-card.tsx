import React from "react";
import { Folder } from "lucide-react";

export interface ProjectCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  statusBadge?: React.ReactNode;
  meta?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  icon,
  statusBadge,
  meta,
  onClick,
  className,
  children,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col h-full cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 ${className ?? ""}`}
      style={{
        backgroundColor: "#111114",
        border: "1px solid #222228",
        borderRadius: "14px",
        padding: "18px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#2A2A30";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#222228";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)";
      }}
    >
      {/* Header: icon + status */}
      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        {icon && (
          <div className="flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}

        {/* Status badge */}
        {statusBadge && <div className="shrink-0">{statusBadge}</div>}
      </div>

      {/* Title */}
      <h3
        className="text-white font-medium leading-snug mb-1.5"
        style={{
          fontSize: "15px",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className="text-[#71717A] text-xs leading-relaxed"
          style={{ fontWeight: 400 }}
        >
          {description}
        </p>
      )}

      {/* Meta */}
      {meta && <div className="mb-auto">{meta}</div>}

      {/* Divider */}
      <div
        className="my-2.5"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between">
        {children ? (
          children
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-[#52525B]">
            <Folder size={13} strokeWidth={1.8} />
            <span>Node 4 · Shipyard</span>
          </div>
        )}
      </div>
    </div>
  );
};
