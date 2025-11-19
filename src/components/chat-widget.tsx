'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTransition } from '@/contexts/transition-context'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const pathname = usePathname()
  const { comingFromLanding } = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Fade in the button after page load (delayed to match video transition)
  useEffect(() => {
    // Reset visibility when pathname changes
    setIsVisible(false)
    
    // If coming from landing page, start fade-in when movement completes (1.5s)
    // This allows button to fade in while video fades out, creating seamless transition
    const delay = comingFromLanding ? 1500 : 300 // 1.5s if from landing (when movement completes), 0.3s otherwise
    
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    
    return () => clearTimeout(fadeInTimer)
  }, [pathname, comingFromLanding])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message to conversation
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    try {
      // Build conversation history for the API
      const conversationHistory = newMessages
        .slice(0, -1) // Exclude the current user message
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Add assistant response
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Hide chat widget on landing page and edit page
  if (pathname === '/' || pathname === '/edit') {
    return null
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        data-chat-widget-ref
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8
        }}
        transition={{ 
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
        className={cn(
          'fixed bottom-6 right-6 z-[10000] h-14 w-14 rounded-full',
          'overflow-hidden transition-all duration-200 hover:scale-110',
          'flex items-center justify-center border-2 border-black',
          'shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
          isOpen && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
        )}
        aria-label={isOpen ? "Close chat" : "Open chat with Jess"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white z-10 relative" />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/loop.mp4" type="video/mp4" />
          </video>
        )}
      </motion.button>

      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 left-4 sm:bottom-24 sm:right-6 sm:left-auto sm:w-full sm:max-w-md h-[calc(100vh-8rem)] sm:h-[600px] sm:max-h-[calc(100vh-7rem)] z-50 flex flex-col bg-black/95 border border-white/20 rounded-lg shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom">
          <div className="px-6 pt-6 pb-4 border-b border-white/10">
            <div className="text-xl font-bold text-white flex items-center justify-between">
              <span>Chat with Jess</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-white/70 mt-2">
              👋 Hi! I&apos;m Jess, Jason&apos;s AI assistant. Ask me anything!
            </p>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.length === 0 && (
              <div className="text-center text-white/60 py-8">
                <p>Start a conversation by asking a question!</p>
                <p className="text-sm mt-2">Try: &quot;What does Jason do for fun?&quot; or &quot;Tell me about Jason&apos;s work experience&quot;</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/10 text-white border border-white/20'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start gap-3">
                <div className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about Jason..."
                className="min-h-[60px] max-h-[200px] resize-none bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-white/50 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </form>
        </div>
      )}
    </>
  )
}

