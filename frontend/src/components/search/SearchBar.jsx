import React, { useState, useEffect } from "react";
import {CiSearch} from "react-icons/ci";
import axios from "axios";
import "../../css/search/SearchBar.css";

const SearchBar = ({setSearchSongs}) => {
  const [query, setQuery] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
if (!query || !query.trim()) {
    if (typeof setSearchSongs === "function")setSearchSongs([]);
    return;
}
const fetchSongs = async () => {
    try {
        setLoading(true);
        const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/songs/playListByTag/${encodeURIComponent(query)}`);

        setSearchSongs(res.data.results || []);
    } catch (error) {
        console.error("Server Error Details:", error.response?.data || error.message);
        setSearchSongs([]);
    } finally {
        setLoading(false);
    }
};

const timer = setTimeout(() => {
    fetchSongs();
  }, 500); 

  return () => clearTimeout(timer); 
}, [query,setSearchSongs]);

  return (
   <div className="searchbar-root">
  <div className="searchbar-input-wrapper">
    <input 
      className="searchbar-input"
      type="text"
      placeholder="Search songs ..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      autoFocus
    />
    <CiSearch className="searchbar-icon" size={20} />
  </div>
  {!query && !loading && (
    <p className="searchbar-empty">Search songs to display</p>
  )}
  {loading && <p className="searchbar-loading">Searching ...</p>}
</div>
  );
};



export default SearchBar;
