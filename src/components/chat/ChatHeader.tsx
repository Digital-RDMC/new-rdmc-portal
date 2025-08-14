'use client';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface ChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  title?: string;
}

export function ChatHeader({ sidebarOpen, onToggleSidebar, title = 'AI Assistant' }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
    </div>
  );
}
