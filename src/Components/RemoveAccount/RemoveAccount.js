import { db } from "../../Services";
import { DateTime } from "luxon";
import {getDocs,collection,} from 'firebase/firestore'
import { useEffect,useState } from "react";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


export const RemoveAccounts=()=>{
    const [accounts,setAccounts]=useState([])
    const [loading,setLoading]=useState(true)

    const handleSubmit=()=>{

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
                            <tr key={account.id} >
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
                    <Button variant="primary" type="submit">Eliminar Facturas</Button>
                    </div>
    )
                        }
}



