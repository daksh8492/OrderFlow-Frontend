import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { ChevronDown, Waypoints } from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";
import { NAV_ITEMS } from "./navigation";

function AppSidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canAccess = (roles: string[]) =>
    !!user && roles.includes(user.fieldOfWork);

  const allowedItems = NAV_ITEMS.filter((item) => {
    if (!item.children) return canAccess(item.roles);
    return item.children.some((child) => canAccess(child.roles));
  });

  // Auto-open group containing current route
  useEffect(() => {
    for (const item of allowedItems) {
      if (item.children?.some((child) => location.pathname.startsWith(child.path ?? ""))) {
        setExpandedGroups((prev) =>
          prev.includes(item.title) ? prev : [...prev, item.title]
        );
      }
    }
  }, [location.pathname, user]);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  // Debounced hover to prevent instant toggle glitch
  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setExpanded(true), 80);
  };
  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setExpanded(false), 120);
  };

  if (!user) return null;

  const initials = user.fieldOfWork?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="w-[60px] h-screen shrink-0 relative z-30">
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: expanded ? "240px" : "60px",
          transition: "width 260ms cubic-bezier(0.4,0,0.2,1)",
        }}
        className="absolute left-0 top-0 z-40 flex h-screen flex-col border-r bg-background overflow-hidden shadow-[1px_0_0_0_hsl(var(--border))]"
      >
        {/* ─── Logo ─── */}
        <div className="flex h-[60px] shrink-0 items-center border-b px-3.5 gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Waypoints className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div
            style={{
              opacity: expanded ? 1 : 0,
              transition: expanded
                ? "opacity 180ms ease 120ms"
                : "opacity 80ms ease 0ms",
              pointerEvents: expanded ? "auto" : "none",
              whiteSpace: "nowrap",
            }}
          >
            <p className="text-[13px] font-bold tracking-tight leading-none">OrderFlow</p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Management System</p>
          </div>
        </div>

        {/* ─── Navigation ─── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {allowedItems.map((item) => {
            const Icon = item.icon;

            /* ── Flat item ── */
            if (!item.children) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path!}
                  end={item.path === "/app/orders"}
                  title={!expanded ? item.title : undefined}
                  className={({ isActive }) =>
                    `group relative flex h-9 items-center gap-3 rounded-lg px-2.5 transition-colors duration-150 cursor-pointer
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-[17px] w-[17px] shrink-0" />
                  <span
                    style={{
                      opacity: expanded ? 1 : 0,
                      transition: expanded
                        ? "opacity 180ms ease 100ms"
                        : "opacity 60ms ease 0ms",
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                </NavLink>
              );
            }

            /* ── Group ── */
            const visibleChildren = item.children.filter((c) => canAccess(c.roles));
            if (visibleChildren.length === 0) return null;

            const isOpen = expandedGroups.includes(item.title);
            const hasActiveChild = visibleChildren.some((child) => {
              const childPath = child.path ?? "";
              if (childPath === "/app/orders") {
                return (
                  location.pathname === childPath ||
                  (location.pathname.startsWith("/app/orders/") &&
                    !location.pathname.startsWith("/app/orders/picking"))
                );
              }
              return location.pathname.startsWith(childPath);
            });

            return (
              <div key={item.title}>
                <button
                  type="button"
                  onClick={() => { if (expanded) toggleGroup(item.title); }}
                  title={!expanded ? item.title : undefined}
                  className={`flex h-9 w-full items-center gap-3 rounded-lg px-2.5 transition-colors duration-150 cursor-pointer
                    ${hasActiveChild
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                >
                  <Icon
                    className={`h-[17px] w-[17px] shrink-0 ${hasActiveChild ? "text-primary" : ""}`}
                  />
                  <span
                    style={{
                      opacity: expanded ? 1 : 0,
                      flex: 1,
                      textAlign: "left",
                      transition: expanded
                        ? "opacity 180ms ease 100ms"
                        : "opacity 60ms ease 0ms",
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                  <ChevronDown
                    style={{
                      opacity: expanded ? 1 : 0,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "opacity 150ms ease, transform 200ms ease",
                      pointerEvents: "none",
                    }}
                    className="h-3.5 w-3.5 shrink-0"
                  />
                </button>

                {/* Children */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen && expanded ? "1fr" : "0fr",
                    opacity: isOpen && expanded ? 1 : 0,
                    transition: "grid-template-rows 220ms ease, opacity 180ms ease",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="ml-[17px] mt-0.5 mb-0.5 space-y-0.5 border-l border-border/70 pl-3">
                      {visibleChildren.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path!}
                            end={child.path === "/app/orders"}
                            className={({ isActive }) =>
                              `relative flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[12px] font-medium transition-colors duration-150
                              ${isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                {isActive && (
                                  <span className="absolute -left-[13px] h-4 w-0.5 rounded-full bg-primary" />
                                )}
                                <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                                <span className="whitespace-nowrap">{child.title}</span>
                              </>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* ─── User ─── */}
        <div className="border-t p-2">
          <div className="flex h-10 items-center gap-3 rounded-lg px-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary ring-1 ring-primary/20">
              {initials}
            </div>
            <div
              style={{
                opacity: expanded ? 1 : 0,
                transition: expanded
                  ? "opacity 180ms ease 100ms"
                  : "opacity 60ms ease 0ms",
                pointerEvents: expanded ? "auto" : "none",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <p className="text-[11px] font-semibold leading-none">{user.fieldOfWork}</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Active session</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AppSidebar;