import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Removed FaBars since there's no reopen button

function App() {
  const [query, setQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Set to false if you want the sidebar hidden by default

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversations, currentConversationId]);

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    let newConversationId = currentConversationId;
    let updatedConversations = [...conversations];

    if (!currentConversationId) {
      newConversationId = Date.now().toString();
      updatedConversations.push({
        id: newConversationId,
        name: query.substring(0, 30),
        messages: [],
      });
    }

    const conversationIndex = updatedConversations.findIndex(
      (conv) => conv.id === newConversationId
    );
    const currentConversation = updatedConversations[conversationIndex];

    currentConversation.messages.push({ role: 'user', content: query });

    setConversations(updatedConversations);
    setCurrentConversationId(newConversationId);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        query: query,
      });

      setConversations((prevConversations) => {
        const updated = [...prevConversations];
        updated[conversationIndex].messages.push({
          role: 'bot',
          content: response.data.response,
        });
        return updated;
      });
    } catch (error) {
      console.error('Error communicating with the AI model:', error);
      setConversations((prevConversations) => {
        const updated = [...prevConversations];
        updated[conversationIndex].messages.push({
          role: 'bot',
          content: 'Sorry, there was an error processing your request.',
        });
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = (id) => {
    setCurrentConversationId(id);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );
  const currentMessages = currentConversation ? currentConversation.messages : [];

  return (
    <div className="h-screen bg-[#1a1a1a] dark:bg-[#1a1a1a] flex flex-col transition-colors duration-300 overflow-x-hidden font-sans">
      {/* Header (Empty) */}
      <header className="p-2 bg-[#2a2a2a] dark:bg-[#2a2a2a]"></header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-between overflow-hidden">
          {/* Chat Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 w-full max-w-[90%] overflow-y-auto p-4 flex flex-col items-center"
          >
            {/* Greeting and User Profile */}
            <div className="flex items-center gap-2 mb-4">
              {/* User Profile Circle */}
              <div className="w-12 h-12 bg-[#ff8c00] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">S</span>
              </div>
              <h2 className="text-lg font-medium text-gray-100 dark:text-white">
                Greetings, Sam
              </h2>
            </div>

            {/* Manas Circle with Image Background */}
            <div
              className={`${
                currentMessages.length > 0 ? 'w-16 h-16' : 'w-48 h-48'
              } relative rounded-full transition-all duration-500 mb-4 bg-cover bg-center`}
              style={{
                backgroundImage: `url(https://s3-alpha-sig.figma.com/img/a233/423c/b4ecd7d7d9f2c0a95df7bdd8bafe69ac?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oEj57u2K79r5g7M7HNma2DaqC44wz6-c2ek85Y4o-Myjb5WbYOJ7QWfbRAmY~OBKEPH9Gx00GrTlrjPGhAyIhZ9~MZA6iMeXg1QtFnGPSAB98xcjSUPWA9VHobmCyLMabklqyhF~D47BvaQXs1V6fbyK3D~L3qf3-MBd9vQofLJdLkIUoOlrwzDONooVaftSeGg2jQbVp8toM34BzYTqMbIS061vRNNLvaxwC2GmYm9v1a4DNvrzoL~HrGwYrW4xiKPPb82604pwyE7Tuxz8XfN-8HDNzXKQzTey2fb35IVtuUDPQhBrsB2jrGX0UcQPNxVwz3nEfZHu5VV6FGZoWA__)`,
              }}
            ></div>

            {/* Chat Messages */}
            {currentMessages.length > 0 ? (
              currentMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } w-full max-w-md mb-2`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-[#10a37f] text-white'
                        : 'bg-[#444654] text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            ) : null}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="text-gray-400 text-sm text-center">
                AI is thinking...
              </div>
            )}
          </div>

          {/* Input and Button */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[90%] p-4 flex items-center space-x-3"
          >
            <div className="w-6 h-6 bg-[#ff8c00] rounded-full"></div>
            <input
              type="text"
              placeholder="Type your message..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 bg-[#40414F] dark:bg-[#40414F] border border-[#4D4D4D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00] text-gray-100 placeholder-gray-400 shadow-md"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-3 bg-[#40414F] dark:bg-[#40414F] text-white rounded-lg hover:bg-[#4D4D4D] transition shadow-md"
              disabled={isLoading}
            >
              ➤
            </button>
          </form>
        </div>

        {/* Sidebar (Chat History) with Hamburger Menu */}
        <aside
          className={`${
            isSidebarOpen ? 'w-56' : 'w-0'
          } bg-[#202123] dark:bg-[#202123] border-l border-[#4D4D4D] p-3 flex-shrink-0 overflow-y-auto transform transition-all duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Hamburger Menu Button (Only visible when sidebar is open) */}
          {isSidebarOpen && (
            <div className="flex justify-end mb-2">
              <button
                onClick={toggleSidebar}
                className="p-2 bg-[#343541] dark:bg-[#343541] rounded-full hover:bg-[#4D4D4D] transition text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200 dark:text-gray-100">
              Chat History
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={startNewConversation}
                className="p-2 bg-[#343541] dark:bg-[#343541] rounded-full hover:bg-[#4D4D4D] transition text-gray-200"
              >
                ⟳
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-[#343541] dark:bg-[#343541] rounded-full hover:bg-[#4D4D4D] transition text-gray-200"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button className="p-2 bg-[#ff8c00] rounded-full hover:bg-[#e07b00] transition">
                {/* Placeholder for additional button */}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`p-3 bg-[#343541] dark:bg-[#343541] rounded-lg text-gray-200 text-sm hover:bg-[#4D4D4D] transition cursor-pointer ${
                    conv.id === currentConversationId ? 'bg-[#4D4D4D]' : ''
                  } truncate`}
                >
                  {conv.name}
                </div>
              ))
            ) : (
              <p className="text-gray-400 dark:text-gray-400 text-sm text-center">
                No chats yet
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;