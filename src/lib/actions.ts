'use server';

import { z } from 'zod';
import { graph } from '@/lib/data';
import { findShortestPath as dijkstra } from '@/lib/dijkstra';
import type { ShortestPathResult, PathSegment } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { calculateFare, calculateDiscountedFare } from './fare';

const FindRouteSchema = z.object({
  startLocation: z.string().min(1, 'Please select a starting location.'),
  endLocation: z.string().min(1, 'Please select a destination.'),
});

export type FormState = {
  message: string;
  result?: ShortestPathResult;
  error?: boolean;
};

export async function findRouteAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FindRouteSchema.safeParse({
    startLocation: formData.get('startLocation'),
    endLocation: formData.get('endLocation'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.startLocation?.[0] || validatedFields.error.flatten().fieldErrors.endLocation?.[0] || 'Invalid input.',
      error: true,
    };
  }

  const { startLocation, endLocation } = validatedFields.data;

  if (startLocation === endLocation) {
      return { message: 'Start and end locations cannot be the same.', error: true };
  }

  try {
    const result = dijkstra(graph.nodes, graph.edges, startLocation, endLocation);

    if (!result || result.path.length === 0) {
      return { message: 'No route found between the selected locations.', error: true };
    }

    // Group consecutive path segments that use the same jeepney route
    const groupedPath: PathSegment[] = [];
    if (result.path.length > 0) {
      let currentSegment: PathSegment = { ...result.path[0] };

      for (let i = 1; i < result.path.length; i++) {
        const nextSegment = result.path[i];
        if (nextSegment.routeName === currentSegment.routeName && nextSegment.from === currentSegment.to) {
          // If the next segment continues on the same route, extend the current segment
          currentSegment.to = nextSegment.to;
          currentSegment.distance += nextSegment.distance;
        } else {
          // If the route changes, it's a transfer. Push the completed segment and start a new one.
          groupedPath.push(currentSegment);
          currentSegment = { ...nextSegment };
        }
      }
      groupedPath.push(currentSegment); // Push the last segment of the journey
    }

    // Add fare info to each segment
    const pathWithFares = groupedPath.map(segment => ({
      ...segment,
      regularFare: calculateFare(segment.distance),
      discountedFare: calculateDiscountedFare(segment.distance),
    }));

    // Calculate total fare by summing up the fares of each segment
    const totalFare = pathWithFares.reduce((total, segment) => total + (segment.regularFare || 0), 0);
    const discountedFare = pathWithFares.reduce((total, segment) => total + (segment.discountedFare || 0), 0);

    return {
      message: 'Shortest route found successfully.',
      result: {
        ...result,
        path: pathWithFares, // Use the new, grouped path with fares
        totalFare,
        discountedFare,
      },
    };
  } catch (error) {
    return { message: 'An error occurred while calculating the route.', error: true };
  }
}

// Admin Actions (Placeholders)
export async function addLocationAction(formData: FormData) {
    console.log('Add Location:', { id: formData.get('id'), name: formData.get('name') });
    revalidatePath('/admin');
    return { message: 'Location added successfully.' };
}

export async function addRouteAction(formData: FormData) {
    console.log('Add Route:', { 
        source: formData.get('source'),
        target: formData.get('target'),
        weight: formData.get('weight'),
        routeName: formData.get('routeName')
    });
    revalidatePath('/admin');
    return { message: 'Route added successfully.' };
}

export async function deleteItemAction(type: 'location' | 'route', id: string) {
    console.log(`Delete ${type} with id: ${id}`);
    revalidatePath('/admin');
    return { message: `${type} deleted successfully.` };
}
