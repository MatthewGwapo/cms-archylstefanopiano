import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, X, Info, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotifications, useUnreadNotificationCount, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { Notification } from "@/types/database";

const typeIcons: Record<string, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: AlertCircle,
};

const typeColors: Record<string, string> = {
  info: "text-info",
  warning: "text-warning",
  success: "text-success",
  error: "text-destructive",
};

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const { data: notifications, isLoading } = useNotifications();
  const { data: unreadCount } = useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markRead.mutate(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
      setOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification.mutate(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border p-3">
          <h4 className="font-semibold">Notifications</h4>
          {(unreadCount ?? 0) > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs gap-1"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          ) : !notifications?.length ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || Info;
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                      !notification.is_read && "bg-accent/5"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={cn("shrink-0 mt-0.5", typeColors[notification.type] || "text-muted-foreground")}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-medium", !notification.is_read && "text-foreground")}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {!notification.is_read && (
                            <span className="h-2 w-2 rounded-full bg-accent" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => handleDelete(e, notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.created_at), "MMM dd, h:mm a")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
