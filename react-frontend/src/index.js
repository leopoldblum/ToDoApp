import React from 'react';
import App from './App';
import { createRoot } from "react-dom/client"
import './index.css';

const rootId = document.getElementById('root')
const root = createRoot(rootId)
root.render(<App />)  