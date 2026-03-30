import { ThemeToggle } from "../mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";

const AppHeader = () => {
  return (
    <header className="flex justify-between h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="ml-1" />
      <div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
