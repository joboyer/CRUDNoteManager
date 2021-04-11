
import React, { Component } from "react";
import { Editor } from 'slate-react'
import { Value } from 'slate'
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import AppBarCp from '../AppBar';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import ArchiveIcon from '@material-ui/icons/Archive';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import './NoteManager.css';


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

class NoteManager extends Component {

    state = {
        notes: [],
        currentNote: "",
        noteEditing: null,
        currentEdit: "",
        value: initialValue,
        valueArray: [],
        classes: this.useStyle,
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

        if (!this.state.notes.length) {
            await localStorage.setItem("notes", []);
            await localStorage.removeItem("content")
        } else {
            await this.state.notes.forEach(async (note, index) => {
                if (prevState.notes[index] !== note && note !== "") {
                    const json = JSON.stringify(this.state.notes);
                    await localStorage.setItem("notes", json);
                }
            });
        }

        const valueArray = await JSON.stringify(this.state.valueArray);
        await localStorage.setItem("valueArray", valueArray);
    }

    deleteNote = indexToDelete => {
        let notes = [...this.state.notes].filter(
            (note, index) => index !== indexToDelete
        );
        let valueArray = [...this.state.valueArray].filter(
            (value, index) => index !== indexToDelete
        );
        this.setState({ notes, valueArray });
    };

    setNoteEditing = async (index) => {
        if (this.state.valueArray.length > 0) {
            const value = Value.fromJSON(this.state.valueArray[index])
            if (this.state.valueArray[index]) {
                await this.setState({ noteEditing: index, currentNote: this.state.notes[index], value: value });
            }
        }
    };

    saveNote = async () => {
        let notes = [...this.state.notes];
        let valueArray = [...this.state.valueArray];

        if (this.state.currentNote !== "") {
            if (this.state.noteEditing != null && typeof this.state.noteEditing === 'number') {
                notes[this.state.noteEditing] = this.state.currentNote
                valueArray[this.state.noteEditing] = this.state.value
                await this.setState({ notes: notes, valueArray: valueArray, currentNote: "" });
                return
            }
            await notes.push(this.state.currentNote);
            await valueArray.push(this.state.value);
            await this.setState({ notes: notes, valueArray: valueArray, currentNote: "", noteEditing: notes.length - 1 });
        }
    }

    addNewNote = () => {
        let notes = [...this.state.notes];
        let valueArray = [...this.state.valueArray];

        notes.push('A line of text in a paragraph.');
        valueArray.push(initialValue);
        const index = notes.length - 1
        const value = Value.fromJSON(valueArray[index])

        if (valueArray[index]) {
            this.setState({ noteEditing: index, currentNote: notes[index], value: value, notes: notes, valueArray: valueArray });
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
                <div className="sidebar scrollable">
                    <AppBarCp
                        title="Note Manager"
                    />
                    <BottomNavigation className="menu">
                        <BottomNavigationAction onClick={this.addNewNote} label="Recents" value="recents" icon={<LibraryAddIcon />} />
                    </BottomNavigation>
                    <div className="note-list">
                        {
                            this.state.notes.map((note, index) => (
                                // key={`${note}${index}`}
                                <ListItem button key={index} onClick={() => this.setNoteEditing(index)}>
                                    <ListItemIcon>
                                        <Button onClick={() => this.deleteNote(index)}>
                                            <DeleteIcon />
                                        </Button>
                                    </ListItemIcon>
                                    <ListItemText primary={note} />
                                </ListItem>
                            ))

                        }
                    </div>
                </div>

                <div className="content" onChange={event => this.setState({ currentNote: event.target.value })}>
                    <AppBarCp
                        title="Edit Note"
                    />
                    <Grid container alignItems="center" className="grid-option">
                        <Divider orientation="vertical" flexItem />
                        <Button onClick={() => { this.editor.toggleMark('bold') }}><FormatBoldIcon /></Button>
                        <Button onClick={() => { this.editor.toggleMark('italic') }}> <FormatItalicIcon /></Button>
                        <Button onClick={() => { this.editor.toggleMark('underline') }}><FormatUnderlinedIcon /></Button>
                        <Divider orientation="vertical" flexItem />
                        <Button onClick={this.saveNote} ><ArchiveIcon /></Button>

                    </Grid>
                    <div className="note-edit-container" onChange={event => this.setState({ currentNote: event.target.value })}>
                        <Paper elevation={0}>
                            <Editor
                                plugins={plugins}
                                value={this.state.value}
                                onChange={this.onChange}
                                renderMark={this.renderMark}
                                ref={editor => this.editor = editor}
                            />
                        </Paper>
                        <br />
                    </div>
                </div>
            </div >
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

export default NoteManager