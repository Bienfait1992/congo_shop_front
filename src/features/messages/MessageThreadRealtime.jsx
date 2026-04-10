// import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import { api } from "../../shared/services/api";

// export default function MessageThreadFull({ otherUserId, currentUserId }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef(null);
//   const socketRef = useRef(null);
//   const [timers, setTimers] = useState({});

//   const scrollToBottom = () =>
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

//   // Récupération messages initiaux
//   useEffect(() => {
//     if (!otherUserId) return;
//     api.get(`/messages/conversation?userId=${otherUserId}`)
//       .then(res => {
//         setMessages(res.data);
//         const initTimers = {};
//         res.data.forEach(m => {
//           if (!m.isRead && m.receiverId === currentUserId) initTimers[m.id] = 300;
//         });
//         setTimers(initTimers);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [otherUserId, currentUserId]);

//   // Socket.io realtime
//   useEffect(() => {
//     socketRef.current = io(import.meta.env.VITE_SOCKET_URL);
//     socketRef.current.emit("join", currentUserId);

//     socketRef.current.on("new_message", (msg) => {
//       if (msg.senderId === otherUserId || msg.receiverId === otherUserId) {
//         setMessages(prev => [...prev, msg]);
//         if (!msg.isRead && msg.receiverId === currentUserId) {
//           setTimers(prev => ({ ...prev, [msg.id]: 300 }));
//         }
//         scrollToBottom();
//       }
//     });

//     return () => socketRef.current.disconnect();
//   }, [currentUserId, otherUserId]);

//   // Timer countdown pour chaque message non lu
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimers(prev => {
//         const updated = {};
//         Object.entries(prev).forEach(([id, t]) => {
//           if (t > 0) updated[id] = t - 1;
//         });
//         return updated;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleSend = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       const res = await api.post("/messages", {
//         receiverId: otherUserId,
//         message: newMessage
//       });
//       setMessages(prev => [...prev, res.data.data]);
//       setNewMessage("");
//       scrollToBottom();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const markAsRead = async (id) => {
//     try {
//       await api.patch(`/messages/${id}/read`);
//       setMessages(prev =>
//         prev.map(m => m.id === id ? { ...m, isRead: true } : m)
//       );
//       setTimers(prev => {
//         const copy = { ...prev };
//         delete copy[id];
//         return copy;
//       });
//     } catch (err) { console.error(err); }
//   };

//   return (
//     <div className="flex flex-col h-[500px] border rounded-lg bg-white shadow">
      
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-3 space-y-2">
//         {loading ? (
//           <p className="text-gray-500"></p>
//         ) : messages.length === 0 ? (
//           <p className="text-gray-400 text-center">Aucun message</p>
//         ) : (
//           messages.map(m => {
//             const isMine = m.senderId === currentUserId;
//             const timer = timers[m.id];
//             const isPromo = m.message.includes("PROMO");

//             return (
//               <div
//                 key={m.id}
//                 className={`flex ${isMine ? "justify-end" : "justify-start"}`}
//               >
//                 <div className={`relative max-w-[70%] px-3 py-2 rounded-xl 
//                   ${isMine ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} 
//                   ${isPromo ? "border-2 border-yellow-400" : ""}`}
//                 >
//                   {m.message}

//                   {/* Timer pour message non lu */}
//                   {!isMine && timer > 0 && (
//                     <span className="absolute top-[-16px] right-0 text-xs text-green-500">
//                       {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}
//                     </span>
//                   )}
//                 </div>

//                 {/* Meta info */}
//                 <div className="flex flex-col justify-end ml-2 text-xs text-gray-400">
//                   <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
//                   {!isMine && !m.isRead && (
//                     <button
//                       onClick={() => markAsRead(m.id)}
//                       className="text-red-500 hover:underline"
//                       title="Marquer comme lu"
//                     >
//                       vu
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="flex p-3 border-t gap-2">
//         <input
//           type="text"
//           placeholder="Écrire un message..."
//           value={newMessage}
//           onChange={e => setNewMessage(e.target.value)}
//           onKeyDown={e => e.key === "Enter" && handleSend()}
//           className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Envoyer
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useUserStore } from "../../app/store/userStore";

const SOCKET_URL = "http://localhost:3000";
const API_URL = "http://localhost:3000/api/messages";

export default function MessageThreadRealtime({ currentUserId, otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [unreadIds, setUnreadIds] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { token } = useUserStore();

  // ---------- Connexion Socket.io ----------
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
      });

      socketRef.current.on("connect", () =>
        console.log("✅ Socket connecté:", socketRef.current.id)
      );
      socketRef.current.on("disconnect", (reason) =>
        console.log("⚠️ Socket déconnecté:", reason)
      );

      // Nouveaux messages en temps réel
      // socketRef.current.on("new_message", (msg) => {
      //   if (msg.senderId === otherUserId || msg.receiverId === otherUserId) {
      //     setMessages((prev) => {
      //       if (prev.some((m) => m.id === msg.id)) return prev;
      //       return [...prev, msg].sort(
      //         (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      //       );
      //     });

      //     if (!msg.isRead && msg.senderId === otherUserId) {
      //       setUnreadIds((prev) => [...prev, msg.id]);
      //     }
      //   }
      // });
      socketRef.current.on("new_message", (msg) => {
  if (msg.senderId === otherUserId || msg.receiverId === otherUserId) {
    // Ajouter message
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });

    //Notification
    if (!msg.isRead && msg.senderId === otherUserId) {
      new Audio("/sounds/notification.mp3").play(); // son
      alert("Nouveau message de " + msg.sender.name); // popup simple
    }
  }
});

      socketRef.current.emit("register_message", currentUserId);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUserId, otherUserId]);

  // ---------- Récupérer les messages initiaux ----------
  useEffect(() => {
    if (!otherUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/conversation`, {
          params: { userId: otherUserId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const dataMessages = res.data?.messages || [];

        // Supprimer doublons et trier
        const uniqueMessages = Array.from(
          new Map(dataMessages.map((m) => [m.id, m])).values()
        ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setMessages(uniqueMessages);

        const newUnread = uniqueMessages
          .filter((m) => !m.isRead && m.senderId === otherUserId)
          .map((m) => m.id);
        setUnreadIds(newUnread);
      } catch (err) {
        console.error("❌ Erreur fetch messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [otherUserId, token]);

  // ---------- Auto-scroll ----------
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ---------- Marquer messages comme lus ----------
  useEffect(() => {
    if (unreadIds.length === 0) return;

    const markRead = async () => {
      try {
        await axios.patch(
          `${API_URL}/mark-read`,
          { ids: unreadIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadIds([]);
      } catch (err) {
        console.error("❌ Erreur mark-read:", err);
      }
    };

    markRead();
  }, [unreadIds, token]);

  // ---------- Envoyer un message ----------
  const handleSend = async () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;

    const payload = { receiverId: otherUserId, message: trimmedMessage };

    try {
      const res = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const newMsg = res.data.data || res.data;
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      });

      setMessageInput("");
    } catch (err) {
      console.error("❌ Erreur envoi message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // return (
  //   <div className="flex flex-col h-[500px] border rounded shadow bg-white">
  //     {/* Messages */}
  //     <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#FFFFFF]">
  //       {/* E5DDD5 */}
  //       {messages.map((msg, index) => (
  //         <div
  //           key={`${msg.id}_${index}`}
  //           className={`p-3 rounded-lg max-w-[70%] break-words relative
  //             ${
  //               msg.senderId === currentUserId
  //                 ? "bg-blue-100 text-black ml-auto"
  //                 : "bg-white text-black mr-auto"
  //             }`}
  //         >
  //           {msg.message}
  //           <span className="text-xs text-gray-400 absolute bottom-1 right-2">
  //             {new Date(msg.createdAt).toLocaleTimeString([], {
  //               hour: "2-digit",
  //               minute: "2-digit",
  //             })}
  //           </span>
  //         </div>
  //       ))}
  //       <div ref={messagesEndRef} />
  //     </div>

  //     {/* Input */}
  //     <div className="p-2 flex gap-2 border-t bg-gray-100">
  //       <input
  //         type="text"
  //         value={messageInput}
  //         onChange={(e) => setMessageInput(e.target.value)}
  //         onKeyPress={handleKeyPress}
  //         placeholder="Tapez un message..."
  //         className="flex-1 p-3 border rounded-full focus:outline-none focus:ring focus:border-blue-400"
  //       />
  //       <button
  //         onClick={handleSend}
  //         className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
  //       >
  //         Envoyer
  //       </button>
  //     </div>
  //   </div>
  // );

  return (
  <div className="fixed bottom-0 right-0 w-full md:w-[400px] h-[40vh] border rounded-t-lg shadow-lg bg-white flex flex-col">
    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#FFFFFF]">
      {messages.map((msg, index) => (
        <div
          key={`${msg.id}_${index}`}
          className={`p-3 rounded-lg max-w-[70%] break-words relative
            ${
              msg.senderId === currentUserId
                ? "bg-blue-100 text-black ml-auto"
                : "bg-white text-black mr-auto"
            }`}
        >
          {msg.message}
          <span className="text-xs text-gray-400 absolute bottom-1 right-2">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    <div className="p-2 flex gap-2 border-t bg-gray-100">
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Tapez un message..."
        className="flex-1 p-3 border rounded-full focus:outline-none focus:ring focus:border-blue-400"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Envoyer
      </button>
    </div>
  </div>
);
}