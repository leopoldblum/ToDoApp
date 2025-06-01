import TodoListWrapper from './TodoList-Wrapper.jsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Component } from 'react';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()


// handle dark mode on start
if (localStorage.getItem("theme") === null) {
  localStorage.setItem("theme", "light")
}
else if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}


class App extends Component {
  render() {
    return (
      <div className="flex justify-center min-h-screen min-w-0 bg-bg-lm text-text-lm text-center font-bold font-sans transition-all duration-200">

        <div className='w-9/10 lg:w-7/10 pb-20 lg:pb-50'>

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
