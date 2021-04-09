
import React, { Component } from "react";
import { Editor } from 'slate-react'
import { Value } from 'slate'
import NoteListItem from '../NoteListItem';
import Toolbar from '../Toolbar';
import './NoteManager.css';

function MarkHotkey(options) {
    const { type, key } = options

    return {
        onKeyDown(event, editor, next) {
            if (!event.ctrlKey || event.key !== key) return next()
            event.preventDefault()
            editor.toggleMark(type)
        },
    }
}

// Initialize a plugin for each mark...
const plugins = [
    MarkHotkey({ key: 'b', type: 'bold' }),
    MarkHotkey({ key: '`', type: 'code' }),
    MarkHotkey({ key: 'i', type: 'italic' }),
    MarkHotkey({ key: '~', type: 'strikethrough' }),
    MarkHotkey({ key: 'u', type: 'underline' }),
]

const existingValue = JSON.parse(localStorage.getItem('content'))
const initialValue = Value.fromJSON(
    existingValue || {
        document: {
            nodes: [
                {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [
                        {
                            object: 'text',
                            text: 'A line of text in a paragraph.',
                        },
                    ],
                },
            ],
        },
    }
)

class Messenger extends Component {

    state = {
        notes: [],
        currentNote: "",
        noteEditing: null,
        currentEdit: "",
        value: initialValue,
        valueArray: [],
    }

    componentDidMount = async () => {
        const json = localStorage.getItem("notes");

        const valueArray = JSON.parse(localStorage.getItem("valueArray"))
        const notes = JSON.parse(json);

        if (notes) {
            await this.setState({ notes });
        }

        if (valueArray) {
            await this.setState({ valueArray: valueArray });
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        await this.state.notes.forEach(async (note, index) => {
            if (prevState.notes[index] !== note && note !== "") {
                const json = JSON.stringify(this.state.notes);
                await localStorage.setItem("notes", json);
                const valueArray = JSON.stringify(this.state.valueArray);
                await localStorage.setItem("valueArray", valueArray);
            }
        });
    }

    deleteNote = indexToDelete => {
        let notes = [...this.state.notes].filter(
            (note, index) => index !== indexToDelete
        );
        this.setState({ notes });
    };

    setNoteEditing = async (index) => {
        const value = Value.fromJSON(this.state.valueArray[index])
        if (this.state.valueArray[index]) {
            await this.setState({ noteEditing: index, currentNote: this.state.notes[index], value: value });
        }
    };

    editNote = event => {
        this.setState({ currentEdit: event.target.value });
    }

    addNote = async () => {
        let notes = [...this.state.notes];
        let valueArray = [...this.state.valueArray];

        if (this.state.currentNote !== "") {
            if (this.state.noteEditing != null && typeof this.state.noteEditing === 'number') {
                notes[this.state.noteEditing] = this.state.currentNote
                valueArray[this.state.noteEditing] = this.state.value
                await this.setState({ notes: notes, valueArray: valueArray, currentNote: "", noteEditing: null });
                return
            }
            await notes.push(this.state.currentNote);
            await valueArray.push(this.state.value);
            await this.setState({ notes: notes, valueArray: valueArray, currentNote: "" });
        }
    }

    onChange = ({ value }) => {
        if (value.document !== this.state.value.document) {
            const content = JSON.stringify(value.toJSON())
            let data = JSON.parse(content)
            let line = ""
            data.document.nodes.map((node, index) => {
                if ((node.nodes[0].text && node.nodes[0].text != "") && line == "") {
                    line = node.nodes[0].text;

                }
            })
            this.setState({ value, currentNote: line })
            localStorage.setItem('content', content)
        }
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
                                        <i className="ti-close"></i>
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
                    <div className="note-edit-container" onChange={event => this.setState({ currentNote: event.target.value })}>
                        <h1>
                            <Editor
                                plugins={plugins}
                                value={this.state.value}
                                onChange={this.onChange}
                                renderMark={this.renderMark}
                            />
                            <br />
                            <button className="button" onClick={this.addNote}>Submit</button>
                        </h1>
                    </div>
                </div>
            </div>
        )
    }

    renderMark = (props, editor, next) => {
        switch (props.mark.type) {
            case 'bold':
                return <strong>{props.children}</strong>
            // Add our new mark renderers...
            case 'code':
                return <code>{props.children}</code>
            case 'italic':
                return <em>{props.children}</em>
            case 'strikethrough':
                return <del>{props.children}</del>
            case 'underline':
                return <u>{props.children}</u>
            default:
                return next()
        }
    }
}

export default Messenger