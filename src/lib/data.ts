import type { Graph } from '@/lib/types';

export const graph: Graph = {
  nodes: [
    { id: 'city-hall', name: 'Iligan City Hall' },
    { id: 'g-mall', name: 'Gaisano Mall' },
    { id: 'msu-iit', name: 'MSU-IIT' },
    { id: 'overton', name: 'Overton Park' },
    { id: 'port', name: 'Port of Iligan' },
    { id: 'bus-terminal', name: 'Integrated Bus Terminal' },
    { id: 'st-michaels', name: "St. Michael's Cathedral" },
    { id: 'public-market', name: 'Iligan Public Market' },
    { id: 'adventist-hospital', name: 'Adventist Medical Center' },
    { id: 'city-hospital', name: 'Gregorio T. Lluch Memorial Hospital' },
  ],
  routes: [
    { name: '01A', description: 'Pala-o to City Proper' },
    { name: '02B', description: 'Buru-un to City Proper' },
    { name: '03C', description: 'Suarez to City Proper' },
    { name: '04D', description: 'Tibanga to Port Area' },
  ],
  edges: [
    // Route 01A
    { source: 'bus-terminal', target: 'g-mall', weight: 2.5, routeName: '01A' },
    { source: 'g-mall', target: 'msu-iit', weight: 1.8, routeName: '01A' },
    { source: 'msu-iit', target: 'st-michaels', weight: 2.2, routeName: '01A' },
    { source: 'st-michaels', target: 'public-market', weight: 1.0, routeName: '01A' },
    
    // Route 02B
    { source: 'adventist-hospital', target: 'msu-iit', weight: 3.5, routeName: '02B' },
    { source: 'msu-iit', target: 'g-mall', weight: 1.8, routeName: '02B' },
    { source: 'g-mall', target: 'city-hall', weight: 2.0, routeName: '02B' },

    // Route 03C
    { source: 'city-hospital', target: 'msu-iit', weight: 4.0, routeName: '03C' },
    { source: 'msu-iit', target: 'public-market', weight: 2.5, routeName: '03C' },
    { source: 'public-market', target: 'port', weight: 1.5, routeName: '03C' },

    // Route 04D
    { source: 'overton', target: 'msu-iit', weight: 1.2, routeName: '04D' },
    { source: 'msu-iit', target: 'port', weight: 3.0, routeName: '04D' },
    { source: 'port', target: 'st-michaels', weight: 0.8, routeName: '04D' },

    // Add reverse edges for two-way travel
    { source: 'g-mall', target: 'bus-terminal', weight: 2.5, routeName: '01A' },
    { source: 'msu-iit', target: 'g-mall', weight: 1.8, routeName: '01A' },
    { source: 'st-michaels', target: 'msu-iit', weight: 2.2, routeName: '01A' },
    { source: 'public-market', target: 'st-michaels', weight: 1.0, routeName: '01A' },

    { source: 'msu-iit', target: 'adventist-hospital', weight: 3.5, routeName: '02B' },
    { source: 'city-hall', target: 'g-mall', weight: 2.0, routeName: '02B' },

    { source: 'msu-iit', target: 'city-hospital', weight: 4.0, routeName: '03C' },
    { source: 'public-market', target: 'msu-iit', weight: 2.5, routeName: '03C' },
    { source: 'port', target: 'public-market', weight: 1.5, routeName: '03C' },

    { source: 'msu-iit', target: 'overton', weight: 1.2, routeName: '04D' },
    { source: 'port', target: 'msu-iit', weight: 3.0, routeName: '04D' },
    { source: 'st-michaels', target: 'port', weight: 0.8, routeName: '04D' },
  ],
};
