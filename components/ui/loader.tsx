import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center h-full", className)}>
      <div className="flex space-x-2">
        <div className="h-3 w-3 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="h-3 w-3 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}