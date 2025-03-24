import React, { Component } from 'react';
import './App.css';
import "./global-colors.css"
import TodoListWrapper from './TodoList-Wrapper.js';


class App extends Component {
  render() {
    return (
      <div className="App">

        <div className="title">todos</div>

        {/* insert add button here, hella refactoring tho */}

        <TodoListWrapper />

      </div>
    );
  }
}

export default App;
