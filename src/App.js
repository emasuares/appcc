
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ShowAccounts} from './Components/AccountContainer/AccountContainer'
import { CustomerContainer } from './Components/CustomersContainer/CustomersContainer';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {CompaniesContainer} from './Components/CompaniesContainer/CompaniesContainer'
import {BillForm} from './Components/BillForm/BillForm'
import {RemoveAccounts} from './Components/RemoveAccount/RemoveAccount'

function App() {
  return (
    <div className="App">  
    <BrowserRouter>
            <Routes>
              <Route path='/' element={<ShowAccounts/>}/>
              <Route path='/clientes' element={<CustomerContainer/>}></Route>
              <Route path='/empresas' element={<CompaniesContainer/>}></Route>
              <Route path='/Nueva-Factura' element={<BillForm/>}></Route>
              <Route path='/Eliminar-Factura' element={<RemoveAccounts/>}></Route>
            </Routes>
          </BrowserRouter>  
      
    </div>
  );
}

export default App;
