import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { chatService } from '../services/chat';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Send, Bot, User as UserIcon, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChatMessage } from '../types/chat';

const Chat = () => {
  const { user, setUser } = useAuthStore();
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    tokens?: number;
    cost?: number;
  }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 載入歷史記錄
  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const history = await chatService.getChatHistory(user!.user_id);
      const formattedHistory = history.map(msg => ({
        role: 'user' as const,
        content: msg.input_text,
        tokens: msg.tokens_used,
        cost: msg.amount_used,
        timestamp: msg.timestamp,
      })).concat(history.map(msg => ({
        role: 'assistant' as const,
        content: msg.response_text,
        tokens: msg.tokens_used,
        cost: msg.amount_used,
        timestamp: msg.timestamp,
      })));

      // 按時間排序
      formattedHistory.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setMessages(formattedHistory);
    } catch (error) {
      console.error('Failed to load chat history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    setIsLoading(true);
    const currentMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, currentMessage]);
    
    try {
      const response = await chatService.sendMessage({ input_text: input });
      
      setUser({
        ...user,
        balance: response.remaining_balance,
        available_tokens: response.remaining_tokens,
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.response,
        tokens: response.tokens_used,
        cost: response.amount_used,
      }]);
      
      setInput('');
    } catch (error) {
      toast.error('Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg h-[70vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-gray-700">AI Chat</span>
          </div>
          <div className="text-sm text-gray-500">
            Available Tokens: {user?.available_tokens.toLocaleString()}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  {message.role === 'user' ? (
                    <UserIcon className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Bot className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.tokens && (
                    <div className="mt-1 text-xs opacity-75">
                      Tokens: {message.tokens} | Cost: ${message.cost?.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !user?.available_tokens}
              className="px-4 py-2"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          {user?.available_tokens === 0 && (
            <p className="text-sm text-red-500 mt-2">
              You have no available tokens. Please recharge your account to continue chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;