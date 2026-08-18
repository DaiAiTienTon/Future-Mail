/**
 * Future Mail — Open Source Project
 * Released under the MIT License.
 * Copyright (c) 2026 DaiAiTienTon
 */

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendAIChatMessage, type ChatMessage } from '../lib/api';

const QUICK_PROMPTS = [
  'Gợi ý chủ đề viết thư cho tôi 5 năm tới',
  'Viết câu mở đầu truyền cảm hứng',
  'Gợi ý những câu hỏi tự vấn bản thân',
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Chào bạn! Tôi là Trợ lý AI của Future Mail. Bạn muốn tìm ý tưởng hay cần hỗ trợ viết lá thư tương lai nào hôm nay?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query.trim() }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Filter out initial welcome message if needed or send clean context
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await sendAIChatMessage(apiMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Xin lỗi, đã xảy ra lỗi: ${err.message || 'Không thể kết nối dịch vụ AI'}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-stone-900 text-stone-50 rounded-full shadow-lg hover:bg-stone-800 transition-all border border-stone-700"
        aria-label="Mở Trợ lý AI"
      >
        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        <span className="text-sm font-medium">Trợ lý AI</span>
      </motion.button>

      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-stone-900 text-stone-50 p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-sm text-stone-100">Future Mail AI</h3>
                  <p className="text-[11px] text-stone-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Sẵn sàng hỗ trợ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-100 p-1.5 rounded-full hover:bg-stone-800 transition-colors"
                aria-label="Đóng chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-stone-700" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-stone-900 text-stone-50 rounded-br-none'
                        : 'bg-white border border-stone-200 text-stone-800 shadow-sm rounded-bl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-stone-100" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-stone-700" />
                  </div>
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
                    <span className="text-xs text-stone-500 font-medium">AI đang suy nghĩ...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Chips */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 bg-white border-t border-stone-100 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-full transition-colors font-medium text-left"
                  >
                    ✨ {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi AI ý tưởng, câu hỏi hay văn phong..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-full text-sm outline-none focus:border-stone-400 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 rounded-full transition-colors shadow-sm"
                aria-label="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
