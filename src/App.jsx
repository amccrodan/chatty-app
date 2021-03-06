import React, {Component} from 'react';
import MessageList from "./MessageList.jsx";
import Chatbar from "./Chatbar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous", colour: "black"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      usersOnline: 0,
    };

    this.webSocket = null;
    // This binding is necessary to make `this` work in the callback
    this.updateUsername = this.updateUsername.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  updateUsername(newName) {
    const prevName = this.state.currentUser.name;
    this.setState({currentUser: {name: newName, colour: this.state.currentUser.colour}}, () => {
      this.webSocket.send(JSON.stringify(
        { type: "postNotification",
          content: `${prevName} has changed their name to ${this.state.currentUser.name}`
      }))
    });
  }

  addMessage(messageText) {
    const newMessage = {
      type: "postMessage",
      username: this.state.currentUser.name,
      content: messageText,
      colour: this.state.currentUser.colour,
      hasImages: false,
      speech: false
    };

    // check for images and add hasimages true to outgoing
    if (/\b.+(\.png|\.jpg|\.gif)\b/.test(messageText)) {
      newMessage.hasImages = true;
    };

    if (/^<say>\s.+/.test(messageText)) {
      newMessage.speech = true;
    };

    this.webSocket.send(JSON.stringify(newMessage));
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <span className="navbar-users">
            {this.state.usersOnline} Users Online
          </span>
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
      let messages = [];

      switch(incomingObj.type) {
        case "incomingMessage":
        case "incomingNotification":
          messages = this.state.messages.concat(incomingObj);
          this.setState({messages: messages});
          break;
        case "userCount":
          this.setState({usersOnline: incomingObj.content});
          break;
        case "userColour":
          this.setState({currentUser: { name: this.state.currentUser.name, colour: incomingObj.content}});
          break;
        default:
          console.log(`Unknown event type: ${incomingObj.type}`);
      }

    }
  }

}
export default App;
