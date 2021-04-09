import React, { Component } from 'react';

import './NoteListItem.css';

class NoteListItem extends Component {


  render() {
    return (
      <div className="note-info">
        <p className="note-snippet">{this.props.data}</p>
      </div>
    );
  }
}

export default NoteListItem