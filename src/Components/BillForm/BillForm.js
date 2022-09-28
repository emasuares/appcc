import '../BillForm/BillForm.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState , useEffect } from 'react';
import { collection,getDocs } from 'firebase/firestore';
import { db } from '../../Services';
import Swal from 'sweetalert2'
import { addDoc } from 'firebase/firestore';
import withReactContent from 'sweetalert2-react-content'
import { Link, useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { DateTime } from "luxon";




//cliente:"",empresa:"",estado:"Pendiente",fecha:Timestamp(Date),importe:0,montopago:0,numero:0,tipo:""
export const BillForm=()=> {
    const [customers,setCustomers]=useState([])
    const [companies,setCompanies]=useState([])
    const [accounts,setAccounts]=useState([])
    const [billData,setBilldata]=useState({cliente:"",empresa:"",fecha:"",estado:"Pendiente",importe:"",montopago:0,numero:"",tipo:""})
    const MySwal = withReactContent(Swal)
    const navigate=useNavigate()



    const handleChange=(e)=> { 
        const { target } = e;
       const { name, value } = target; 
        const newValues = {
         ...billData,
         [name]: value,
       }; 
       setBilldata({...newValues});
     }


    const handleSubmit =(e)=>{
        e.preventDefault()
        const databill=billData
        const dateToConvert=new Date(databill.fecha)
        databill.numero=parseInt(databill.numero)
        dateToConvert.setMinutes(dateToConvert.getMinutes() + dateToConvert.getTimezoneOffset())
        databill.fecha=Timestamp.fromDate(dateToConvert)
        setBilldata(databill)
        const filteredaccount=accounts.find(account=>account.numero===billData.numero)
           if(filteredaccount){
            new MySwal({
                title: 'El Numero de Factura ya existe',
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
            }).then((result) => {
                navigate('/Nueva-Factura') 
            }).finally()
           } else{
            addDoc(collection(db,'facturas'),billData).then(response=>{
            new MySwal({
              title: 'La Factura se ha Generado Exitosamente!',
              text: "Factura N°: "+billData.numero,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
            }).then((result) => {
                  navigate('/') 
            }).finally()
            })
        }
    }
    
    const getAccounts = async ()=>{ 
        const collectionRef=collection(db,'facturas')
        const querySnapshot = await getDocs(collectionRef)
        const data =querySnapshot.docs.map(doc=>{
            return({id: doc.id ,...doc.data()})
        })
        return(data)
         }

    const getCompanies = async ()=>{ 
        const collectionRef=collection(db,'companies')
        const querySnapshot = await getDocs(collectionRef)
        const data =querySnapshot.docs.map(doc=>{
            return({id: doc.id ,...doc.data()})
        })
        return(data)
         }
    
    const getCustomers = async ()=>{ 
        const collectionRef=collection(db,'clientes')
        const querySnapshot = await getDocs(collectionRef)
        const data =querySnapshot.docs.map(doc=>{
            return({id: doc.id ,...doc.data()})
        })
        return(data)
         }

    useEffect(()=>{
        getCustomers().then(response=>{
            setCustomers(response)    
        }).catch(error=>{
            console.log(error)
        }).finally(()=>{
        })
    },[])

    useEffect(()=>{
        getCompanies().then(response=>{
            setCompanies(response)    
        }).catch(error=>{
            console.log(error)
        }).finally(()=>{
        })
    },[])

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
        })
    },[])



  return (
    <Form onSubmit={handleSubmit}>
      <fieldset>
        <Form.Label>Cliente</Form.Label>
        <Form.Select 
            required
            id="cliente"
            name="cliente"
            type="text"
            value={billData.cliente}
            onChange={handleChange} aria-label="Default select example">
            <option value="">Ingrese Cliente</option>
            {customers.map(customer=><option key={customer.id} value={customer.name}>{customer.name}</option>)}
        </Form.Select>
        <Form.Label value="">Ingrese Empresa</Form.Label>
        <Form.Select 
            required
            aria-label="Default select example"
            id="empresa"
            name="empresa"
            type="text"
            value={billData.empresa}
            onChange={handleChange}>
            <option value="">Empresa</option>
            {companies.map(company=><option key={company.id} value={company.name}>{company.name}</option>)}
        </Form.Select>
        <Form.Group className="mb-3" >
        <Form.Label>Fecha</Form.Label>
        <Form.Control
        required
        type="date" 
        name="fecha"
        placeholder="Ingrese Fecha"
        id="fecha"
        value={billData.fecha}
        onChange={handleChange}
          />
        </Form.Group>
        <Form.Label>Numero de factura</Form.Label>
        <InputGroup className="mb-3" placeholder='Importe'>
        <Form.Control
        required 
        aria-label="Numero de Factura"
        type="number" 
        placeholder="numero"
        id="numero"
        name="numero"
        value={billData.numero}
        onChange={handleChange}
         />
        </InputGroup>
        <Form.Label>Importe</Form.Label>
        <InputGroup className="mb-3" placeholder='Importe'>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control 
        required
        aria-label="Importe"
        type="number" 
        placeholder="Importe"
        id="importe"
        name="importe"
        value={billData.importe}
        onChange={handleChange}
         />
        </InputGroup>
        <Form.Label>Tipo</Form.Label>
        <Form.Select 
            required
            aria-label="Default select example"
            type="text" 
            id="tipo"
            name="tipo"
            value={billData.tipo}
            onChange={handleChange}
            >
            <option value="">Ingrese Tipo</option>
            <option value="Factura">Factura</option>
            <option value="Remito">Remito</option>
        </Form.Select>
        
        <Button type="submit" className='submitButton' >Crear Factura</Button>
        <Button as={Link} className='submitButton' to='/'>Volver</Button>
        
      </fieldset>
    </Form>
  )
  }







