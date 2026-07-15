import { Link, useLocation } from "react-router-dom";
import { Sprout, BookOpenText, UtensilsCrossed } from "lucide-react";
import { StageSwitcher } from "./StageSwitcher";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
        <div className="container flex h-14 md:h-16 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-2xl bg-clay text-cream shadow-soft transition-transform group-hover:rotate-6">
              <Sprout className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.2} />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-base md:text-lg font-bold tracking-wide text-ink">
                安心食光
              </span>
              <span className="text-[9px] md:text-[10px] tracking-[0.2em] text-inksoft/70">
                EAT · SAFE · GLOW
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavItem to="/" label="菜谱" active={pathname === "/"} />
            <NavItem
              to="/taboos"
              label="禁忌速查"
              active={pathname.startsWith("/taboos")}
            />
          </nav>

          <div className="flex items-center gap-2">
            <StageSwitcher />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-ink/5 bg-cream/60">
        <div className="container flex flex-col items-center gap-2 py-6 md:py-8 text-center">
          <div className="flex items-center gap-2 text-inksoft">
            <BookOpenText className="h-4 w-4" />
            <span className="text-xs">
              菜谱数据采用开源项目 HowToCook · 禁忌信息为科普参考，非医学诊断
            </span>
          </div>
          <p className="text-[10px] md:text-[11px] text-inksoft/60">
            具体饮食请遵医嘱 · 个人体质差异请酌情调整
          </p>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-ink/10 bg-cream/95 px-2 py-2 backdrop-blur-md md:hidden">
        <NavItemMobile to="/" label="菜谱" icon={UtensilsCrossed} active={pathname === "/"} />
        <NavItemMobile to="/taboos" label="禁忌" icon={BookOpenText} active={pathname.startsWith("/taboos")} />
      </nav>
    </div>
  );
}

function NavItemMobile({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Sprout;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors",
        active
          ? "text-clay"
          : "text-inksoft",
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
}

function NavItem({
  to,
  label,
  active,
}: {
  to: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-pill px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-clay/10 text-clay"
          : "text-inksoft hover:bg-creamdark/60 hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}
