import AssistantChat from "../../components/AssistantChat";

export default function Assistente() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <h1 className="app-page-title text-cream">
        Assistente IA
      </h1>
      <AssistantChat />
    </div>
  );
}
