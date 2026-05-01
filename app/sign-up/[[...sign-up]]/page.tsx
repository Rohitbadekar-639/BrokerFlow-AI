import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <SignUp forceRedirectUrl="/dashboard" />
    </main>
  );
}
