import React, { Component } from 'react';
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
      <div className="flex justify-center min-h-screen min-w-300 text-center bg-[#f6ebdc] text-[#d94355] font-bold font-sans">

        <div className='w-7/10'>

          <QueryClientProvider client={queryClient}>

            <ReactQueryDevtools initialIsOpen={false} />

            <TodoListWrapper />


          </QueryClientProvider>
        </div>


      </div >
    );
  }
}

export default App;
