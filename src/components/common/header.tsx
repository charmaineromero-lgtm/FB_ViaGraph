'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/common/logo";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/contexts/app-context";

export function Header() {
  const { role, setRole } = useAppContext();

  const handleRoleChange = (checked: boolean) => {
    setRole(checked ? 'admin' : 'user');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="role-switcher" className="text-sm font-medium">
            Admin Mode
          </Label>
          <Switch
            id="role-switcher"
            checked={role === 'admin'}
            onCheckedChange={handleRoleChange}
            aria-label="Toggle admin mode"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User" data-ai-hint="person face" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
