import { AddTradeForm } from "@/components/forms/AddTradeForm";

export default function AddTradePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Trade</h1>
        <p className="text-sm text-muted-foreground mt-1">Log a position to track and learn from</p>
      </div>

      <AddTradeForm />
    </div>
  );
}
