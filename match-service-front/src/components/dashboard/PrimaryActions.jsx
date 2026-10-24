import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { primaryActions } from "../../data/dashboard";

export default function PrimaryActions() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {primaryActions.map((action) => (
        <Button
          key={action.id}
          as={Link}
          to={action.to}
          variant={action.variant}
          size="md"
          appearance="app"
          className="sm:min-w-[160px]"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
