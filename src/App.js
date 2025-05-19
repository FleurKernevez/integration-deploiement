import './App.css';
import React from 'react';
import FormComponent from './components/FormComponent/FormComponent';
import ListComponent from './components/ListComponent/ListComponent';

function App() {
  return (
    <div className="App">
      <h1>Mon formulaire</h1>
      <FormComponent />
      <ListComponent />
    </div>
  );
}

export default App;
