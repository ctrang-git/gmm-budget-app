// Mock data for the GMM Budget App demo prototype
// Represents a realistic student budget for April 2026

export const mockUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@my.gcu.edu',
  major: 'Business Administration',
  year: 'Junior',
  budgetMode: 'income',
  expectedIncome: 1800,
}

export const mockBudgetTargets = [
  { category: 'Housing',             budget: 650 },
  { category: 'Groceries',           budget: 180 },
  { category: 'Dining Out',          budget: 80  },
  { category: 'Transportation',      budget: 120 },
  { category: 'Tuition & Fees',      budget: 0   },
  { category: 'Textbooks & Supplies',budget: 30  },
  { category: 'Subscriptions',       budget: 40  },
  { category: 'Utilities',           budget: 55  },
  { category: 'Personal Care',       budget: 45  },
  { category: 'Clothing',            budget: 60  },
  { category: 'Entertainment',       budget: 75  },
  { category: 'Fitness',             budget: 25  },
  { category: 'Travel',              budget: 50  },
  { category: 'Healthcare',          budget: 30  },
  { category: 'Gifts',               budget: 20  },
  { category: 'Savings',             budget: 150 },
  { category: 'Debt Payments',       budget: 0   },
]

export const mockTransactions = [
  // April 2026
  { id: 1,  date: '2026-04-01', payee: 'GCU Housing',          category: 'Housing',              amount: 650.00 },
  { id: 2,  date: '2026-04-01', payee: 'Savings Transfer',      category: 'Savings',              amount: 150.00 },
  { id: 3,  date: '2026-04-02', payee: "Fry's Food Store",      category: 'Groceries',            amount: 68.45  },
  { id: 4,  date: '2026-04-03', payee: 'Circle K',              category: 'Transportation',       amount: 41.50  },
  { id: 5,  date: '2026-04-04', payee: 'Chipotle',              category: 'Dining Out',           amount: 13.75  },
  { id: 6,  date: '2026-04-04', payee: "Chick-fil-A",           category: 'Dining Out',           amount: 11.50  },
  { id: 7,  date: '2026-04-05', payee: 'AMC Theaters',          category: 'Entertainment',        amount: 28.50  },
  { id: 8,  date: '2026-04-05', payee: 'Walgreens',             category: 'Personal Care',        amount: 18.75  },
  { id: 9,  date: '2026-04-06', payee: 'Cox Internet',          category: 'Utilities',            amount: 48.00  },
  { id: 10, date: '2026-04-06', payee: 'Whataburger',           category: 'Dining Out',           amount: 12.30  },
  { id: 11, date: '2026-04-06', payee: 'CVS Pharmacy',          category: 'Healthcare',           amount: 12.99  },
  { id: 12, date: '2026-04-07', payee: 'Walmart',               category: 'Groceries',            amount: 54.20  },
  { id: 13, date: '2026-04-07', payee: 'Netflix',               category: 'Subscriptions',        amount: 15.49  },
  { id: 14, date: '2026-04-08', payee: 'Dutch Bros',            category: 'Dining Out',           amount: 8.50   },
  { id: 15, date: '2026-04-08', payee: 'GCU Bookstore',         category: 'Textbooks & Supplies', amount: 28.95  },
  { id: 16, date: '2026-04-09', payee: 'Starbucks',             category: 'Dining Out',           amount: 6.85   },
  { id: 17, date: '2026-04-09', payee: 'Target',                category: 'Clothing',             amount: 54.30  },
  { id: 18, date: '2026-04-10', payee: 'Planet Fitness',        category: 'Fitness',              amount: 24.99  },
  { id: 19, date: '2026-04-10', payee: 'Panda Express',         category: 'Dining Out',           amount: 11.40  },
  { id: 20, date: '2026-04-11', payee: 'Uber',                  category: 'Transportation',       amount: 14.20  },
  { id: 21, date: '2026-04-11', payee: "Raising Cane's",        category: 'Dining Out',           amount: 15.80  },
  { id: 22, date: '2026-04-12', payee: "Fry's Food Store",      category: 'Groceries',            amount: 71.30  },
  { id: 23, date: '2026-04-12', payee: 'Spotify',               category: 'Subscriptions',        amount: 9.99   },
  { id: 24, date: '2026-04-13', payee: 'In-N-Out Burger',       category: 'Dining Out',           amount: 9.75   },
  { id: 25, date: '2026-04-13', payee: 'Circle K',              category: 'Transportation',       amount: 34.80  },
  { id: 26, date: '2026-04-13', payee: 'Amazon',                category: 'Gifts',                amount: 24.99  },

  // March 2026
  { id: 101, date: '2026-03-01', payee: 'GCU Housing',         category: 'Housing',              amount: 650.00 },
  { id: 102, date: '2026-03-01', payee: 'Savings Transfer',     category: 'Savings',              amount: 150.00 },
  { id: 103, date: '2026-03-04', payee: "Fry's Food Store",     category: 'Groceries',            amount: 72.15  },
  { id: 104, date: '2026-03-05', payee: 'Circle K',             category: 'Transportation',       amount: 35.00  },
  { id: 105, date: '2026-03-07', payee: 'Walmart',              category: 'Groceries',            amount: 48.30  },
  { id: 106, date: '2026-03-08', payee: 'Netflix',              category: 'Subscriptions',        amount: 15.49  },
  { id: 107, date: '2026-03-10', payee: 'Chipotle',             category: 'Dining Out',           amount: 14.25  },
  { id: 108, date: '2026-03-12', payee: 'Uber',                 category: 'Transportation',       amount: 11.40  },
  { id: 109, date: '2026-03-15', payee: 'Planet Fitness',       category: 'Fitness',              amount: 24.99  },
  { id: 110, date: '2026-03-16', payee: 'CVS Pharmacy',         category: 'Healthcare',           amount: 22.40  },
  { id: 111, date: '2026-03-18', payee: 'Target',               category: 'Clothing',             amount: 38.90  },
  { id: 112, date: '2026-03-20', payee: 'AMC Theaters',         category: 'Entertainment',        amount: 22.50  },
  { id: 113, date: '2026-03-22', payee: 'Dutch Bros',           category: 'Dining Out',           amount: 7.50   },
  { id: 114, date: '2026-03-24', payee: 'Cox Internet',         category: 'Utilities',            amount: 48.00  },
  { id: 115, date: '2026-03-25', payee: 'Walgreens',            category: 'Personal Care',        amount: 15.60  },
  { id: 116, date: '2026-03-27', payee: 'Starbucks',            category: 'Dining Out',           amount: 6.85   },
  { id: 117, date: '2026-03-28', payee: "Fry's Food Store",     category: 'Groceries',            amount: 56.40  },
  { id: 118, date: '2026-03-29', payee: 'Spotify',              category: 'Subscriptions',        amount: 9.99   },
  { id: 119, date: '2026-03-30', payee: 'GCU Bookstore',        category: 'Textbooks & Supplies', amount: 67.50  },
  { id: 120, date: '2026-03-31', payee: "Raising Cane's",       category: 'Dining Out',           amount: 13.75  },
  { id: 121, date: '2026-03-31', payee: 'Circle K',             category: 'Transportation',       amount: 38.50  },
]

// Get spending per category filtered by month key (e.g. "2026-04")
export function getSpendingByCategoryForMonth(monthKey) {
  const txs = monthKey
    ? mockTransactions.filter(t => t.date.startsWith(monthKey))
    : mockTransactions
  return mockBudgetTargets.map(({ category, budget }) => {
    const spent = txs
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
    return { category, budget, spent }
  })
}

// Legacy: defaults to April 2026
export function getSpendingByCategory() {
  return getSpendingByCategoryForMonth('2026-04')
}

export const mockIncome = 1800

export const CATEGORIES = [
  'Housing',
  'Groceries',
  'Dining Out',
  'Transportation',
  'Tuition & Fees',
  'Textbooks & Supplies',
  'Subscriptions',
  'Utilities',
  'Personal Care',
  'Clothing',
  'Entertainment',
  'Fitness',
  'Travel',
  'Healthcare',
  'Gifts',
  'Savings',
  'Debt Payments',
]

export const CATEGORY_ICONS = {
  'Housing':              '🏠',
  'Groceries':            '🛒',
  'Dining Out':           '🍽️',
  'Transportation':       '🚗',
  'Tuition & Fees':       '🎓',
  'Textbooks & Supplies': '📚',
  'Subscriptions':        '📱',
  'Utilities':            '💡',
  'Personal Care':        '✨',
  'Clothing':             '👕',
  'Entertainment':        '🎬',
  'Fitness':              '💪',
  'Travel':               '✈️',
  'Healthcare':           '❤️',
  'Gifts':                '🎁',
  'Savings':              '💰',
  'Debt Payments':        '💳',
}

export const CATEGORY_COLORS = {
  'Housing':              '#4B2683',
  'Groceries':            '#27AE60',
  'Dining Out':           '#F39C12',
  'Transportation':       '#3498DB',
  'Tuition & Fees':       '#8E44AD',
  'Textbooks & Supplies': '#D35400',
  'Subscriptions':        '#1ABC9C',
  'Utilities':            '#F1C40F',
  'Personal Care':        '#E91E63',
  'Clothing':             '#E67E22',
  'Entertainment':        '#9B59B6',
  'Fitness':              '#26A69A',
  'Travel':               '#00BCD4',
  'Healthcare':           '#E74C3C',
  'Gifts':                '#FF7043',
  'Savings':              '#2ECC71',
  'Debt Payments':        '#95A5A6',
}
