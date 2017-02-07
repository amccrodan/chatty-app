import React, {Component} from 'react';
import MessageList from "./MessageList.jsx";
import Chatbar from "./Chatbar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };

    this.webSocket = null;
    // This binding is necessary to make `this` work in the callback
    this.updateUsername = this.updateUsername.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  updateUsername(event) {
    if(event.keyCode === 13) {
      const prevName = this.state.currentUser.name;
      this.setState({currentUser: {name: event.target.value}} );
      this.webSocket.send(JSON.stringify(
        { type: "postNotification",
          content: `${prevName} has changed their name to ${this.state.currentUser.name}`
        }))
    }
  }

  addMessage(event) {
    if(event.keyCode === 13) {
      const newMessage = {
        type: "postMessage",
        username: this.state.currentUser.name,
        content: event.target.value };

      this.webSocket.send(JSON.stringify(newMessage));

      event.target.value = "";
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages} />
        <Chatbar
          currentUser={this.state.currentUser.name}
          updateUsername={this.updateUsername}
          addMessage={this.addMessage} />
      </div>
    );
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.webSocket = new WebSocket("ws://localhost:4000");
    console.log("Connected to server");

    this.webSocket.onmessage = (event) => {
      const incomingObj = JSON.parse(event.data);
      let newIncomingMsg = {};
      let messages = [];

      switch(incomingObj.type) {
        case "incomingMessage":
          newIncomingMsg = {
            id: incomingObj.id,
            username: incomingObj.username,
            content: incomingObj.content
          }
          messages = this.state.messages.concat(newIncomingMsg);
          this.setState({messages: messages});
          break;
        case "incomingNotification":
          newIncomingMsg = {
            id: incomingObj.id,
            content: incomingObj.content
          }
          messages = this.state.messages.concat(newIncomingMsg);
          this.setState({messages: messages});
          break;
        default:
          console.log(`Unknown event type: ${incomingObj.type}`);
      }
    }
  }

}
export default App;
