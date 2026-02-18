import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SYMBOLS } from "@/types/game";

interface GameTileProps {
  letter: string;
  index: number;
  status: "empty" | "target" | "selected" | "correct" | "wrong";
  isAnimating: boolean;
  animationType?: "select" | "deselect" | "correct" | "wrong" | "celebrate";
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showHint?: boolean;
}

export function GameTile({
  letter,
  index,
  status,
  isAnimating,
  animationType = "select",
  onClick,
  disabled = false,
  size = "md",
  showHint = false,
}: GameTileProps) {
  const [isPressed, setIsPressed] = useState(false);

  const tileSizes = {
    sm: "text-sm p-1.5 min-w-[1.75rem] min-h-[1.75rem]",
    md: "text-sm p-2 min-w-[2.25rem] min-h-[2.25rem]",
    lg: "text-base p-3 min-w-[3rem] min-h-[3rem]",
  };

  const getStatusStyles = () => {
    switch (status) {
      case "selected":
        // Clinical: Soft violet background with border
        return "bg-primary-100 text-primary-950 border border-primary-300";
      case "correct":
        // Clinical: Soft green background
        return "bg-success-50 text-primary-950 border border-success-400";
      case "wrong":
        // Clinical: Soft red background
        return "bg-error-50 text-primary-950 border border-error-400";
      case "target":
        // Clinical: Same as default, no visual hints
        return "bg-surface text-text-primary border border-border-standard";
      default:
        // Clinical: Clean white tile with subtle border
        return "bg-surface text-text-primary border border-border-soft hover:border-border-standard";
    }
  };

  const getAnimationClasses = () => {
    if (!isAnimating) return "";

    switch (animationType) {
      case "select":
        return "animate-tile-select";
      case "deselect":
        return "animate-tile-deselect";
      case "correct":
        return "animate-correct-clinical";
      case "wrong":
        return "animate-wrong-clinical";
      case "celebrate":
        return "animate-celebrate";
      default:
        return "";
    }
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={cn(
        "relative rounded-lg font-medium transition-all duration-150 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-1",
        tileSizes[size],
        getStatusStyles(),
        getAnimationClasses(),
        isPressed && !disabled && "scale-[0.97]",
        disabled && "cursor-not-allowed opacity-40",
        status === "selected" && "ring-2 ring-primary-300 ring-offset-1",
        showHint && status === "target" && "animate-pulse-soft",
      )}
      aria-label={`Tile ${index + 1}: ${letter || "empty"}`}
      role="gridcell"
      tabIndex={disabled ? -1 : 0}
    >
      <span
        className={cn(
          "relative z-10 select-none",
          SYMBOLS.includes(letter) && "text-lg font-bold",
        )}
      >
        {letter}
      </span>

      {/* Clinical focus glow overlay */}
      {status === "selected" && (
        <div className="absolute inset-0 rounded-lg bg-primary-400/5 animate-pulse-soft" />
      )}

      {/* Success indicator - Clinical subtle */}
      {status === "correct" && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-success-500" />
      )}

      {/* Error indicator - Clinical subtle */}
      {status === "wrong" && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error-500" />
      )}
    </button>
  );
}
