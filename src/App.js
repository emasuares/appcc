
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ShowAccounts} from './Components/AccountContainer/AccountContainer'
import { CustomerContainer } from './Components/CustomersContainer/CustomersContainer';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {CompaniesContainer} from './Components/CompaniesContainer/CompaniesContainer'
import {BillForm} from './Components/BillForm/BillForm'
import {RemoveAccounts} from './Components/RemoveAccount/RemoveAccount'
import {ReceiptContainer} from './Components/ReceiptContainer/ReceiptContainer'
import {ReceiptForm} from './Components/ReceiptForm/ReceiptForm'
import {RemoveReceipt} from './Components/RemoveReceipt/RemoveReceipt'

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
              <Route path='/Recibos' element={<ReceiptContainer/>}></Route>
              <Route path='/Nuevo-Recibo' element={<ReceiptForm/>}></Route>
              <Route path='/Eliminar-Recibo' element={<RemoveReceipt/>}></Route>
            </Routes>
          </BrowserRouter>  
      
    </div>
  );
}

export default App;
