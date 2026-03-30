"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant={"outline"}
        size={"icon-lg"}
        disabled
        className="opacity-0"
      >
        <Sun />
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      variant={"ghost"}
      size={"icon-lg"}
      className="hover:cursor-pointer"
    >
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
};
