import DodoPayments from "dodopayments";

export function getDodoClient() {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) {
    throw new Error("Missing DODO_PAYMENTS_API_KEY env var");
  }
  
  const mode = process.env.DODO_MODE === "live" ? "live" : "test";
  console.log("Initializing Dodo client with API key length:", bearerToken.length);
  console.log("API key starts with:", bearerToken.substring(0, 10));
  console.log("Dodo mode:", mode);
  
  return new DodoPayments({ 
    bearerToken,
    mode: mode as "live" | "test"
  });
}


