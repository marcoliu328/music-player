import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import DashBoard from './Dashboard'

const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return code ? <DashBoard code={code}/> : <Login/>
}

export default App;
