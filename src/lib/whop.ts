import { WhopServerSdk } from "@whop/api";

if (!process.env.WHOP_API_KEY) {
  throw new Error("WHOP_API_KEY is not set in environment variables");
}

if (!process.env.NEXT_PUBLIC_WHOP_APP_ID) {
  console.warn("NEXT_PUBLIC_WHOP_APP_ID is not set in environment variables");
}

export const whopSdk = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID || "",
  appApiKey: process.env.WHOP_API_KEY,
});

// Optional: Create instance for user-specific operations
export const createUserWhopSdk = (userId: string) => {
  return WhopServerSdk({
    appId: process.env.NEXT_PUBLIC_WHOP_APP_ID || "",
    appApiKey: process.env.WHOP_API_KEY!,
    onBehalfOfUserId: userId,
  });
};
