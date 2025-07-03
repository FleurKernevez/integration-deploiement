import './App.css';
import React from 'react';
import FormComponent from './components/FormComponent/FormComponent';
import ListComponent from './components/ListComponent/ListComponent';
import AdminLoginForm from './components/AdminLoginForm/AdminLoginForm';
import Post from './components/Post/Post';

function App() {
  return (
    <div className="App">
      <h1>Connection Admin</h1>
      <AdminLoginForm/>
      <h1>Mon formulaire</h1>
      <FormComponent />
      <ListComponent />
      <Post />
    </div>
  );
}

export default App;
