'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, PlusCircle, Trash2, Edit } from 'lucide-react';
import { graph } from '@/lib/data';
import { addLocationAction, addRouteAction, deleteItemAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/app-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function DeleteButton({ type, id }: { type: 'location' | 'route', id: string }) {
    const { toast } = useToast();
    const handleDelete = async () => {
        const result = await deleteItemAction(type, id);
        toast({ title: "Success", description: result.message });
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Delete</span>
        </Button>
    );
}

export default function AdminPage() {
  const { toast } = useToast();
  const { role } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You must be an admin to view this page.',
      });
      router.push('/find-route');
    }
  }, [role, router, toast]);

  if (role !== 'admin') {
    return null; // Or a loading/redirecting state
  }

  const handleAddLocation = async (formData: FormData) => {
    const result = await addLocationAction(formData);
    toast({ title: "Success", description: result.message });
  };
  
  const handleAddRoute = async (formData: FormData) => {
    const result = await addRouteAction(formData);
    toast({ title: "Success", description: result.message });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Tabs defaultValue="routes">
        <TabsList>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="jeepney-lines">Jeepney Lines</TabsTrigger>
        </TabsList>

        <TabsContent value="routes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Routes</CardTitle>
                <CardDescription>
                  Add, edit, or delete route segments.
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Route</Button>
                </DialogTrigger>
                <DialogContent>
                  <form action={handleAddRoute}>
                    <DialogHeader>
                      <DialogTitle>Add New Route Segment</DialogTitle>
                      <DialogDescription>Fill in the details for the new route segment.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="source" className="text-right">Source</Label>
                        <Select name="source">
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select source" /></SelectTrigger>
                            <SelectContent>{graph.nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="target" className="text-right">Target</Label>
                        <Select name="target">
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select target" /></SelectTrigger>
                            <SelectContent>{graph.nodes.map(n => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="weight" className="text-right">Distance (km)</Label>
                        <Input id="weight" name="weight" type="number" step="0.1" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="routeName" className="text-right">Jeepney Line</Label>
                        <Select name="routeName">
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select line" /></SelectTrigger>
                            <SelectContent>{graph.routes.map(r => <SelectItem key={r.name} value={r.name}>{r.name} - {r.description}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button type="submit">Add Route</Button></DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Line</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {graph.edges.map((edge, i) => (
                    <TableRow key={i}>
                      <TableCell>{graph.nodes.find(n => n.id === edge.source)?.name}</TableCell>
                      <TableCell>{graph.nodes.find(n => n.id === edge.target)?.name}</TableCell>
                      <TableCell>{edge.weight} km</TableCell>
                      <TableCell>{edge.routeName}</TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <DeleteButton type="route" id={`${edge.source}-${edge.target}-${i}`} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Locations</CardTitle>
                    <CardDescription>Add, edit, or delete key locations.</CardDescription>
                </div>
                <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Location</Button>
                </DialogTrigger>
                <DialogContent>
                  <form action={handleAddLocation}>
                    <DialogHeader>
                      <DialogTitle>Add New Location</DialogTitle>
                      <DialogDescription>Provide a unique ID and name for the new location.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">ID</Label>
                            <Input id="id" name="id" className="col-span-3" placeholder="e.g., new-mall" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" className="col-span-3" placeholder="e.g., The New Mall" />
                        </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button type="submit">Add Location</Button></DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {graph.nodes.map(node => (
                            <TableRow key={node.id}>
                                <TableCell className="font-mono">{node.id}</TableCell>
                                <TableCell>{node.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    <DeleteButton type="location" id={node.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jeepney-lines">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Jeepney Lines</CardTitle>
                    <CardDescription>View and manage jeepney line information.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Line Name</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {graph.routes.map(route => (
                                <TableRow key={route.name}>
                                    <TableCell className="font-bold">{route.name}</TableCell>
                                    <TableCell>{route.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Import LTFRB Data</CardTitle>
          <CardDescription>
            Upload a JSON file with route data to quickly update the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <Input id="json-upload" type="file" accept=".json" />
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Import JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
