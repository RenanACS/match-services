import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../../context/auth/useAuth";
import SupplierDataProvider from "../../../context/supplier/SupplierDataProvider";
import useSupplierData from "../../../context/supplier/useSupplierData";
import { clearSupplierData } from "../../../context/supplier/supplierDataStore";
import Breadcrumb from "./Breadcrumb";
import SupplierSidebar from "./SupplierSidebar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import { CloseIcon, MenuIcon } from "../icons";

/**
 * Layout da área do fornecedor (/fornecedor/*): sidebar fixa em telas
 * grandes (lg+) e gaveta recolhível nas pequenas, breadcrumb e menu do
 * usuário no topo. É independente do AppLayout do cliente. O provider dos
 * dados (solicitações, serviços etc.) envolve todas as telas da área.
 */
export default function SupplierLayout() {
  return (
    <SupplierDataProvider>
      <SupplierShell />
    </SupplierDataProvider>
  );
}

function SupplierShell() {
  const { session, signOut } = useAuth();
  const { profile } = useSupplierData();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = profile.name || session?.email?.split("@")[0] || "Fornecedor";

  // A gaveta fecha ao escolher um item (onNavigate) e com Esc.
  useEffect(() => {
    if (!menuOpen) return undefined;
    function handleKey(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Encerra a sessão e troca a entrada atual do histórico por /login, para o
  // botão voltar não reabrir nenhuma tela do fornecedor (e, se reabrir, a
  // ProtectedRoute redireciona de novo para o login).
  function handleLogout() {
    setMenuOpen(false);
    clearSupplierData();
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-bg text-cream">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-hairline bg-surface-1 lg:block">
        <SupplierSidebar onLogout={handleLogout} />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <aside
            id="supplier-menu"
            className="absolute inset-y-0 left-0 w-64 max-w-[85vw] border-r border-hairline bg-surface-1"
          >
            <SupplierSidebar onNavigate={() => setMenuOpen(false)} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-hairline px-4 py-3 sm:px-6">
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="supplier-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline text-cream/70 hover:border-orange/60 hover:text-orange lg:hidden"
          >
            {menuOpen ? <CloseIcon width={18} height={18} /> : <MenuIcon width={18} height={18} />}
          </button>
          <div className="min-w-0 flex-1">
            <Breadcrumb />
          </div>
          <NotificationBell />
          <UserMenu name={displayName} onLogout={handleLogout} />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
