import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Services";
import Swal from "sweetalert2";
import { addDoc } from "firebase/firestore";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";

//cliente:"",empresa:"",estado:"Pendiente",fecha:Timestamp(Date),importe:0,montopago:0,numero:0,tipo:""
export const ReceiptForm = () => {
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState({
    cliente: "",
    empresa: "",
    fecha: "",
    importe: "",
    numero: "",
    tipo: "",
  });
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    const newValues = {
      ...receiptData,
      [name]: value,
    };
    setReceiptData({ ...newValues });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = receiptData;
    const dateToConvert = new Date();
    data.numero = parseInt(data.numero);
    dateToConvert.setMinutes(
      dateToConvert.getMinutes() + dateToConvert.getTimezoneOffset()
    );
    data.fecha = Timestamp.fromDate(dateToConvert);
    setReceiptData(data);
    const filteredReceipt = receipts.find(
      (receipt) => receipt.numero === receiptData.numero
    );
    if (filteredReceipt) {
      new MySwal({
        title: "El Numero de Recibo ya existe",
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
      })
        .then((result) => {
          navigate("/Nuevo-Recibo");
        })
        .finally();
    } else {
      // crear funcion para crear recibo agregando montopago y mandando la factura paga a la coleccion deletedBills
      addDoc(collection(db, "recibos"), receiptData).then((response) => {
        new MySwal({
          title: "El Recibo Se Genero Exitosamente!",
          text: "Factura N°: " + receiptData.numero,
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
        })
          .then((result) => {
            navigate("/Recibos");
          })
          .finally();
      });
    }
  };

  const getAccounts = async () => {
    const collectionRef = collection(db, "facturas");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  const getReceipts = async () => {
    const collectionRef = collection(db, "recibos");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  const getCompanies = async () => {
    const collectionRef = collection(db, "companies");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  const getCustomers = async () => {
    const collectionRef = collection(db, "clientes");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  useEffect(() => {
    getReceipts()
      .then((response) => {
        const toUpdateReceipts = response;
        toUpdateReceipts.sort((a, b) => {
          if (a.fecha > b.fecha) {
            return 1;
          }
          if (a.fecha < b.fecha) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        setReceipts(toUpdateReceipts);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getCustomers()
      .then((response) => {
        setCustomers(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    getCompanies()
      .then((response) => {
        setCompanies(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    getAccounts()
      .then((response) => {
        const toUpdate = response;
        toUpdate.forEach((doc) => {
          const today = new Date().toISOString();
          const fechadoc = doc.fecha.toDate().toISOString();
          const start = DateTime.fromISO(fechadoc);
          const end = DateTime.fromISO(today);
          const diffInDays = end.diff(start, "days");
          diffInDays.toObject();
          const { days } = diffInDays.values;
          if (days >= 30) {
            doc.estado = "Vencido";
          }
          setAccounts(toUpdate);
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <fieldset>
        <Form.Label>Cliente</Form.Label>
        <Form.Select
          required
          id="cliente"
          name="cliente"
          type="text"
          value={receiptData.cliente}
          onChange={handleChange}
          aria-label="Default select example"
        >
          <option value="">Ingrese Cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.name}>
              {customer.name}
            </option>
          ))}
        </Form.Select>
        <Form.Label value="">Ingrese Empresa</Form.Label>
        <Form.Select
          required
          aria-label="Default select example"
          id="empresa"
          name="empresa"
          type="text"
          value={receiptData.empresa}
          onChange={handleChange}
        >
          <option value="">Empresa</option>
          {companies.map((company) => (
            <option key={company.id} value={company.name}>
              {company.name}
            </option>
          ))}
        </Form.Select>
        {/* <Form.Group className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            required
            type="date"
            name="fecha"
            placeholder="Ingrese Fecha"
            id="fecha"
            value={new Date()}
            onChange={handleChange}
          />
        </Form.Group> */}
        <Form.Label>Numero de factura</Form.Label>
        <InputGroup className="mb-3" placeholder="Importe">
          <Form.Control
            required
            aria-label="Numero de Factura"
            type="number"
            placeholder="numero"
            id="numero"
            name="numero"
            value={receiptData.numero}
            onChange={handleChange}
          />
        </InputGroup>
        <Form.Label>Importe</Form.Label>
        <InputGroup className="mb-3" placeholder="Importe">
          <InputGroup.Text>$</InputGroup.Text>
          <Form.Control
            required
            aria-label="Importe"
            type="number"
            placeholder="Importe"
            id="importe"
            name="importe"
            value={receiptData.importe}
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
          value={receiptData.tipo}
          onChange={handleChange}
        >
          <option value="">Ingrese Tipo</option>
          <option value="Factura">Factura</option>
          <option value="Remito">Remito</option>
        </Form.Select>

        <Button type="submit" className="submitButton">
          Crear Recibo
        </Button>
        <Button as={Link} className="submitButton" to="/">
          Volver
        </Button>
      </fieldset>
    </Form>
  );
};
