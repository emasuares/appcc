import { useState,useEffect } from "react"
import Table from 'react-bootstrap/Table';
import {getDocs,collection,} from 'firebase/firestore'
import { db } from "../../Services";
import { DateTime } from "luxon";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ProfileButton from "../ProfileButton/ProfileButton"



//obtengo los documentos de la coleccion facturas
const getAccounts = async ()=>{ 
    const collectionRef=collection(db,'facturas')
    const querySnapshot = await getDocs(collectionRef)
    const data =querySnapshot.docs.map(doc=>{
        return({id: doc.id ,...doc.data()})
    })
    return(data)
     }


//llamo a la funcion para traer los documentos de la coleccioon facturas y muestro si esta vencida una factura o no 
export const ShowAccounts = ()=>{
    const [resetAccount,setResetAccount]=useState([])
    const [customerFilter,setCustomerFilter]=useState("")
    const [companyFilter,setCompanyFilter]=useState("")
    const [typeFilter,setTypeFilter]=useState("")
    let filter1=""
    let filter2=""
    let filter3=""
    
    
    const HandleChange=(e)=>{
        let tofilter=resetAccount    
         switch(e.target.id){
            case "cliente": filter1=e.target.value
            setCustomerFilter(filter1)
            break;
            case "empresa": filter2=e.target.value
            setCompanyFilter(filter2)
            break;
            case "tipo": filter3=e.target.value
            setTypeFilter(filter3)
            break;
            default:console.log("ocurrio un problema")
        } 
            if (filter1!=="" || filter2!=="" || filter3!==""){
                const  filteredAccounts=tofilter.filter(account=>(
                    account.cliente.includes(customerFilter) &&
                    account.empresa.includes(companyFilter) &&
                    account.tipo.includes(typeFilter)
                ))
                console.log(filter1,filter2,filter3)
                setAccounts(filteredAccounts)
            }
            else if(filter1==="" && filter2==="" && filter3==="") {
                setAccounts(resetAccount)  
            }   
    }



    //filtrar y manejar cambios en los filtros
          const [total,setTotal]=useState(0)
        const HandleChange1=(e)=>{
            e.preventDefault()
            const tableReg = document.getElementById('datos');
            const searchText = e.target.value.toLowerCase(); 
            // Recorremos todas las filas con contenido de la tabla
            for (let i = 1; i < tableReg.rows.length; i++) {
                // Si el td tiene la clase "noSearch" no se busca en su cntenido
                if (tableReg.rows[i].classList.contains("noSearch")) {
                    continue;
                }
                let found = false;
                const cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                // Recorremos todas las celdas
                for (let j = 0; j < cellsOfRow.length && !found; j++) {
                    const compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                    // Buscamos el texto en el contenido de la celda
                    if (searchText.length === 0 || compareWith.indexOf(searchText) > -1) {
                        found = true;
                        setTotal(total+1)
                    }
                }
                if (found) {
                    tableReg.rows[i].style.display = '';
                } else {
                    // si no ha encontrado ninguna coincidencia, esconde la
                    // fila de la tabla
                    tableReg.rows[i].style.display = 'none';
                }
            }
            // mostramos las coincidencias
            const lastTR=tableReg.rows[tableReg.rows.length-1];
            lastTR.classList.remove("hide", "red");
            if (searchText === "") {
                lastTR.classList.add("hide");

            }  
 
        // mostrar las cuentas corrientes y cambiar si esta vencido o no  
        }
        const [accounts,setAccounts]=useState([])
        const [loading,setLoading]=useState(true)
        useEffect(()=>{
            getAccounts().then(response=>{
                const toUpdate=response
                toUpdate.forEach(doc=>{
                    const today =new Date().toISOString()
                    const fechadoc=doc.fecha.toDate().toISOString()
                    const start=DateTime.fromISO(fechadoc)
                    const end=DateTime.fromISO(today)
                    const diffInDays = end.diff(start, 'days');
                    diffInDays.toObject();
                    const {days}=diffInDays.values
                    if(days>=30){
                        doc.estado='Vencido'
                    }
                setAccounts(toUpdate)
                setResetAccount(toUpdate)
                })
            }).catch(error=>{
                console.log(error)
            }).finally(()=>{
                setLoading(false)
            })
        },[])
       
        

        if (loading){
            return <h1>Cargando Facturas...</h1>
        }else {
            return(
                <div>
                <Navbar  bg="dark"  variant="dark">
                    <Container>
                    <ProfileButton/>  
                    <Nav className="me-auto">
                    <NavDropdown title="Menu" className='select' id="nav-dropdown">
                        <NavDropdown.Item eventKey="4.1">Facturas</NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.2">Recibos</NavDropdown.Item>                            
                        <NavDropdown.Item eventKey="4.3">Clientes</NavDropdown.Item>
                        <NavDropdown.Item eventKey="4.4">Empresas</NavDropdown.Item>
                    </NavDropdown>
                    <Form.Select onChange={HandleChange} id='cliente' className='select'  aria-label="Default select example">
                        <option value="">Cliente</option>
                        <option value="Hakim">Hakim</option>
                        <option value="Lopez">Lopez</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.Select onChange={HandleChange} id='empresa' className='select'  aria-label="Default select example">
                        <option value="">Empresa</option>
                        <option value="Cremigal">Cremigal</option>
                        <option value="Sobrero y Cagnolo">Sobrero y Cagnolo</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    <Form.Select onChange={HandleChange} id='tipo' className='select' aria-label="Default select example">
                        <option value="">Tipo</option>
                        <option value="Factura">Factura</option>
                        <option value="Remito">Remito</option>
                    </Form.Select>
                    </Nav>
                    <Form onChange={HandleChange1}  className="d-flex">
                        <Form.Control
                        type="search"
                        placeholder="Buscar"
                        className="me-2"
                        aria-label="Search"
                        />
                    </Form>
                    </Container>
                </Navbar>
                <Table id="datos" variant="dark">
                        <thead className="noSearch">
                            <tr>
                                <th>Cliente</th>
                                <th>Empresa</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                                <th>Numero</th>
                                <th>Importe</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                        {accounts.map(account=>
                            <tr key={account.id} >
                                <td>{account.cliente}</td>
                                <td>{account.empresa}</td>
                                <td>{account.tipo}</td>
                                <td>{account.fecha.toDate().toLocaleDateString()}</td>
                                <td>{account.numero}</td>
                                <td>${account.importe}</td>
                                <td>{account.estado}</td>
                            </tr>)}
                        </tbody>
                    </Table>
                    </div>
                
    
                )    

        }

       
}
