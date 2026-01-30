import { Share2 } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Share2 className="h-6 w-6 text-accent" />
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Iligan RouteFinder
      </h1>
    </div>
  );
}
