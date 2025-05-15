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
      <div className="flex justify-center pt-1/10 min-h-screen text-center bg-[#f6ebdc] text-[#d94355] font-bold">

        <div className='w-7/10'>

          <div className='bg-cyan-800/75 flex flex-row items-end'>

            <div className="text-6xl font-extrabold p-3 text-left"> todos </div>
            <div className="text-s font-extrabold p-3 text-left"> nightmode </div>
            <div className="text-s font-extrabold p-3 text-left"> add </div>
            <div className="text-s font-extrabold p-3 text-left"> undo </div>

          </div>


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
