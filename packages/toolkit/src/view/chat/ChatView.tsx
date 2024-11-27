import { ChatInput } from "./ChatInput";

export const ChatView = () => {
  return (
    <div className="flex flex-col">
      <div id="tool-suggestion" />
      <div className="h-[1000px]"></div>
      <ChatInput />
    </div>
  );
};
