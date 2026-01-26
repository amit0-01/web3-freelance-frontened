export interface ConversationItemProps {
    conversation: any
    isActive: boolean
    onClick: () => void
    isOnline: boolean
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
    onBack?: () => void
  }

  export interface MessageProps {
    message: any
    isOwn: boolean
  }

export interface RouteParams {
  params: {
    id: string
  }
}

export interface FilePreview {
  file: File
  preview: string
  attachment?: { name: string; type: string; size: number; url: string }
  uploading?: boolean
}