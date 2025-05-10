import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';

interface IntercomChatProps {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: number; // Unix timestamp in seconds
  };
}

const IntercomChat = ({ user }: IntercomChatProps) => {
  useEffect(() => {
    Intercom({
      app_id: 'iehbitzc',
      user_id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    });

    return () => {
      // Clean up Intercom when component unmounts
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, [user]);

  return null; // This component doesn't render anything
};

export default IntercomChat;