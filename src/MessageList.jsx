import React, {Component} from 'react';
import Message from "./Message.jsx";
import ReactDOM from 'react-dom';

class MessageList extends Component {
  render() {
    return (
      <div>
        <main className="messages">
          <Message messages={this.props.messages} />
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