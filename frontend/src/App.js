import './App.css';
import MediaQuery from 'react-responsive';

import HomePage from './components/HomePage'

function App() {
  return (
    <div className="App">
      <MediaQuery maxWidth={767}>
        <HomePage />
      </MediaQuery>
    </div>
  );
}

export default App;
