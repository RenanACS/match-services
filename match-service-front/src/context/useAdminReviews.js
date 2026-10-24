import { useContext } from "react";
import { AdminReviewsContext } from "./AdminReviewsContext";

export default function useAdminReviews() {
  const ctx = useContext(AdminReviewsContext);
  if (!ctx) throw new Error("useAdminReviews deve ser usado dentro da rota /admin/avaliacoes.");
  return ctx;
}
