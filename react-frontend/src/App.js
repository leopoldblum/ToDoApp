import React, { Component } from 'react';
// import './App.css';
import "./global-colors.css"
import TodoListWrapper from './TodoList-Wrapper.jsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "./output.css"


import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()



class App extends Component {
  render() {
    return (
      <div className="App pt-1/10 min-h-screen text-center bg-[#f6ebdc] text-[#d94355] font-bold">

        <div className="text-6xl font-extrabold m-auto p-3" > todos </div>

        <QueryClientProvider client={queryClient}>

          <ReactQueryDevtools initialIsOpen={false} />

          <TodoListWrapper />


        </QueryClientProvider>

      </div>
    );
  }
}

export default App;
