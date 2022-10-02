import { db } from "../../Services";
import { DateTime } from "luxon";
import {getDocs,collection,doc,deleteDoc} from 'firebase/firestore'
import { useEffect,useState } from "react";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate,Link } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ProfileButton from "../ProfileButton/ProfileButton"



export const RemoveAccounts=()=>{

    const MySwal = withReactContent(Swal)
    const [accounts,setAccounts]=useState([])
    const [loading,setLoading]=useState(true)
    let toDelete=[]
    const navigate=useNavigate()
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

    const handleChange=(e)=>{
        const state=e.target.checked
        const value=e.target.value
        if (state===true){
            toDelete=[...toDelete,value]
            console.log(toDelete)
        }else{    
            var myIndex = toDelete.indexOf(e.target.value)
                toDelete.splice(myIndex, 1)
                console.log(toDelete)
        }
    }

    const deleteFromFirestore=async(id)=>{
        await deleteDoc(doc(db, "facturas",`${id}`)).then(()=>{  
            new MySwal({
                title: 'Se eliminaron las Facturas Seleccionadas',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
            }).then((result) => {
                navigate('/') 
            }).finally()
        }).catch((error)=>{
        console.log(error)
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        toDelete.forEach(element=>deleteFromFirestore(element))
    }

    const getAccounts = async ()=>{ 
        const collectionRef=collection(db,'facturas')
        const querySnapshot = await getDocs(collectionRef)
        const data =querySnapshot.docs.map(doc=>{
            return({id: doc.id ,...doc.data()})
        })
        return(data)
         }

         useEffect(()=>{
            getAccounts().then(response=>{
                const toUpdate=response
                toUpdate.sort((a, b)=> {
                    if (a.fecha > b.fecha) {
                      return 1;
                    }
                    if (a.fecha < b.fecha) {
                      return -1;
                    }
                    // a must be equal to b
                    return 0;
                  })
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
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                        {accounts.map(account=>
                            <tr key={account.id}  >
                                <td>{account.cliente}</td>
                                <td>{account.empresa}</td>
                                <td>{account.tipo}</td>
                                <td>{account.fecha.toDate().toLocaleDateString()}</td>
                                <td>{account.numero}</td>
                                <td>${account.importe}</td>
                                <td>{account.estado}</td>
                                <td><Form onSubmit={handleSubmit}>
                                        <div key={account.id} className="mb-3">
                                        <Form.Check 
                                            onChange={handleChange}
                                            type="switch"
                                            label="Eliminar"
                                            value={account.id}
                                        />
                                        </div>
                                        
                                    </Form>
                                </td>
                            </tr>)}
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={handleSubmit} type="submit">Eliminar Facturas</Button>
                    <Button as={Link} className='submitButton' to='/'>Volver</Button>
                    </div>
    )
                        }
}



