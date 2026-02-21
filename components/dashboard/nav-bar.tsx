"use client";

import { motion } from "framer-motion";
import { Calendar, LogOut } from "lucide-react";
import LogoutButton from "../logout-button";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Calendar className="w-5 h-5 text-primary" />
          Dashboard
        </div>

        <LogoutButton />
      </div>
    </motion.nav>
  );
}
