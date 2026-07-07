function SearchBar({ searchTerm, setSearchTerm }) {

    return (

        <div className="search-box">

            <input
                type="text"
                placeholder="Search Report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

        </div>

    );

}

export default SearchBar;