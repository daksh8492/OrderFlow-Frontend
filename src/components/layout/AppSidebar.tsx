import { useAppSelector } from "@/hooks/useAppSelector";
import { NAV_ITEMS } from "./navigation";
import { NavLink } from "react-router";

function AppSidebar() {
  const user = useAppSelector((state) => state.auth.user);
  const allowedItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.fieldOfWork),
  );

  return (
    <div className="px-2 group w-16 top-0 hover:w-64 transition-all duration-300 border-r">
      <div className="flex h-16 items-center justify-center border-b">
        <span className="group-hover:hidden">OF</span>
        <span className="hidden group-hover:inline">OrderFlow</span>
      </div>
      <ul className="pt-10 flex flex-col gap-2">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 justify-center group-hover:justify-start ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`
                }
                to={item.path}
                key={item.path}
              >
                <Icon />
                <span className="hidden group-hover:inline overflow-hidden whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {item.title}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AppSidebar;
