import React, {Component} from 'react';
import Message from "./Message.jsx";
import ReactDOM from 'react-dom';

class MessageList extends Component {
  render() {

    const messages = this.props.messages;
    const messageItems = messages.map((message, index) => {
      if (message.type === "incomingMessage") {
        let newMessage = message;

        if (message.speech) {
          let speechContent = message.content.substring(5);
          newMessage.content = speechContent;

          const utterance = new SpeechSynthesisUtterance(speechContent);
          utterance.rate = 0.4;
          utterance.pitch = 2.5;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
          message.speech = false;
        }

        if (message.hasImages) {
          const contentArr = message.content.split(" ")

          newMessage.content = contentArr.map((item, index) => {
            if (item.match(/.+(\.png|\.jpg|\.gif)/)) {
              return ( <img key={index} className="message-image" src={item} />) ;
            }
            return item + " ";
          })

          message.hasImages = false;
        }

        return (
          <Message key={message.id} message={newMessage} />
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
      <div>
        <main className="messages">
          {messageItems}
        </main>
        <div style={ {float:"left", clear: "both"} }
          ref={(el) => { this.messagesEnd = el; }}>
        </div>
      </div>
    );
  }

  scrollToBottom() {
      const node = ReactDOM.findDOMNode(this.messagesEnd);
      node.scrollIntoView({behavior: "smooth"});
  }

  componentDidMount() {
      this.scrollToBottom();
  }

  componentDidUpdate() {
      this.scrollToBottom();
  }
}
export default MessageList;