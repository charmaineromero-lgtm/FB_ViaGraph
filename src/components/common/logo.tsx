import { Waypoints } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Waypoints className="h-6 w-6 text-accent" />
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        ViaGraph
      </h1>
    </div>
  );
}
