import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import './ChatPage.css';

type Sender = "user" | "ai";

interface Message {
  sender: Sender;
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "こんにちは！あなたにぴったりの旅行プランを提案するよ。どこか行きたい場所や、気になることはあるかな？" },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 現在のメッセージを除いた過去のメッセージがあるか確認
  const isFirstMessage = messages.length <= 1; // 初期メッセージ（ai）だけなら初回

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    const newMessage: Message = { sender: "user", text: userText };
    
    // 1. ユーザーのメッセージを表示
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    // 2. AIの返信待ちプレースホルダを追加
    setMessages((prev) => [...prev, { sender: "ai", text: "考え中だよ... 🔍" }]);

    try {
      // バックエンドへ送信
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userText, // 最新のメッセージを送信
          userId: 1,          // テスト用に1固定。必要に応じて動的に変更 
          isFirstMessage: isFirstMessage, // 初回かどうかを伝える
          history: messages.filter(m => m.sender === "user" || m.sender === "ai") // 会話履歴を送信
        }),
      });

      const data: { reply: string } = await res.json();

      if (res.ok) {
        // プレースホルダを実際の回答で置き換え
        setMessages((prev) => {
          const copy = prev.slice(0, -1);
          return [...copy, { sender: "ai", text: data.reply }];
        });
      } else {
        throw new Error("Server Error");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const copy = prev.slice(0, -1);
        return [...copy, { sender: "ai", text: "⚠️ ごめんね、うまく繋がらなかったみたい…😭" }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="page-container">
      <header className="chat-header">
        <h1>AI Travel Planner</h1>
        <p>Your YouTube history helps me pick the best spots! ✈️</p>
      </header>

      <div className="chat-container">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`message-content ${msg.sender} ${msg.text === "考え中だよ... 🔍" ? "loading" : ""}`}>
              {msg.sender === "ai" ? (
                <div className="markdown-body">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              void sendMessage();
            }
          }}
          placeholder="旅行の相談をしてみてね！ (Ctrl+Enterで送信)"
          rows={2}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "..." : "SEND"}
        </button>
      </form>
    </div>
  );
}