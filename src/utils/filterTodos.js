/**
 * Filtra i TODO in base ai criteri specificati
 */
export function filterTodos(todos, filters) {
  if (!todos || todos.length === 0) return [];

  let filtered = [...todos];

  // Filter by completion status
  if (filters.showCompleted === false) {
    filtered = filtered.filter(todo => !todo.completed);
  }

  // Filter by priorities
  if (filters.priorities && filters.priorities.length > 0) {
    filtered = filtered.filter(todo => filters.priorities.includes(todo.priority));
  }

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(todo => {
      if (!todo.categories || todo.categories.length === 0) return false;
      return filters.categories.some(cat => todo.categories.includes(cat));
    });
  }

  // Filter by date range
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(todo => {
          const createdAt = todo.createdAt;
          return createdAt >= todayStart.getTime() && createdAt <= todayEnd.getTime();
        });
        break;

      case 'week':
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        filtered = filtered.filter(todo => todo.createdAt >= weekStart.getTime());
        break;

      case 'month':
        const monthStart = new Date();
        monthStart.setDate(1); // First day of month
        monthStart.setHours(0, 0, 0, 0);
        filtered = filtered.filter(todo => todo.createdAt >= monthStart.getTime());
        break;

      default:
        break;
    }
  }

  return filtered;
}

/**
 * Cerca TODO per titolo o descrizione
 */
export function searchTodos(todos, searchQuery) {
  if (!searchQuery || searchQuery.trim() === '') return todos;

  const query = searchQuery.toLowerCase().trim();

  return todos.filter(todo => {
    const titleMatch = todo.title.toLowerCase().includes(query);
    const descriptionMatch = todo.description?.toLowerCase().includes(query);
    const categoryMatch = todo.categories?.some(cat => cat.toLowerCase().includes(query));

    return titleMatch || descriptionMatch || categoryMatch;
  });
}
