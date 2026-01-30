import { Map } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function MapPlaceholder() {
  return (
    <Card className="h-full w-full">
      <CardContent className="flex h-full min-h-[400px] items-center justify-center bg-muted/50 p-6 md:min-h-[600px]">
        <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
          <Map className="h-16 w-16" />
          <p className="text-lg font-medium">Route Visualization</p>
          <p className="text-sm">The calculated route will be displayed here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
