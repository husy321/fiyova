import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Footer } from "@/components/site/sections";
import { WhatWeSell, Benefits, HowItWorks, CTA } from "@/components/site/marketing";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <WhatWeSell />
        <Benefits />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
