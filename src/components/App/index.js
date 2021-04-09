import React from 'react';
import NoteManager from '../NoteManager';

export default function App() {
  return (
    <div className="App">
      <NoteManager />
    </div>
  );
}

// Import React!
// import React from 'react'
// import { Editor } from 'slate-react'
// import { Value } from 'slate'

// class App extends React.Component {
//   state = {
//     value: initialValue,
//   }

//   onChange = ({ value }) => {
//     if (value.document !== this.state.value.document) {
//       const content = JSON.stringify(value.toJSON())
//       localStorage.setItem('content', content)
//     }
//     this.setState({ value })
//   }

//   render() {
//     return (
//       <Editor
//         plugins={plugins}
//         value={this.state.value}
//         onChange={this.onChange}
//         renderMark={this.renderMark}
//       />
//     )
//   }

// }

// export default App;
