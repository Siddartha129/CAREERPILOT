import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/queries.js";
import { Button } from "../components/Button.jsx";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Field, inputClass } from "../components/Field.jsx";
import { useAuthStore } from "../store/authStore.js";
import { AuthFrame } from "./Login.jsx";

export function Register() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess(data) {
      setSession(data);
      navigate("/profile");
    }
  });

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    mutation.mutate({ name: form.get("name"), email: form.get("email"), password: form.get("password") });
  }

  return (
    <AuthFrame title="Create account">
      <form onSubmit={submit} className="space-y-4">
        <ErrorBanner error={mutation.error} />
        <Field label="Name"><input className={inputClass} name="name" required /></Field>
        <Field label="Email"><input className={inputClass} name="email" type="email" required /></Field>
        <Field label="Password"><input className={inputClass} name="password" type="password" minLength={6} required /></Field>
        <Button className="w-full" disabled={mutation.isPending}>{mutation.isPending ? "Creating..." : "Register"}</Button>
        <p className="text-center text-sm">Already registered? <Link className="font-bold text-moss" to="/login">Login</Link></p>
      </form>
    </AuthFrame>
  );
}
