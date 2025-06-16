import React from 'react';
import styled from 'styled-components';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin: 8px 0;
  padding: 0 16px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 20px;
  background-color: ${props => props.isUser ? '#007AFF' : '#E9E9EB'};
  color: ${props => props.isUser ? 'white' : 'black'};
  position: relative;
  word-wrap: break-word;
`;

const Timestamp = styled.div<{ isUser: boolean }>`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <MessageContainer isUser={isUser}>
      <div>
        <MessageBubble isUser={isUser}>
          {message}
        </MessageBubble>
        {timestamp && (
          <Timestamp isUser={isUser}>
            {timestamp}
          </Timestamp>
        )}
      </div>
    </MessageContainer>
  );
};

export default ChatMessage;