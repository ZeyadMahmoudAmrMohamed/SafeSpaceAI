import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function MobileSidebar({
  open,
  onOpenChange,
  onNewChat,
  onClear,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onNewChat: () => void;
  onClear: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
        <div className="md:hidden block h-full">
          {/* reuse the same Sidebar but force visible by overriding md:flex via wrapper */}
          <div className="[&>aside]:flex h-full">
            <Sidebar
              onNewChat={() => {
                onNewChat();
                onOpenChange(false);
              }}
              onClear={() => {
                onClear();
                onOpenChange(false);
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
