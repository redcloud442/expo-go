import { authClient } from "../auth/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null; // splash

  console.log(session);

  return <>{children}</>;
}
