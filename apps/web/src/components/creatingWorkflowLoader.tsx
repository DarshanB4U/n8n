"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CreatingWorkflowLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm shadow-lg border border-teal-800 bg-slate-700 backdrop-blur-md rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Loader2 className="h-10 w-10 text-teal-800" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-slate-50 text-lg font-medium mt-2"
          >
            Creating workflow...
          </motion.p>

          <p className="text-sm text-gray-50 text-center">
            Please wait while we generate your workflow setup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
