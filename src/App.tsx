import React from 'react';
import './App.scss';
import FormButton from './components/form-button/FormButton';
import FormInput from './components/form-input/FormInput';

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>

      <FormInput value="1" label="Email" layout="vertical"/>
      <FormButton text="Click Me!"/>

    </div>
  );
}

export default App;
