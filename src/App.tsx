import React from 'react';
import './App.scss';
import FormInput from './components/form-input/FormInput';

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>

      <FormInput value="1" label="Email" layout="vertical"/>
      
    </div>
  );
}

export default App;
