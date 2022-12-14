import { getDocs, collection } from "firebase/firestore";
import { db } from "../../Services";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import ProfileButton from "../ProfileButton/ProfileButton";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

export const ReceiptContainer = () => {
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [resetAccount, setResetAccount] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [pays, setPays] = useState([]);
  const [payedAccounts, setPayedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cliente: "",
    empresa: "",
    tipo: "",
  });
  const [total, setTotal] = useState(0);

  const HandleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    const newValues = {
      ...filters,
      [name]: value,
    };
    setFilters({ ...newValues });
    console.log(filters);
  };

  const HandleChange1 = (e) => {
    e.preventDefault();
    const tableReg = document.getElementById("datos");
    const searchText = e.target.value.toLowerCase();
    // Recorremos todas las filas con contenido de la tabla
    for (let i = 1; i < tableReg.rows.length; i++) {
      // Si el td tiene la clase "noSearch" no se busca en su cntenido
      if (tableReg.rows[i].classList.contains("noSearch")) {
        continue;
      }
      let found = false;
      const cellsOfRow = tableReg.rows[i].getElementsByTagName("td");
      // Recorremos todas las celdas
      for (let j = 0; j < cellsOfRow.length && !found; j++) {
        const compareWith = cellsOfRow[j].innerHTML.toLowerCase();
        // Buscamos el texto en el contenido de la celda
        if (searchText.length === 0 || compareWith.indexOf(searchText) > -1) {
          found = true;
          setTotal(total + 1);
        }
      }
      if (found) {
        tableReg.rows[i].style.display = "";
      } else {
        // si no ha encontrado ninguna coincidencia, esconde la
        // fila de la tabla
        tableReg.rows[i].style.display = "none";
      }
    }
    // mostramos las coincidencias
    const lastTR = tableReg.rows[tableReg.rows.length - 1];
    lastTR.classList.remove("hide", "red");
    if (searchText === "") {
      lastTR.classList.add("hide");
    }
  };

  useEffect(() => {
    if (
      filters.cliente !== "" &&
      filters.empresa !== "" &&
      filters.tipo !== ""
    ) {
      //buscar por los tres filtros
      console.log("se busco por los tres filtros");
      const filteredAccounts = accounts.filter((account) => {
        if (
          account.cliente.includes(filters.cliente) &&
          account.empresa.includes(filters.empresa) &&
          account.tipo.includes(filters.tipo)
        ) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente !== "" &&
      filters.empresa === "" &&
      filters.tipo === ""
    ) {
      //buscar por cliente
      console.log("se busco por cliente");
      const filteredAccounts = accounts.filter((account) => {
        if (account.cliente.includes(filters.cliente)) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente === "" &&
      filters.empresa !== "" &&
      filters.tipo === ""
    ) {
      //busca por empresa
      console.log("se busco por empresa");
      const filteredAccounts = accounts.filter((account) => {
        if (account.empresa.includes(filters.empresa)) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente === "" &&
      filters.empresa === "" &&
      filters.tipo !== ""
    ) {
      //busca por tipo
      console.log("se busco por tipo");
      const filteredAccounts = accounts.filter((account) => {
        if (account.tipo.includes(filters.tipo)) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente !== "" &&
      filters.empresa !== "" &&
      filters.tipo === ""
    ) {
      //buscar por cliente y empresa
      console.log("se busco por cliente y empresa");
      const filteredAccounts = accounts.filter((account) => {
        if (
          account.cliente.includes(filters.cliente) &&
          account.empresa.includes(filters.empresa)
        ) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente !== "" &&
      filters.empresa === "" &&
      filters.tipo !== ""
    ) {
      //buscar por cliente y tipo
      console.log("se busco por cliente y tipo");
      const filteredAccounts = accounts.filter((account) => {
        if (
          account.cliente.includes(filters.cliente) &&
          account.tipo.includes(filters.tipo)
        ) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente === "" &&
      filters.empresa !== "" &&
      filters.tipo !== ""
    ) {
      //buscar por empresa y tipo
      console.log("se busco por empresa y tipo");
      const filteredAccounts = accounts.filter((account) => {
        if (
          account.empresa.includes(filters.empresa) &&
          account.tipo.includes(filters.tipo)
        ) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    }
  }, [filters]);

  /*  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      filters.cliente !== "" &&
      filters.empresa !== "" &&
      filters.tipo !== ""
    ) {
      //buscar por los tres filtros
      console.log("se busco por los tres filtros");
      const filteredAccounts = accounts.filter((account) => {
        if (
          account.cliente.includes(filters.cliente) &&
          account.empresa.includes(filters.empresa) &&
          account.tipo.includes(filters.tipo)
        ) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente !== "" &&
      filters.empresa === "" &&
      filters.tipo === ""
    ) {
      //buscar por cliente
      console.log("se busco por cliente");
      const filteredAccounts = accounts.filter((account) => {
        if (account.cliente.includes(filters.cliente)) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente === "" &&
      filters.empresa !== "" &&
      filters.tipo === ""
    ) {
      //busca por empresa
      console.log("se busco por empresa");
      const filteredAccounts = accounts.filter((account) => {
        if (account.empresa.includes(filters.empresa)) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente === "" &&
      filters.empresa === "" &&
      filters.tipo !== ""
    ) {
      //busca por tipo
      console.log("se busco por tipo");
      const filteredAccounts = accounts.filter((account) => {
        if (account.tipo.includes(filters.tipo)) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente !== "" &&
      filters.empresa !== "" &&
      filters.tipo === ""
    ) {
      //buscar por cliente y empresa
      console.log("se busco por cliente y empresa");
      const filteredAccounts = accounts.filter((account) => {
        if (
          account.cliente.includes(filters.cliente) &&
          account.empresa.includes(filters.empresa)
        ) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente !== "" &&
      filters.empresa === "" &&
      filters.tipo !== ""
    ) {
      //buscar por cliente y tipo
      console.log("se busco por cliente y tipo");
      const filteredAccounts = accounts.filter((account) => {
        if (
          account.cliente.includes(filters.cliente) &&
          account.tipo.includes(filters.tipo)
        ) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    } else if (
      filters.cliente === "" &&
      filters.empresa !== "" &&
      filters.tipo !== ""
    ) {
      //buscar por empresa y tipo
      console.log("se busco por empresa y tipo");
      const filteredAccounts = accounts.filter((account) => {
        if (
          account.empresa.includes(filters.empresa) &&
          account.tipo.includes(filters.tipo)
        ) {
          return true;
        } else return false;
      });
      setAccounts(filteredAccounts);
    }
  }; */

  const cleanFilters = () => {
    setAccounts(resetAccount);
  };

  //obtengo los documentos de la coleccion companies
  const getCompanies = async () => {
    const collectionRef = collection(db, "companies");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  //obtengo los documentos de la coleccion clientes
  const getCustomers = async () => {
    const collectionRef = collection(db, "clientes");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  //obtengo los documentos de la coleccion facturas
  const getAccounts = async () => {
    const collectionRef = collection(db, "facturas");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  //obtengo los documentos de la coleccion recibos
  const getReceipts = async () => {
    const collectionRef = collection(db, "recibos");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  //obtengo los documentos de la coleccion pagos
  const getPays = async () => {
    const collectionRef = collection(db, "pagos");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  //obtengo los documentos de la coleccion factpagas
  const getPayedAccounts = async () => {
    const collectionRef = collection(db, "factpagas");
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return data;
  };

  useEffect(() => {
    getAccounts()
      .then((response) => {
        const toUpdate = response;
        toUpdate.sort((a, b) => {
          if (a.fecha > b.fecha) {
            return 1;
          }
          if (a.fecha < b.fecha) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
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
          setResetAccount(toUpdate);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getCustomers()
      .then((response) => {
        setCustomers(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getCompanies()
      .then((response) => {
        setCompanies(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getPayedAccounts()
      .then((response) => {
        setPayedAccounts(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getPays()
      .then((response) => {
        setPays(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  if (loading) {
    return <h1>Cargando Recibos...</h1>;
  } else {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <ProfileButton />
            <Nav className="me-auto">
              <NavDropdown title="Menu" className="select" id="nav-dropdown">
                <NavDropdown.Item eventKey="4.1" as={Link} to={"/"}>
                  Facturas
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="4.2" as={Link} to={"/Recibos"}>
                  Recibos
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="4.3" as={Link} to={"/clientes"}>
                  Clientes
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="4.4" as={Link} to={"/empresas"}>
                  Empresas
                </NavDropdown.Item>
              </NavDropdown>
              <Form.Select
                onClick={HandleChange}
                id="cliente"
                name="cliente"
                className="select"
                aria-label="Default select example"
              >
                <option value="">Cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                onClick={HandleChange}
                id="empresa"
                name="empresa"
                className="select"
                aria-label="Default select example"
              >
                <option value="">Empresa</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                onClick={HandleChange}
                id="tipo"
                name="tipo"
                className="select"
                aria-label="Default select example"
              >
                <option value="">Tipo</option>
                <option value="Factura">Factura</option>
                <option value="Remito">Remito</option>
              </Form.Select>
              <Button variant="primary">Buscar</Button>
              <Button variant="danger" onClick={cleanFilters}>
                Limpiar Filtros
              </Button>
            </Nav>
            <Form onChange={HandleChange1} className="d-flex">
              <Form.Control
                type="search"
                placeholder="Buscar"
                className="me-2"
                aria-label="Search"
              />
            </Form>
            <Button variant="primary" as={Link} to={"/Nuevo-Recibo"}>
              {" "}
              Nuevo Recibo
            </Button>
            <Button variant="danger" as={Link} to={"/Eliminar-Recibo"}>
              {" "}
              Eliminar Recibo
            </Button>
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
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id}>
                <td>{receipt.cliente}</td>
                <td>{receipt.empresa}</td>
                <td>{receipt.tipo}</td>
                <td>{receipt.fecha.toDate().toLocaleDateString()}</td>
                <td>{receipt.numero}</td>
                <td>${receipt.importe}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
};
