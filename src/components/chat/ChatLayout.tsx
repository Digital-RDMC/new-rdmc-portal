'use client';

// import { useState, useCallback } from 'react';
// import { ChatSidebar } from './ChatSidebar';
// import { ChatHeader } from './ChatHeader';
import ChatBot from './ChatBot';

// interface ChatSession {
//   id: string;
//   title: string;
//   lastMessage: string;
//   timestamp: Date;
//   messages: Array<{
//     id: string;
//     content: string;
//     role: 'user' | 'assistant';
//     timestamp: Date;
//   }>;
// }

export default function ChatLayout() {
//   const [sessions, setSessions] = useState<ChatSession[]>([
//     {
//       id: '1',
//       title: 'Getting Started',
//       lastMessage: 'Hello! How can I help you today?',
//       timestamp: new Date(),
//       messages: [
//         {
//           id: '1',
//           content: "Hello! I'm your AI assistant. How can I help you today?",
//           role: 'assistant',
//           timestamp: new Date(),
//         },
//       ],
//     },
//   ]);
//   const [currentSessionId, setCurrentSessionId] = useState('1');
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const currentSession = sessions.find(session => session.id === currentSessionId);

//   const handleNewChat = () => {
//     const newSession: ChatSession = {
//       id: Date.now().toString(),
//       title: 'New Chat',
//       lastMessage: 'Start a conversation...',
//       timestamp: new Date(),
//       messages: [
//         {
//           id: Date.now().toString(),
//           content: "Hello! I'm your AI assistant. How can I help you today?",
//           role: 'assistant',
//           timestamp: new Date(),
//         },
//       ],
//     };
//     setSessions(prev => [newSession, ...prev]);
//     setCurrentSessionId(newSession.id);
//   };

//   const handleDeleteSession = (sessionId: string) => {
//     setSessions(prev => prev.filter(session => session.id !== sessionId));
//     if (currentSessionId === sessionId && sessions.length > 1) {
//       const remainingSessions = sessions.filter(session => session.id !== sessionId);
//       setCurrentSessionId(remainingSessions[0]?.id || '');
//     }
//   };

//   const handleRenameSession = (sessionId: string, newTitle: string) => {
//     setSessions(prev => 
//       prev.map(session => 
//         session.id === sessionId 
//           ? { ...session, title: newTitle }
//           : session
//       )
//     );
//   };

//   const updateSessionMessages = useCallback((sessionId: string, messages: ChatSession['messages']) => {
//     setSessions(prev => 
//       prev.map(session => 
//         session.id === sessionId 
//           ? { 
//               ...session, 
//               messages,
//               lastMessage: messages[messages.length - 1]?.content || 'No messages',
//               timestamp: new Date()
//             }
//           : session
//       )
//     );
//   }, []);

//   const updateSessionTitle = useCallback((sessionId: string, title: string) => {
//     setSessions(prev => 
//       prev.map(session => 
//         session.id === sessionId 
//           ? { ...session, title }
//           : session
//       )
//     );
//   }, []);

  return (
    <div className="flex h-full relative">
      {/* Mobile Sidebar Overlay */}
      {/* {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}
      
      {/* Sidebar */}
      {/* <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed md:relative md:translate-x-0 z-50 md:z-auto
        transition-transform duration-200 ease-in-out
        h-full
      `}>
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={(sessionId) => {
            setCurrentSessionId(sessionId);
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }}
          onNewChat={() => {
            handleNewChat();
            setSidebarOpen(false); // Close sidebar on mobile after creating new chat
          }}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession}
        />
      </div> */}
      
      <div className="flex-1 flex flex-col md:ml-0">
        {/* <ChatHeader 
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={currentSession?.title}
        /> */}
        
        {/* {currentSession ? ( */}
          <ChatBot
            // key={currentSessionId}
            // initialMessages={currentSession.messages}
            // onMessagesChange={(messages) => updateSessionMessages(currentSessionId, messages)}
            // onTitleSuggestion={(title) => updateSessionTitle(currentSessionId, title)}
          />
        {/* ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">No chat selected</h2>
              <p className="text-muted-foreground mb-4">Create a new chat to get started</p>
              <button 
                onClick={handleNewChat}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
