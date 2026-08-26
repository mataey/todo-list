export default function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className="filter-container" style={{ marginBottom: '15px' }}>
      <label htmlFor="filterInput" style={{ marginRight: '5px' }}>Search todos:</label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
      />
    </div>
  );
}