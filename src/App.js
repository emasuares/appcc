
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ShowAccounts} from './Components/AccountContainer/AccountContainer'
import { CustomerContainer } from './Components/CustomersContainer/CustomersContainer';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {CompaniesContainer} from './Components/CompaniesContainer/CompaniesContainer'


function App() {
  return (
    <div className="App">  
    <BrowserRouter>
            <Routes>
              <Route path='/' element={<ShowAccounts/>}/>
              <Route path='/clientes' element={<CustomerContainer/>}></Route>
              <Route path='/empresas' element={<CompaniesContainer/>}></Route>
            </Routes>
          </BrowserRouter>  
      
    </div>
  );
}

export default App;
