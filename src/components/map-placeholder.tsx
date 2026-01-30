import { Map, MapPin, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from './ui/separator';

export function MapPlaceholder({ start, end }: { start?: string, end?: string }) {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Route Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full min-h-[400px] flex-col items-center justify-center bg-muted/50 p-6 md:min-h-[600px]">
        {start && end ? (
          <div className="w-full max-w-md text-center">
             <div className="flex items-center gap-4 text-left">
                <MapPin className="h-8 w-8 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">Starting From</p>
                    <p className="text-lg font-semibold">{start}</p>
                </div>
             </div>
             <div className="my-4 ml-4 h-16 border-l-2 border-dashed border-border" />
             <div className="flex items-center gap-4 text-left">
                <Flag className="h-8 w-8 text-destructive" />
                 <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="text-lg font-semibold">{end}</p>
                </div>
             </div>
             <Separator className="my-8" />
             <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                <Map className="h-10 w-10" />
                <p className="text-sm">A full map visualization is coming soon.</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
            <Map className="h-16 w-16" />
            <p className="text-lg font-medium">Route Visualization</p>
            <p className="text-sm">The calculated route will be displayed here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
