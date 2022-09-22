import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { collection,getDocs } from 'firebase/firestore';
import { db } from '../../Services';
import { useState,useEffect } from 'react';
import { Container,NavDropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import ProfileButton from '../ProfileButton/ProfileButton';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';





export const CompaniesContainer=()=>{
        const [companies,setCompanies]=useState([])
        const [loading,setLoading]=useState([])

        const getCompanies = async ()=>{ 
            const collectionRef=collection(db,'companies')
            const querySnapshot = await getDocs(collectionRef)
            const data =querySnapshot.docs.map(doc=>{
                return({id: doc.id ,...doc.data()})
            })
            return(data)
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
        }
        
        useEffect(()=>{
            getCompanies().then(response=>{
                setCompanies(response)    
            }).catch(error=>{
                console.log(error)
            }).finally(()=>{
                setLoading(false)
            })
        },[])

        if (loading){
            return <h1>Cargando Empresas...</h1>
        }else {
            return (
                <div>
                    <Navbar  bg="dark"  variant="dark">
                            <Container>
                            <ProfileButton/>  
                            <Nav className="me-auto">
                            <NavDropdown title="Menu" className='select' id="nav-dropdown">
                                    <NavDropdown.Item eventKey="4.1" as={Link} to={'/'}>Facturas</NavDropdown.Item>
                                    <NavDropdown.Item eventKey="4.2">Recibos</NavDropdown.Item>                            
                                    <NavDropdown.Item eventKey="4.3" as={Link} to={'/clientes'} >Clientes</NavDropdown.Item>
                                    <NavDropdown.Item eventKey="4.4" as={Link} to={'/empresas'}>Empresas</NavDropdown.Item>
                            </NavDropdown>
                            </Nav>
                            <Button variant='dark'>Agregar Empresa</Button>
                            <Button variant='dark'>Eliminar Empresa</Button>
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
                                            <th>Nombre</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {companies.map(customer=>
                                        <tr key={customer.id} >
                                            <td>{customer.name}</td>
                                        </tr>)}
                                    </tbody>
                        </Table>
                </div>
    )
}
}