
import TablePaginate from "./components/TablePaginate"
import './App.css';
import { useState,useEffect } from 'react';
import Footer from "./components/footer/Footer";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectFilter,setSelectFilter]= useState(true)
  const [search,setSearch]= useState("")
  const getCountries = async (API) => {
    await fetch(API)
      .then((res) => res.json())
      .then((res) => setCountries(res))
      .catch((err) => console.log(err))
  };
  useEffect(() => {
    getCountries("https://restcountries.com/v2/all");
  }, []);
  const handleSelect = (e) => {
    switch (e.target.value) {
      case "all":
        return setSelectFilter(true);
      case "capital":
        return setSelectFilter(false);
      default:
        break;
    }
  };
  return (
    <div className="App">
      <div class="form">
      <form action="" onChange={handleSelect}>
        <input type="search" name="search" id="search" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <select name="filterCountry" id="filterCountry">
          <option value="all">All</option>
          <option value="capital">Capital</option>
        </select>
      </form>
      </div>
      <TablePaginate countries={countries} selectFilter={selectFilter} search={search}/>
      <Footer/>
    </div>
  );
}

export default App;
