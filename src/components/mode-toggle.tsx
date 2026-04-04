"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    <Button
      disabled
      variant={"ghost"}
      size={"icon-lg"}
      className="hover:cursor-not-allowed"
    >
      <Loader2Icon />
    </Button>;
  }

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      variant={"ghost"}
      size={"icon-lg"}
      className="hover:cursor-pointer"
    >
      {resolvedTheme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
};
