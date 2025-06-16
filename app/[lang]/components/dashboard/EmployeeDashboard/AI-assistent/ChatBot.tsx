import React from 'react';
import styled from 'styled-components';

interface ChatBotIconProps {
  messageCount?: number;
}

const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 1000;
`;

const ChatBotWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const SunBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #87CEEB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const BotIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #FFA500;
  border-radius: 50%;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #FFA500;
    border-radius: 50%;
    top: -10px;
    left: 10px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: white;
    border-radius: 50%;
    top: 15px;
    left: 15px;
  }
`;

const MessageBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #FF0000;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const ChatBotIcon: React.FC<ChatBotIconProps> = ({ messageCount }) => {
  return (
    <ChatBotContainer>
      <ChatBotWrapper>
        <SunBackground>
          <BotIcon />
        </SunBackground>
        {messageCount && messageCount > 0 && (
          <MessageBadge>{messageCount}</MessageBadge>
        )}
      </ChatBotWrapper>
    </ChatBotContainer>
  );
};

export default ChatBotIcon;