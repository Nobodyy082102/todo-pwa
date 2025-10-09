// Advanced Export Utilities

// Export to CSV
export function exportToCSV(todos) {
  const headers = ['Titolo', 'Descrizione', 'Priorità', 'Categorie', 'Completato', 'Data Creazione', 'Data Completamento'];
  const csvRows = [headers.join(',')];

  todos.forEach(todo => {
    const row = [
      `"${todo.title?.replace(/"/g, '""') || ''}"`,
      `"${todo.description?.replace(/"/g, '""') || ''}"`,
      todo.priority || 'medium',
      `"${todo.categories?.join('; ') || ''}"`,
      todo.completed ? 'Sì' : 'No',
      todo.createdAt ? new Date(todo.createdAt).toLocaleString('it-IT') : '',
      todo.completedAt ? new Date(todo.completedAt).toLocaleString('it-IT') : '',
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// Export to Markdown
export function exportToMarkdown(todos) {
  let markdown = `# Task Manager - Export\n\n`;
  markdown += `Esportato il: ${new Date().toLocaleString('it-IT')}\n\n`;
  markdown += `Totale task: ${todos.length}\n`;
  markdown += `Completati: ${todos.filter(t => t.completed).length}\n\n`;

  markdown += `---\n\n`;

  // Group by status
  const pending = todos.filter(t => !t.completed);
  const completed = todos.filter(t => t.completed);

  if (pending.length > 0) {
    markdown += `## 📋 Task Attivi (${pending.length})\n\n`;
    pending.forEach(todo => {
      markdown += `### ${todo.title}\n\n`;
      if (todo.description) markdown += `${todo.description}\n\n`;
      markdown += `- **Priorità**: ${getPriorityLabel(todo.priority)}\n`;
      if (todo.categories && todo.categories.length > 0) {
        markdown += `- **Categorie**: ${todo.categories.join(', ')}\n`;
      }
      if (todo.createdAt) {
        markdown += `- **Creato**: ${new Date(todo.createdAt).toLocaleDateString('it-IT')}\n`;
      }
      markdown += `\n---\n\n`;
    });
  }

  if (completed.length > 0) {
    markdown += `## ✅ Task Completati (${completed.length})\n\n`;
    completed.forEach(todo => {
      markdown += `### ~~${todo.title}~~\n\n`;
      if (todo.description) markdown += `${todo.description}\n\n`;
      markdown += `- **Priorità**: ${getPriorityLabel(todo.priority)}\n`;
      if (todo.completedAt) {
        markdown += `- **Completato**: ${new Date(todo.completedAt).toLocaleDateString('it-IT')}\n`;
      }
      markdown += `\n---\n\n`;
    });
  }

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-${new Date().toISOString().split('T')[0]}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

// Export to iCalendar (.ics) - Only tasks with reminders
export function exportToICS(todos) {
  const tasksWithReminders = todos.filter(t => t.reminder && !t.completed);

  if (tasksWithReminders.length === 0) {
    alert('Nessun task con promemoria da esportare');
    return;
  }

  let ics = 'BEGIN:VCALENDAR\n';
  ics += 'VERSION:2.0\n';
  ics += 'PRODID:-//Task Manager//EN\n';
  ics += 'CALSCALE:GREGORIAN\n';
  ics += 'METHOD:PUBLISH\n';

  tasksWithReminders.forEach(todo => {
    const uid = `task-${todo.id}@taskmanager.local`;
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    ics += 'BEGIN:VTODO\n';
    ics += `UID:${uid}\n`;
    ics += `DTSTAMP:${now}\n`;
    ics += `SUMMARY:${todo.title}\n`;

    if (todo.description) {
      ics += `DESCRIPTION:${todo.description.replace(/\n/g, '\\n')}\n`;
    }

    if (todo.reminder.type === 'specific' && todo.reminder.datetime) {
      const dueDate = new Date(todo.reminder.datetime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      ics += `DUE:${dueDate}\n`;
    }

    ics += `PRIORITY:${getPriorityNumber(todo.priority)}\n`;
    ics += `STATUS:NEEDS-ACTION\n`;

    if (todo.categories && todo.categories.length > 0) {
      ics += `CATEGORIES:${todo.categories.join(',')}\n`;
    }

    ics += 'END:VTODO\n';
  });

  ics += 'END:VCALENDAR\n';

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-${new Date().toISOString().split('T')[0]}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

// Export to PDF (using HTML-to-canvas approach)
export function exportToPDF(todos) {
  // Create a printable HTML page
  const printWindow = window.open('', '', 'width=800,height=600');

  const pending = todos.filter(t => !t.completed);
  const completed = todos.filter(t => t.completed);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Task Manager - Export PDF</title>
  <style>
    @media print {
      @page { margin: 2cm; }
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 { color: #4f46e5; border-bottom: 3px solid #4f46e5; padding-bottom: 10px; }
    h2 { color: #6366f1; margin-top: 30px; border-left: 4px solid #6366f1; padding-left: 10px; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 30px; }
    .task {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      break-inside: avoid;
    }
    .task-title { font-size: 1.1em; font-weight: bold; margin-bottom: 8px; }
    .task-completed .task-title { text-decoration: line-through; color: #999; }
    .task-desc { color: #555; margin-bottom: 8px; }
    .task-meta { font-size: 0.85em; color: #777; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      margin-right: 5px;
    }
    .priority-high { background: #fee2e2; color: #991b1b; }
    .priority-medium { background: #fef3c7; color: #92400e; }
    .priority-low { background: #d1fae5; color: #065f46; }
    .category { background: #e0e7ff; color: #3730a3; }
  </style>
</head>
<body>
  <h1>📋 Task Manager - Export</h1>
  <div class="meta">
    <p>Esportato il: ${new Date().toLocaleString('it-IT')}</p>
    <p>Totale task: ${todos.length} | Completati: ${completed.length} | Attivi: ${pending.length}</p>
  </div>

  ${pending.length > 0 ? `
    <h2>📋 Task Attivi (${pending.length})</h2>
    ${pending.map(todo => `
      <div class="task">
        <div class="task-title">${escapeHtml(todo.title)}</div>
        ${todo.description ? `<div class="task-desc">${escapeHtml(todo.description)}</div>` : ''}
        <div class="task-meta">
          <span class="badge priority-${todo.priority}">${getPriorityLabel(todo.priority)}</span>
          ${todo.categories?.map(cat => `<span class="badge category">${escapeHtml(cat)}</span>`).join('') || ''}
          ${todo.createdAt ? `<br>Creato: ${new Date(todo.createdAt).toLocaleDateString('it-IT')}` : ''}
        </div>
      </div>
    `).join('')}
  ` : ''}

  ${completed.length > 0 ? `
    <h2>✅ Task Completati (${completed.length})</h2>
    ${completed.map(todo => `
      <div class="task task-completed">
        <div class="task-title">${escapeHtml(todo.title)}</div>
        ${todo.description ? `<div class="task-desc">${escapeHtml(todo.description)}</div>` : ''}
        <div class="task-meta">
          <span class="badge priority-${todo.priority}">${getPriorityLabel(todo.priority)}</span>
          ${todo.completedAt ? `<br>Completato: ${new Date(todo.completedAt).toLocaleDateString('it-IT')}` : ''}
        </div>
      </div>
    `).join('')}
  ` : ''}

  <script>
    window.onload = function() {
      window.print();
      setTimeout(() => window.close(), 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// Helper functions
function getPriorityLabel(priority) {
  const labels = { high: 'Alta', medium: 'Media', low: 'Bassa' };
  return labels[priority] || 'Media';
}

function getPriorityNumber(priority) {
  const numbers = { high: 1, medium: 5, low: 9 };
  return numbers[priority] || 5;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text?.replace(/[&<>"']/g, m => map[m]) || '';
}
