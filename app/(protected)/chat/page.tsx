import { MessageCircle } from "lucide-react";

export default function ChatRootPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/50">
      <MessageCircle className="h-16 w-16 text-muted-foreground" />
      <h2 className="mt-6 text-2xl font-semibold">Welcome to your Inbox</h2>
      <p className="mt-2 text-muted-foreground">Select a conversation to start chatting.</p>
    </div>
  );
}