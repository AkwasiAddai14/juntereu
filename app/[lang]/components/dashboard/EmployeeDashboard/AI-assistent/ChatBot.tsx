import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ChatBotIconProps {
  messageCount?: number;
  onClick?: () => void;
}

const ChatBotIcon: React.FC<ChatBotIconProps> = ({ messageCount, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open chat assistant"
      className="group fixed bottom-6 right-6 z-[1000] flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/90 bg-orange-500 text-white shadow-lg shadow-orange-900/25 ring-1 ring-orange-400/60 transition hover:border-orange-600 hover:bg-orange-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
    >
      <ChatBubbleLeftRightIcon
        className="h-7 w-7 text-white transition group-hover:text-white"
        aria-hidden
      />
      {messageCount != null && messageCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold leading-none text-white shadow-sm">
          {messageCount > 9 ? '9+' : messageCount}
        </span>
      ) : null}
    </button>
  );
};

export default ChatBotIcon;
