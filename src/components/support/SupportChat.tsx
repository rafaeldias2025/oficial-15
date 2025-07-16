import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Minimize2, Maximize2, Phone, Mail, Clock, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support' | 'bot';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Como posso ajudá-lo hoje? 😊',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [zapierWebhook, setZapierWebhook] = useState('');
  const [showZapierConfig, setShowZapierConfig] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Enviar para Zapier se configurado
    if (zapierWebhook) {
      try {
        await fetch(zapierWebhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify({
            message: currentMessage,
            timestamp: new Date().toISOString(),
            user_id: 'current_user',
            platform: 'instituto_sonhos'
          })
        });
      } catch (error) {
        console.error('Erro ao enviar para Zapier:', error);
      }
    }

    // Simular resposta automática
    setTimeout(() => {
      const responses = [
        'Entendi sua solicitação. Vou conectá-lo com um especialista.',
        'Obrigado por entrar em contato. Em que específicamente posso ajudá-lo?',
        'Sua mensagem foi recebida. Nossa equipe irá responder em breve.',
        'Posso ajudá-lo com dúvidas sobre o programa, missões ou seu progresso.'
      ];

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const createSupportTicket = (subject: string, message: string) => {
    const ticket: SupportTicket = {
      id: Date.now().toString(),
      subject,
      status: 'open',
      priority: 'medium',
      createdAt: new Date()
    };

    setSupportTickets(prev => [...prev, ticket]);
    
    toast({
      title: "Ticket criado ✅",
      description: `Ticket #${ticket.id.slice(-4)} foi criado com sucesso`
    });
  };

  const quickActions = [
    { label: 'Dúvidas sobre missões', action: () => setCurrentMessage('Tenho dúvidas sobre as missões diárias') },
    { label: 'Problemas técnicos', action: () => setCurrentMessage('Estou tendo problemas técnicos com a plataforma') },
    { label: 'Meu progresso', action: () => setCurrentMessage('Gostaria de revisar meu progresso') },
    { label: 'Cancelar assinatura', action: () => setCurrentMessage('Preciso de ajuda com minha assinatura') }
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-instituto-orange hover:bg-instituto-orange-hover text-white rounded-full p-4 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`bg-netflix-card border-netflix-border shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-96'
      } w-80`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-instituto-orange" />
            <CardTitle className="text-sm text-netflix-text">Suporte</CardTitle>
            <Badge variant="secondary" className="text-xs">Online</Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 pt-0">
            {/* Configuração Zapier */}
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowZapierConfig(!showZapierConfig)}
                className="w-full text-xs"
              >
                {showZapierConfig ? 'Ocultar' : 'Configurar'} Zapier
              </Button>
              
              {showZapierConfig && (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Cole seu Zapier Webhook URL aqui"
                    value={zapierWebhook}
                    onChange={(e) => setZapierWebhook(e.target.value)}
                    className="text-xs"
                  />
                  <p className="text-xs text-netflix-text-muted">
                    Configure um webhook no Zapier para receber mensagens automaticamente
                  </p>
                </div>
              )}
            </div>

            {/* Chat Messages */}
            <div className="h-48 overflow-y-auto mb-4 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-instituto-orange text-white'
                      : 'bg-netflix-hover text-netflix-text'
                  }`}>
                    <div className="flex items-center gap-1 mb-1">
                      {message.sender === 'bot' && <Bot className="h-3 w-3" />}
                      {message.sender === 'support' && <User className="h-3 w-3" />}
                      <span className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-netflix-hover text-netflix-text p-2 rounded-lg text-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-netflix-text-muted rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-netflix-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-netflix-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="text-xs h-6"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={sendMessage} disabled={!currentMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-3 pt-3 border-t border-netflix-border">
              <div className="flex items-center justify-between text-xs text-netflix-text-muted">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Seg-Sex 9h-18h</span>
                </div>
                <div className="flex gap-2">
                  <Mail className="h-3 w-3" />
                  <Phone className="h-3 w-3" />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};