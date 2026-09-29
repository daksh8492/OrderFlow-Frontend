import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import {
  Waypoints, ArrowRight, Boxes, ShieldCheck, BarChart3,
  Activity, ClipboardCheck, Package, MapPin, Truck,
  Users, ExternalLink, Check, Zap, Database,
  GitBranch, Server, Code2,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

/* ─── Data ─────────────────────────────────────────── */

const techStack = [
  { label: "React 19", color: "#61DAFB" },
  { label: "TypeScript", color: "#3178C6" },
  { label: "Spring Boot", color: "#6DB33F" },
  { label: "PostgreSQL", color: "#336791" },
  { label: "JWT Auth", color: "#FB923C" },
  { label: "Tailwind CSS", color: "#38BDF8" },
];

const features = [
  {
    icon: Boxes,
    title: "Live Inventory Control",
    description:
      "Track stock across multiple warehouses with real-time bin-level precision. Transfers, adjustments, and receipts all update instantly.",
  },
  {
    icon: ClipboardCheck,
    title: "Smart Order Picking",
    description:
      "Auto-allocate stock to order items by warehouse proximity. Pickers get a clean, pre-filled list — ready to confirm in seconds.",
  },
  {
    icon: Truck,
    title: "Fulfillment Pipeline",
    description:
      "Move orders through a configurable multi-stage pipeline: Created → Picked → Packed → Shipped → Delivered.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "JWT-secured sessions with ADMIN, INVENTORY_MANAGER, and WAREHOUSE_OPERATOR roles. Every route and API is gated.",
  },
  {
    icon: MapPin,
    title: "Hierarchical Locations",
    description:
      "Zones → Aisles → Racks → Bins. Build your warehouse structure, navigate the tree, and assign stock to exact bin positions.",
  },
  {
    icon: BarChart3,
    title: "Full Audit Trail",
    description:
      "Every stock movement, order status change, and user action is logged with timestamps and attributed to a user.",
  },
];

const pipelineSteps = [
  { label: "Order Created", done: true },
  { label: "Picked", done: true },
  { label: "Packed", done: true },
  { label: "Shipped", done: false, active: true },
  { label: "Delivered", done: false },
];

const roles = [
  {
    icon: Users,
    role: "Admin",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    perms: ["Full system access", "User management", "All warehouses", "Reports"],
  },
  {
    icon: Package,
    role: "Inventory Manager",
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/20",
    perms: ["Catalog & stock", "Order management", "Location setup", "Fulfillment"],
  },
  {
    icon: Truck,
    role: "Warehouse Operator",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    perms: ["Picking tasks", "Stock adjustments", "Their warehouse only", "Transfer stock"],
  },
];

const stats = [
  { value: "6", label: "Modules", icon: Database },
  { value: "3", label: "Access Roles", icon: ShieldCheck },
  { value: "REST", label: "API Design", icon: Server },
  { value: "JWT", label: "Authentication", icon: Zap },
];

/* ─── Animated counter ───────────────────────────── */
function AnimatedPipeline() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">Order #OF-88213</p>
            <p className="text-sm font-bold mt-0.5">Live Order Pipeline</p>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-warning/15 text-warning border border-warning/20">
            In Transit
          </span>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-0">
          {pipelineSteps.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div className="relative flex-shrink-0">
                {step.done ? (
                  <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
                    <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                ) : step.active ? (
                  <div className="h-8 w-8 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center ring-4 ring-primary/20">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border bg-muted flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  </div>
                )}
              </div>
              {/* Line */}
              {i < pipelineSteps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 rounded-full relative overflow-hidden ${step.done && pipelineSteps[i + 1].done ? "bg-success" : step.done && pipelineSteps[i + 1].active ? "bg-primary/30" : "bg-border"}`}>
                  {step.done && pipelineSteps[i + 1].active && (
                    <div
                      className="absolute top-0 h-full w-8 rounded-full bg-primary"
                      style={{ animation: "travel 2.2s ease-in-out infinite" }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="grid mt-3" style={{ gridTemplateColumns: `repeat(${pipelineSteps.length}, 1fr)` }}>
          {pipelineSteps.map((step) => (
            <span
              key={step.label}
              className={`text-[10px] font-semibold text-center whitespace-nowrap ${
                step.done
                  ? "text-success"
                  : step.active
                  ? "text-primary"
                  : "text-muted-foreground/50"
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>

        {/* Stock info bar */}
        <div className="mt-5 pt-4 border-t grid grid-cols-3 gap-3">
          {[
            { label: "SKU", value: "WHL-BLK-XL" },
            { label: "Qty", value: "3 units" },
            { label: "Bin", value: "A2 · R4 · B07" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">{label}</p>
              <p className="text-[11px] font-bold mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative">
      <style>{`
        @keyframes travel { 0% { left: -32px; } 100% { left: 100%; } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, var(--color-foreground) 0%, var(--color-primary) 30%, var(--color-info) 60%, var(--color-foreground) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .glow-primary { box-shadow: 0 0 60px 0 var(--color-primary); opacity: 0.15; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); border-color: var(--color-primary); box-shadow: 0 20px 60px -10px var(--color-primary); }
        .grid-bg {
          background-image: linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.4;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-md border-b" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <Waypoints className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold tracking-tight">OrderFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-muted-foreground">
            {[["Features", "#features"], ["Architecture", "#tech"], ["Roles", "#roles"]].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-foreground transition-colors duration-150">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Code2 className="h-4 w-4" />
              GitHub
            </a>
            <NavLink
              to="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-[13px] font-semibold text-primary-foreground transition-colors shadow-lg shadow-primary/30"
            >
              Open App
              <ArrowRight className="h-3.5 w-3.5" />
            </NavLink>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        {/* Radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary blur-[100px] pointer-events-none opacity-[0.08]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-info blur-[80px] pointer-events-none opacity-[0.05]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border bg-muted text-[11px] font-semibold text-muted-foreground mb-8 font-mono tracking-widest uppercase">
            <GitBranch className="h-3 w-3 text-primary" />
            Full-Stack Resume Project · Spring Boot + React
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02] mb-6">
            <span className="shimmer-text">OrderFlow</span>
            <br />
            <span className="text-foreground/90 text-4xl md:text-5xl font-bold">Warehouse & Order</span>
            <br />
            <span className="text-foreground/90 text-4xl md:text-5xl font-bold">Management System</span>
          </h1>

          <p className="max-w-2xl text-[15px] md:text-base text-muted-foreground leading-relaxed mb-10">
            A production-grade full-stack application demonstrating real-world patterns —
            multi-warehouse inventory tracking, role-based access control, order fulfillment
            pipelines, and live stock picking — built with Spring Boot, React 19, and PostgreSQL.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <NavLink
              to="/login"
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-primary hover:bg-primary/90 text-[14px] font-bold text-primary-foreground transition-all shadow-xl shadow-primary/30 hover:-translate-y-0.5"
            >
              Launch Live Demo
              <ArrowRight className="h-4 w-4" />
            </NavLink>
            <a
              href="#features"
              className="flex items-center gap-2 px-7 py-3 rounded-xl border hover:bg-muted text-[14px] font-semibold text-muted-foreground hover:text-foreground transition-all hover:-translate-y-0.5"
            >
              Explore Features
            </a>
          </div>

          {/* Tech stack pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map(({ label }) => (
              <span
                key={label}
                className="px-3 py-1 rounded-full border bg-card text-[11px] font-semibold text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Animated Pipeline Card */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-24 animate-float">
          <AnimatedPipeline />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center text-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-black font-mono">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[11px] font-mono font-semibold text-primary tracking-widest uppercase mb-3">Core Modules</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Everything a warehouse needs,<br />
            <span className="text-muted-foreground">in one system</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Six tightly integrated modules built to demonstrate real enterprise warehouse workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="card-hover rounded-2xl border bg-card p-6"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Icon className="h-[18px] w-[18px] text-primary" />
              </div>
              <h3 className="font-bold mb-2">{title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH ── */}
      <section id="tech" className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="text-[11px] font-mono font-semibold text-info tracking-widest uppercase mb-3">Architecture</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Built on a modern,<br />
              <span className="text-muted-foreground">production-grade stack</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Backend */}
            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
                  <Server className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-bold text-sm">Backend</p>
                  <p className="text-[11px] text-muted-foreground">Spring Boot · REST API</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  "Spring Boot 3 + Spring Security",
                  "JWT authentication & RBAC",
                  "JPA / Hibernate with PostgreSQL",
                  "Paginated REST endpoints",
                  "Global exception handling",
                  "DTO pattern with validation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-success shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Frontend */}
            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="font-bold text-sm">Frontend</p>
                  <p className="text-[11px] text-muted-foreground">React 19 · TypeScript</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  "React 19 with TypeScript",
                  "Redux Toolkit for auth state",
                  "React Router v7 (file-based)",
                  "Tailwind CSS + shadcn/ui",
                  "Axios with interceptors",
                  "Debounced search, lazy loading",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-info shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[11px] font-mono font-semibold text-primary tracking-widest uppercase mb-3">Access Control</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Three roles,<br />
            <span className="text-muted-foreground">zero overlap</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {roles.map(({ icon: Icon, role, color, bg, border, perms }) => (
            <div
              key={role}
              className={`card-hover rounded-2xl border ${border} ${bg} p-6`}
            >
              <div className={`h-10 w-10 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}>
                <Icon className={`h-[18px] w-[18px] ${color}`} />
              </div>
              <h3 className={`font-bold mb-1 ${color}`}>{role}</h3>
              <div className="space-y-2 mt-3">
                {perms.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Check className={`h-3 w-3 ${color} shrink-0`} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="relative rounded-3xl border bg-primary/5 p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <div className="relative z-10">
            <p className="text-[11px] font-mono font-semibold text-primary tracking-widest uppercase mb-4">Live Demo</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              See it in action
            </h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
              Log in with demo credentials to explore the full warehouse management system — picking, stock, fulfillment, and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink
                to="/login"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-[14px] font-bold text-primary-foreground transition-all shadow-xl shadow-primary/30 hover:-translate-y-0.5"
              >
                Launch Demo
                <ArrowRight className="h-4 w-4" />
              </NavLink>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl border hover:bg-muted text-[14px] font-semibold text-muted-foreground hover:text-foreground transition-all hover:-translate-y-0.5"
              >
                <Code2 className="h-4 w-4" />
                View Source
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <Waypoints className="h-3 w-3 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold">OrderFlow</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Full-Stack Resume Project · Spring Boot + React 19 + PostgreSQL
          </p>
          <NavLink to="/login" className="text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors">
            Open App →
          </NavLink>
        </div>
      </footer>
    </div>
  );
}
