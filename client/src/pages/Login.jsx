import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/queries.js";
import { Button } from "../components/Button.jsx";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Field, inputClass } from "../components/Field.jsx";
import { useAuthStore } from "../store/authStore.js";

export function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess(data) {
      setSession(data);
      navigate("/");
    }
  });

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    mutation.mutate({ email: form.get("email"), password: form.get("password") });
  }

  return (
    <AuthFrame title="Welcome back">
      <form onSubmit={submit} className="space-y-4">
        <ErrorBanner error={mutation.error} />
        <Field label="Email"><input className={inputClass} name="email" type="email" defaultValue="demo@careerpilot.ai" required /></Field>
        <Field label="Password"><input className={inputClass} name="password" type="password" defaultValue="Password@123" required /></Field>
        <Button className="w-full" disabled={mutation.isPending}>{mutation.isPending ? "Signing in..." : "Login"}</Button>
        <p className="text-center text-sm">New here? <Link className="font-bold text-moss" to="/register">Create an account</Link></p>
      </form>
    </AuthFrame>
  );
}

export function AuthFrame({ title, children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <section className="card w-full max-w-md p-6">
        <p className="text-xs font-black uppercase tracking-wide text-moss">CareerPilot AI</p>
        <h1 className="mb-6 text-3xl font-black">{title}</h1>
        {children}
      </section>
    </main>
  );
}
