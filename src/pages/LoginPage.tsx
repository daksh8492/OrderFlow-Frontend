import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { Waypoints, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from "lucide-react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { login } from "@/services/authService";
import { loginSuccess } from "@/store/authSlice";
import { ThemeToggle } from "@/components/common/ThemeToggle";

function LoginPage() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !password) {
      toast.error("Please enter both your user code and password.");
      return;
    }
    setIsLoading(true);
    try {
      const token = await login({ code, password });
      dispatch(loginSuccess(token));
      toast.success("Welcome back!");
      navigate("/app/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Invalid credentials.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-screen bg-background text-foreground overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary blur-[100px] pointer-events-none opacity-[0.08]" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-info blur-[80px] pointer-events-none opacity-[0.05]" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Left showcase panel (hidden on small screens) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 border-r border-border bg-card/30 p-10 backdrop-blur-sm z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
            <Waypoints className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold">OrderFlow</span>
        </div>

        {/* Feature list */}
        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-mono text-primary tracking-widest uppercase mb-2">What's inside</p>
            <h2 className="text-2xl font-black leading-tight text-foreground">
              Full-stack warehouse<br />management at scale
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { emoji: "📦", label: "Real-time inventory tracking across bins, racks & zones" },
              { emoji: "🔐", label: "JWT auth with Admin, Manager, and Operator roles" },
              { emoji: "🚚", label: "Order picking, packing, and fulfillment pipeline" },
              { emoji: "🏭", label: "Multi-warehouse stock transfer & allocation" },
              { emoji: "📊", label: "Full audit trail on all stock movements" },
            ].map(({ emoji, label }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-px">{emoji}</span>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stack badge */}
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-widest">Built with</p>
          <div className="flex flex-wrap gap-1.5">
            {["Spring Boot 3", "React 19", "TypeScript", "PostgreSQL", "JWT", "Tailwind"].map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-md border bg-card text-[10px] font-semibold text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
            <Waypoints className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-bold">OrderFlow</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Back to landing */}
          <NavLink
            to="/"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </NavLink>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight text-foreground mb-1.5">Sign in</h1>
            <p className="text-[13px] text-muted-foreground">
              Enter your user code and password to access the workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* User Code */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                User Code
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="e.g. USR-001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-[13px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-11 pl-10 pr-11 rounded-xl border border-input bg-background text-[13px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-[13px] font-bold text-primary-foreground transition-all shadow-lg shadow-primary/30 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in to workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 rounded-xl border bg-card p-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Demo Access</p>
            <div className="space-y-1">
              <p className="text-[12px] text-muted-foreground">Use your provisioned credentials to log in.</p>
              <p className="text-[12px] text-muted-foreground">Contact the system admin for access.</p>
            </div>
          </div>

          <p className="text-center mt-6 text-[11px] text-muted-foreground/50">
            OrderFlow · Resume Project · 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
