export interface ConversationItemProps {
    conversation: any
    isActive: boolean
    onClick: () => void
  }
  
export interface ChatSidebarProps {
    conversations: any[]
    activeConversationId: string | null
    onSelectConversation: (conversation: any) => void
  }
  
export interface ChatWindowProps {
    conversation: any
    conversationId : any
    onSendMessage: (content: string) => void
  }

  export interface MessageProps {
    message: any
    isOwn: boolean
  }