import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import axios from "axios";
import "./App.css";
import { shipImages } from './shipImages';
import Detail from "./components/Detail/Detail";

function App() {
  const [ships, setShips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredShips, setFilteredShips] = useState([]);
 
  const [selectedShip, setSelectedShip] = useState(null);
  
  const [noResults, setNoResults] = useState(false);

  const history = useHistory();

  useEffect(() => {
    axios
      .get("https://swapi.dev/api/starships/")
      .then((res) => {
     
        setShips(res.data.results);
     
        setFilteredShips(res.data.results);
      })
      .catch((error) => {
        console.error("Veri alınırken bir hata oluştu.", error);
      });
  }, []);

  useEffect(() => {
    const results = ships.filter(
      (ship) =>
        ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ship.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredShips(results);
 
    setNoResults(results.length === 0);
  }, [ships, searchTerm]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value.toLowerCase(); 
    setSearchTerm(searchTerm);
    const results = ships.filter(
      (ship) =>
        ship.name.toLowerCase().includes(searchTerm) ||
        ship.model.toLowerCase().includes(searchTerm)
    );
    setFilteredShips(results); 
    setNoResults(results.length === 0); 
  };

  
  const handleShipSelect = (ship) => {
    setSelectedShip(ship);
    history.push("/detail"); 
  };

  return (
    <Router>
      <div>
        <div className="container">
          <div className="greeting">
            <img src={`/assets/Star-Wars.png`} alt="starwars png" />
            <div className="search">
              <h4>Name/Model</h4>
              <input
                type="text"
                placeholder="Name/Model"
                value={searchTerm}
                onChange={handleInputChange}
              />
              <hr />
            </div>
          </div>

          <section className="main">
            {noResults ? (
              <p>Gemi bulunamadı.</p>
            ) : (
              filteredShips.map((ship, index) => (
                <div key={index} className="content">
                  <img src={shipImages[ship.name]} alt="star ship img" />
                  <Link to="/detail">
                    <button onClick={() => handleShipSelect(ship)}>
                      {ship.name}
                    </button>
                  </Link>
                  <ul className="shipList">
                    <li>
                      <b>Model:</b> {ship.model}
                    </li>
                    <li>
                      <b>Hyperdrive Rating:</b> {ship.hyperdrive_rating}
                    </li>
                  </ul>
                </div>
              ))
            )}
          </section>
        </div>

        <Switch>
          <Route path="/detail">
            <Detail selectedShip={selectedShip} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
