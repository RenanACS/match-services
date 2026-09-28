import { Link } from "react-router-dom";
import { ICONS } from "./icons";
import { quickActions } from "../../data/dashboard";

export default function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-title">
      <h2
        id="quick-actions-title"
        className="mb-3 font-display text-xl font-semibold text-cream xl:mb-1.5 xl:text-base"
      >
        Ações rápidas
      </h2>
      <ul className="flex flex-col gap-1.5 xl:gap-1.5">
        {quickActions.map((action) => {
          const Icon = ICONS[action.icon];
          return (
            <li key={action.id}>
              <Link
                to={action.to}
                className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-1 px-4 py-3 text-sm text-cream/80 transition hover:border-orange/50 hover:bg-surface-2 hover:text-cream xl:py-2"
              >
                <span className="text-cream/50">
                  <Icon />
                </span>
                {action.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
