import React, { Component } from 'react';
import './App.css';
import "./global-colors.css"
import TodoList from "./TodoList.js"


class App extends Component {
  render() {
    return (
      <div className="App">

        <div className="title">todos</div>

        <TodoList isFulfilled={false} />
        <TodoList isFulfilled={true} />

      </div>
    );
  }
}

export default App;
