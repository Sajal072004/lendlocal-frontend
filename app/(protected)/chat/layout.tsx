import { ConversationList } from "@/components/ConversationList";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto h-[calc(100vh-4rem)]">
      <div className="flex h-full border rounded-lg overflow-hidden my-4">
        <aside className="w-1/3 border-r">
          <ConversationList />
        </aside>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}