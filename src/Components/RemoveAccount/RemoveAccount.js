import { db } from "../../Services";
import { DateTime } from "luxon";
import {getDocs,collection,doc,deleteDoc} from 'firebase/firestore'
import { useEffect,useState } from "react";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";




export const RemoveAccounts=()=>{
    const [accounts,setAccounts]=useState([])
    const [loading,setLoading]=useState(true)
    let toDelete=[]
    const navigate=useNavigate()

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
            console.log("Se borraron los documentos")
        }).catch((error)=>{
        console.log(error)
        }).finally(navigate('/'))
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
                    </div>
    )
                        }
}



