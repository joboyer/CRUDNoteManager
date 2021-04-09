import React from 'react';
import NoteManager from '../NoteManager';

export default function App() {
  return (
    <div className="App">
      <NoteManager />
    </div>
  );
}

// import React, { Component } from "react";
// import "./App.css";

// class App extends Component {

//   state = {
//     notes: [],
//     currentNote: "",
//     noteEditing: null,
//     currentEdit: ""
//   };

//   componentDidMount() {
//     const json = localStorage.getItem("notes");
//     const notes = JSON.parse(json);
//     if (notes) {
//       this.setState(() => ({ notes }));
//     }
//   }

//   componentDidUpdate(prevProps, prevState) {
//     this.state.notes.forEach((note, index) => {
//       if (prevState.notes[index] !== note) {
//         const json = JSON.stringify(this.state.notes);
//         localStorage.setItem("notes", json);
//       }
//     });
//   }

//   addNote = () => {
//     let notes = [...this.state.notes];
//     if (this.state.noteEditing != null && typeof this.state.noteEditing === 'number') {
//       notes[this.state.noteEditing] = this.state.currentNote
//       this.setState({ notes, currentNote: "", noteEditing: null });
//       return
//     }
//     notes.push(this.state.currentNote);
//     this.setState({ notes, currentNote: "" });
//   };

//   deleteNote = indexToDelete => {
//     let notes = [...this.state.notes].filter(
//       (note, index) => index !== indexToDelete
//     );
//     this.setState({ notes });
//   };

//   setNoteEditing = index => {
//     // this.setState({ noteEditing: index, currentEdit: this.state.notes[index] });
//     this.setState({ noteEditing: index, currentNote: this.state.notes[index] });
//   };

//   editNote = event => {
//     this.setState({ currentEdit: event.target.value });
//   };

//   submitEdit = index => {
//     let notes = [...this.state.notes];
//     notes[index] = this.state.currentEdit;
//     this.setState({ notes, noteEditing: null });
//   };

//   render() {
//     return (
//       <div className="App">
//         <h1>
//           <textarea
//             onChange={event => this.setState({ currentNote: event.target.value })}
//             value={this.state.currentNote}
//             className="input"
//             placeholder="Notes"
//           />
//           <br />
//           <button className="button" onClick={this.addNote}>Submit</button>
//         </h1>
//         {this.state.notes.map((note, index) => (
//           <div className="notes" key={index} onClick={() => this.setNoteEditing(index)}>
//             <div className="note">
//               <div className="note-content">
//                 <div className="note-text">{note}</div>
//               </div>
//               <button onClick={() => this.deleteNote(index)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

// export default App;