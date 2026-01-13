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
    { sender: "ai", text: "こんにちは！旅行の計画についてお手伝いします。どこに行きたいですか？" },
  ]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { sender: "user", text: input };
    const updateMessages = [...messages, newMessage];
    setMessages(updateMessages);
    setInput("");

    try {
      // 1. ここに指示文（systemMessage）を定義！
      const systemMessage = {
        role: "system",
        content: [{ 
          type: "text", 
          text: `あなたは親しみやすくて優秀な旅行コンシェルジュです。
          以下のルールを守って回答してください：
          - ユーザーをワクワクさせるような明るい口調で話す（「～だよ！」「～だね！」）。
          - 予算が少なめの人にも優しい、コスパの良いプランを提案する。
          - 絵文字を適度に適度に使って親しみやすさを出す。
          - 分からないことは調べてから答える。`
        }],
      };

      // 2. 指示文を history の先頭に追加する
      const history = [
        systemMessage, // ← これを一番最初に入れるのがコツ！
        ...updateMessages.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: [{ type: "text", text: m.text }],
        })),
      ];

      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: history }),
      });

      const data: { reply: string } = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "⚠️ サーバーエラーだよ…" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ 接続できないみたい…😭" },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="page-container">
      <h1>AIチャット</h1>
      <div className="chat-container">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className="message-content">
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
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="メッセージを入力してください..."
          className="flex-1 border border-gray-600 bg-black text-white rounded-l-md p-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-r-md hover:opacity-80 transition shadow-lg font-bold tracking-wide"
        >
          SEND
        </button>
      </form>
    </div>
  );
}