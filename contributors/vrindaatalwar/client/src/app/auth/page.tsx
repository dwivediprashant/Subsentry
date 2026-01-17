import AuthForm from "@/components/AuthForm";
import FeatureCarousel from "@/components/FeatureCarousel";

export default function AuthPage() {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
      <AuthForm />
      <FeatureCarousel />
    </main>
  );
}