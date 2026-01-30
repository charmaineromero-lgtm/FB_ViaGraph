export interface Location {
  id: string;
  name: string;
}

export interface JeepneyRoute {
  name: string;
  description: string;
}

export interface Edge {
  source: string; // location id
  target: string; // location id
  weight: number; // distance in km
  routeName: string; // jeepney route name
}

export interface Graph {
  nodes: Location[];
  edges: Edge[];
  routes: JeepneyRoute[];
}

export interface PathSegment {
  from: string;
  to: string;
  routeName: string;
  distance: number;
  regularFare?: number;
  discountedFare?: number;
}

export interface ShortestPathResult {
  path: PathSegment[];
  totalDistance: number;
  totalFare?: number;
  discountedFare?: number;
}
