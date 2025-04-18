import React, { Component } from 'react';
import './App.css';
import "./global-colors.css"
import TodoListWrapper from './TodoList-Wrapper.jsx';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

class App extends Component {
  render() {
    return (
      <div className="App">

        <div className="title">todos</div>

        <QueryClientProvider client={queryClient}>

          <TodoListWrapper />

        </QueryClientProvider>

      </div>
    );
  }
}

export default App;
