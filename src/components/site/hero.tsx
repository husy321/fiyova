"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.06),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_50%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72vh] flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-4 flex items-center gap-2"
          >
            <Badge variant="secondary">No subscription</Badge>
            <Badge variant="outline">Instant download</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          >
            Premium digital products. One-time purchase. Yours forever.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="mt-4 max-w-2xl text-pretty text-base text-foreground/70 sm:text-lg"
          >
            Clear pricing, no recurring fees. Secure checkout and immediate access to your files after purchase.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button as={Link} href="/products" color="primary" variant="shadow" size="lg">
              Shop products
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


