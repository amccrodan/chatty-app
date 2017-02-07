import React, {Component} from 'react';

class Message extends Component {
  render() {
    const messages = this.props.messages;
    const messageItems = messages.map((message) => {
      if (message.type === "incomingMessage") {
        return (
          <div key={message.id} className="message">
            <span className="message-username" style={{color: message.colour}}>{message.username}</span>
            <span className="message-content">{message.content}</span>
          </div>
        );
      } else {
        return (
          <div key={message.id} className="message system">
            <span className="message-content">{message.content}</span>
          </div>
        );
      }
    });

    return (
      <div>{messageItems}</div>
    );
  }
}
export default Message;