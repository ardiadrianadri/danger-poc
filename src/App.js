import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HelloWorld } from './hello-world';

/**
 * Main component
 * @function
 * @return JSX template
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
