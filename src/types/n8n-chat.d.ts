
interface N8nChatOptions {
  chatId?: string;
  webhookUrl: string;
  showWelcomeScreen?: boolean;
  mode?: 'normal' | 'fullscreen';
  container?: HTMLElement | null;
}

interface N8nChat {
  init: (options: N8nChatOptions) => void;
  sendMessage: (message: string) => void;
}

declare global {
  interface Window {
    __n8nChat?: N8nChat;
  }
}

export {};
