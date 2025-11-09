import { SignupForm } from "@/components/signup-form";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-white dark:bg-black p-4 sm:p-6">
      <div className="w-full max-w-md">
        <NeonGradientCard className="w-full shadow-lg">
          <SignupForm />
        </NeonGradientCard>
      </div>
    </div>
  );
}
