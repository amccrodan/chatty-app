import React, {Component} from 'react';

class Message extends Component {
  render() {
    const messages = this.props.messages;
    const messageItems = messages.map((message, index) => {
      if (message.type === "incomingMessage") {

        let newContent = [message.content];

        if (message.speech) {
          newContent = message.content.substring(5);
          if (index === messages.length - 1) {
            const utterance = new SpeechSynthesisUtterance(newContent);
            utterance.rate = 0.4;
            utterance.pitch = 5;
            window.speechSynthesis.speak(utterance);
          }
        }

        if (message.hasImages) {
          newContent = message.content.split(" ")

          newContent = newContent.map((item, index) => {
            if (item.match(/.+(\.png|\.jpg|\.gif)/)) {
              return ( <img key={index} className="message-image" src={item} />) ;
            }
            return item + " ";
          })
        }

        return (
          <div key={message.id} className="message">
            <span className="message-username" style={{color: message.colour}}>{message.username}</span>
            <span className="message-content">{newContent}</span>
          </div>
        );
      }
      if (message.type === "incomingNotification" ) {
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