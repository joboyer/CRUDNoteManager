
import React, { Component } from "react";
import NoteListItem from '../NoteListItem';
import Toolbar from '../Toolbar';
import './NoteManager.css';

class Messenger extends Component {

    state = {
        notes: [],
        currentNote: "",
        noteEditing: null,
        currentEdit: ""
    }

    componentDidMount = () => {
        const json = localStorage.getItem("notes");
        const notes = JSON.parse(json);
        if (notes) {
            this.setState({ notes });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.state.notes.forEach((note, index) => {
            if (prevState.notes[index] !== note && note !== "") {
                const json = JSON.stringify(this.state.notes);
                localStorage.setItem("notes", json);
            }
        });
    }

    deleteNote = indexToDelete => {
        let notes = [...this.state.notes].filter(
            (note, index) => index !== indexToDelete
        );
        this.setState({ notes });
    };

    setNoteEditing = index => {
        // this.setState({ noteEditing: index, currentEdit: this.state.notes[index] });
        this.setState({ noteEditing: index, currentNote: this.state.notes[index] });
    };

    editNote = event => {
        this.setState({ currentEdit: event.target.value });
    }

    refreshUser = () => {
        const json = localStorage.getItem("notes");
        const notes = JSON.parse(json);
        if (notes) {
            this.setState({ notes });
        }
    }

    addNote = async () => {
        let notes = [...this.state.notes];
        if (this.state.currentNote !== "") {
            if (this.state.noteEditing != null && typeof this.state.noteEditing === 'number') {
                notes[this.state.noteEditing] = this.state.currentNote
                await this.setState({ notes: notes, currentNote: "", noteEditing: null });
                return
            }
            await notes.push(this.state.currentNote);
            await this.setState({ notes: notes, currentNote: "" });
        }
    };

    onChange = () => {
        this.refreshUser()
    }

    render() {
        return (
            <div className="note-manager" >
                <div className="scrollable sidebar">
                    <div className="note-list">
                        <Toolbar
                            title="Note Manager"
                        />
                        {
                            this.state.notes.map((note, index) => (
                                <div className="note-list-item" key={index} onClick={() => this.setNoteEditing(index)}>
                                    <button className="note-photo" onClick={() => this.deleteNote(index)}>
                                        <i class="ti-close"></i>
                                    </button>
                                    < NoteListItem
                                        key={index}
                                        data={note}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="scrollable content" onChange={event => this.setState({ currentNote: event.target.value })}>
                    <Toolbar
                        title="Edit Note"
                    />
                    <div className="note-edit-container">
                        <h1>
                            <textarea
                                onChange={event => this.setState({ currentNote: event.target.value })}
                                value={this.state.currentNote}
                                placeholder="Notes"
                            />
                            <br />
                            <button className="button" onClick={this.addNote}>Submit</button>
                        </h1>
                    </div>
                </div>
            </div>
        )
    }
}

export default Messenger