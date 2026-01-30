'use client';

import { useFormState, useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { findRouteAction } from '@/lib/actions';
import { graph } from '@/lib/data';
import { MapPlaceholder } from '@/components/map-placeholder';
import { ArrowRight, Bus, Footprints, Hourglass, Route } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  startLocation: z.string().min(1, 'Please select a starting location.'),
  endLocation: z.string().min(1, 'Please select a destination.'),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Hourglass className="mr-2 h-4 w-4 animate-spin" />
          Calculating...
        </>
      ) : (
        <>
          <Route className="mr-2 h-4 w-4" />
          Find Shortest Route
        </>
      )}
    </Button>
  );
}

export default function FindRoutePage() {
  const [state, formAction] = useFormState(findRouteAction, { message: '' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: '',
      endLocation: '',
    },
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Plan Your Trip</CardTitle>
            <CardDescription>
              Enter your location and destination to find the shortest jeepney
              route.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form action={formAction}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="startLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        name="startLocation"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your starting point" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {graph.nodes.map(node => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        name="endLocation"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {graph.nodes.map(node => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <SubmitButton />
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        {state.message && state.error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}

        {state.result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Route</CardTitle>
              <CardDescription>
                Follow these steps to reach your destination.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Total Distance</span>
                    <span className="font-bold text-foreground">{state.result.totalDistance.toFixed(2)} km</span>
                </div>
              <Separator className="mb-4" />
              <div className="space-y-4">
                {state.result.path.map((segment, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Bus className="h-4 w-4" />
                      </div>
                      {index < state.result.path.length - 1 && (
                        <div className="h-16 w-px bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-semibold">
                        Take Jeepney <span className="text-accent">{segment.routeName}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        From <span className="font-medium text-foreground">{segment.from}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        To <span className="font-medium text-foreground">{segment.to}</span>
                      </p>
                       <p className="text-xs text-muted-foreground/80 mt-1">({segment.distance.toFixed(2)} km)</p>
                    </div>
                  </div>
                ))}
                 <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Footprints className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pt-1.5">
                        <p className="font-semibold">Arrive at Destination</p>
                        <p className="text-sm text-muted-foreground">{state.result.path[state.result.path.length - 1].to}</p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-2">
        <MapPlaceholder />
      </div>
    </div>
  );
}
