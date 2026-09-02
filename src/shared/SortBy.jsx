export default function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div className="sort-container" style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
      <div>
        <label htmlFor="sortBySelect" style={{ marginRight: '5px' }}>Sort by:</label>
        <select
          id="sortBySelect"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortDirectionSelect" style={{ marginRight: '5px' }}>Order:</label>
        <select
          id="sortDirectionSelect"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}