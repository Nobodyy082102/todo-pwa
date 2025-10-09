// Sistema Achievement/Trofei

export const ACHIEVEMENTS = {
  FIRST_VICTORY: {
    id: 'first_victory',
    name: 'Prima Vittoria',
    description: 'Completa il tuo primo task',
    icon: '🎯',
    check: (stats) => stats.totalCompleted >= 1,
  },
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Mattiniero',
    description: 'Completa 5 task prima delle 6:00',
    icon: '🌅',
    check: (stats) => stats.earlyMorningTasks >= 5,
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Nottambulo',
    description: 'Completa 5 task dopo le 22:00',
    icon: '🦉',
    check: (stats) => stats.lateNightTasks >= 5,
  },
  MARATHON_RUNNER: {
    id: 'marathon_runner',
    name: 'Maratoneta',
    description: 'Completa 10 task in un giorno',
    icon: '🏃',
    check: (stats) => stats.maxTasksInOneDay >= 10,
  },
  PERFECTIONIST: {
    id: 'perfectionist',
    name: 'Perfezionista',
    description: 'Mantieni uno streak di 7 giorni',
    icon: '✨',
    check: (stats) => stats.currentStreak >= 7,
  },
  CENTURION: {
    id: 'centurion',
    name: 'Centurione',
    description: 'Completa 100 task totali',
    icon: '💯',
    check: (stats) => stats.totalCompleted >= 100,
  },
  PRIORITIZER: {
    id: 'prioritizer',
    name: 'Prioritizer',
    description: 'Completa 20 task ad alta priorità',
    icon: '🔥',
    check: (stats) => stats.highPriorityCompleted >= 20,
  },
  ORGANIZER: {
    id: 'organizer',
    name: 'Organizzatore',
    description: 'Usa tutte le categorie disponibili',
    icon: '📚',
    check: (stats) => stats.categoriesUsed >= 6,
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Fulmine',
    description: 'Completa un task entro 5 minuti dalla creazione',
    icon: '⚡',
    check: (stats) => stats.hasSpeedCompletion,
  },
  LEGENDARY: {
    id: 'legendary',
    name: 'Leggendario',
    description: 'Raggiungi il livello 20',
    icon: '👑',
    check: (stats) => stats.level >= 20,
  },
  PERSISTENT: {
    id: 'persistent',
    name: 'Persistente',
    description: 'Mantieni uno streak di 30 giorni',
    icon: '🔥',
    check: (stats) => stats.currentStreak >= 30,
  },
  COMPLETIONIST: {
    id: 'completionist',
    name: 'Completista',
    description: 'Completa 500 task totali',
    icon: '🏆',
    check: (stats) => stats.totalCompleted >= 500,
  },
};

export function calculateAchievementStats(todos) {
  const completed = todos.filter(t => t.completed);

  // Task completati per ora
  const tasksByHour = completed.reduce((acc, task) => {
    if (task.completedAt) {
      const hour = new Date(task.completedAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
    }
    return acc;
  }, {});

  const earlyMorningTasks = Object.entries(tasksByHour)
    .filter(([hour]) => hour >= 0 && hour < 6)
    .reduce((sum, [, count]) => sum + count, 0);

  const lateNightTasks = Object.entries(tasksByHour)
    .filter(([hour]) => hour >= 22)
    .reduce((sum, [, count]) => sum + count, 0);

  // Task per giorno
  const tasksByDay = completed.reduce((acc, task) => {
    if (task.completedAt) {
      const day = new Date(task.completedAt).toDateString();
      acc[day] = (acc[day] || 0) + 1;
    }
    return acc;
  }, {});

  const maxTasksInOneDay = Math.max(...Object.values(tasksByDay), 0);

  // Streak corrente
  const today = new Date().toDateString();
  const sortedDays = Object.keys(tasksByDay).sort((a, b) => new Date(b) - new Date(a));

  let currentStreak = 0;
  let checkDate = new Date();

  while (true) {
    const dateStr = checkDate.toDateString();
    if (tasksByDay[dateStr]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Se è oggi e non ci sono task, considera comunque lo streak di ieri
      if (dateStr === today) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // Task ad alta priorità completati
  const highPriorityCompleted = completed.filter(t => t.priority === 'high').length;

  // Categorie uniche usate
  const categoriesUsed = new Set();
  todos.forEach(todo => {
    if (todo.categories) {
      todo.categories.forEach(cat => categoriesUsed.add(cat));
    }
  });

  // Speed completion - task completato entro 5 minuti
  const hasSpeedCompletion = completed.some(task => {
    if (task.createdAt && task.completedAt) {
      const diff = task.completedAt - task.createdAt;
      return diff <= 5 * 60 * 1000; // 5 minuti
    }
    return false;
  });

  // Livello (da GameStats)
  const xpPerTask = { high: 50, medium: 30, low: 10 };
  const totalXP = completed.reduce((sum, task) => {
    return sum + (xpPerTask[task.priority] || 10);
  }, 0);
  const level = Math.floor(Math.sqrt(totalXP / 50)) + 1;

  return {
    totalCompleted: completed.length,
    earlyMorningTasks,
    lateNightTasks,
    maxTasksInOneDay,
    currentStreak,
    highPriorityCompleted,
    categoriesUsed: categoriesUsed.size,
    hasSpeedCompletion,
    level,
  };
}

export function checkNewAchievements(todos, unlockedAchievements = []) {
  const stats = calculateAchievementStats(todos);
  const newAchievements = [];

  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!unlockedAchievements.includes(achievement.id) && achievement.check(stats)) {
      newAchievements.push(achievement);
    }
  });

  return newAchievements;
}
