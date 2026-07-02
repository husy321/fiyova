"use client";
import Link from "next/link";
import { Button, Card, CardBody } from "@heroui/react";

/* ---------------------------------- data ---------------------------------- */

const categories = [
  {
    title: "n8n Automation Kits",
    description:
      "Production-ready n8n workflows for invoicing, social media, voucher redemption and more. Import, plug in your keys, and run.",
    icon: (
      <path d="M4 7h16M4 12h16M4 17h10" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    title: "AI Agents & Chatbots",
    description:
      "Multi-LLM CLI agents and smart chatbots for lead generation, booking and support — ready to deploy for your business.",
    icon: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="3" strokeWidth="1.6" />
        <path d="M9 11h.01M15 11h.01M9 15h6" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Claude Skills & Guides",
    description:
      "Battle-tested Claude skills, agent guidance and step-by-step guides to build any app from scratch with AI.",
    icon: (
      <path
        d="M12 3l7 4v5c0 4-3 6.5-7 9-4-2.5-7-5-7-9V7l7-4z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Apps & Tools",
    description:
      "Finished, ready-to-use applications like PyAttand Pro — practical software you can put to work today.",
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" strokeWidth="1.6" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" strokeWidth="1.6" />
      </>
    ),
  },
];

const benefits = [
  {
    title: "One-time purchase",
    description: "No subscriptions, no recurring fees. Pay once and it's yours forever.",
  },
  {
    title: "Instant download",
    description: "Get immediate access to your files the moment your payment clears.",
  },
  {
    title: "Secure checkout",
    description: "Payments processed securely through Dodo Payments with full encryption.",
  },
  {
    title: "Ready to use",
    description: "Every product is tested and documented so you can ship faster.",
  },
];

const steps = [
  {
    step: "01",
    title: "Browse the catalog",
    description: "Explore automation kits, AI agents, Claude skills and finished apps.",
  },
  {
    step: "02",
    title: "Checkout securely",
    description: "Pay once with a fast, encrypted checkout — no account subscription needed.",
  },
  {
    step: "03",
    title: "Download & build",
    description: "Get instant access to your files and start shipping right away.",
  },
];

/* -------------------------------- sections -------------------------------- */

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-pretty text-foreground/70">{subtitle}</p>
    </div>
  );
}

export function WhatWeSell() {
  return (
    <section id="what-we-sell" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="What we sell"
        title="Digital products that get you shipping"
        subtitle="Fiyova builds practical, ready-to-run digital products for automation and AI — no fluff, just tools that work."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Card key={c.title} className="h-full border border-default-200 shadow-none transition-shadow hover:shadow-md">
            <CardBody className="gap-4 p-6">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6">
                  {c.icon}
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-foreground/70">{c.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function Benefits() {
  return (
    <section className="border-y border-default-200 bg-default-50/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Fiyova"
          title="Buy once. Own it forever."
          subtitle="Everything is built around a simple promise: fair pricing and instant access to quality products."
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5 text-primary">
                  <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="font-semibold">{b.title}</h3>
              </div>
              <p className="text-sm text-foreground/70">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="How it works"
        title="From browse to build in minutes"
        subtitle="No onboarding, no waiting. Three steps and you're up and running."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.step} className="h-full border border-default-200 shadow-none">
            <CardBody className="gap-3 p-6">
              <span className="text-3xl font-bold text-primary/30">{s.step}</span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-foreground/70">{s.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-default-200 bg-default-100 px-6 py-16 text-center sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.06),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        <h2 className="relative mx-auto max-w-2xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          Ready to see what you can build?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-pretty text-foreground/70">
          Browse the full catalog of automation kits, AI agents and Claude skills — one-time purchase, instant download.
        </p>
        <div className="relative mt-8 flex justify-center">
          <Button as={Link} href="/products" color="primary" variant="shadow" size="lg">
            Browse all products
          </Button>
        </div>
      </div>
    </section>
  );
}
