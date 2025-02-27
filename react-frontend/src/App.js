import React, { Component } from 'react';
import './App.css';
import "./global-colors.css"
import TodoList from "./TodoList.js"


class App extends Component {
  render() {
    return (
      <div className="App">

        <div class="title">todos</div>

        <TodoList />

      </div>
    );
  }
}

export default App;
