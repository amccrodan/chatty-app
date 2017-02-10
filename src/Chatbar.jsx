import React, {Component} from 'react';

class Chatbar extends Component {
  constructor(props) {
    super(props);
    this.handleUsernameKeyUp = this.handleUsernameKeyUp.bind(this);
    this.handleMessageKeyUp = this.handleMessageKeyUp.bind(this);
  }

  handleUsernameKeyUp (event) {
    if(event.keyCode === 13) {
      this.props.updateUsername(event.target.value);
    }
  }

  handleMessageKeyUp (event) {
    if(event.keyCode === 13) {
      this.props.addMessage(event.target.value);
      event.target.value = "";
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          placeholder="Your Name (Optional)"
          defaultValue={this.props.currentUser}
          onKeyUp={this.handleUsernameKeyUp}/>
        <input
          className="chatbar-message"
          placeholder="Type a message and hit ENTER"
          onKeyUp={this.handleMessageKeyUp}/>
      </footer>
    );
  }
}
export default Chatbar;