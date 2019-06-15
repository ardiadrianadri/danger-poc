import React from 'react';
import logo from './logo.svg';
import { HelloWorld } from './hello-world';
import './App.css';

/**
 * Main component
 * @function
 * @returns
 */
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <HelloWorld></HelloWorld>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
