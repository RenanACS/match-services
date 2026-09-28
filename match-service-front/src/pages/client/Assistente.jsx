import AssistantChat from "../../components/AssistantChat";

export default function Assistente() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold text-cream">
        Assistente IA
      </h1>
      <AssistantChat />
    </div>
  );
}
