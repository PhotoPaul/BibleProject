import './style.css';
import { marked } from 'marked';
import { mediaRegistry } from './data.js';

const grid = document.getElementById('library-grid');
const viewer = document.getElementById('content-viewer');
const viewerContainer = document.getElementById('viewer-container');
const closeBtn = document.getElementById('close-viewer');
const filterBtns = document.querySelectorAll('.filter-btn');

let allItems = [];

const customOrders = {
  'Ο Χαρακτήρας του Θεού: Μελέτες Λέξεων': [
    'Ευσπλαχνία',
    'Χάρη',
    'Μακροθυμία',
    'Αιώνια Αγάπη',
    'Αξιοπιστία'
  ],
  'Παλαιά Διαθήκη: Επισκόπηση Βιβλίων': [
    'Επισκόπηση: Παλαιά Διαθήκη - ΤαΝάΚ',
    'Επισκόπηση: Γένεσις 1-11',
    'Επισκόπηση: Γένεσις 12-50',
    "Επισκόπηση: Έξοδος 1-18",
    "Επισκόπηση: Έξοδος 19-40",
    'Επισκόπηση: Λευιτικόν',
    'Επισκόπηση: Αριθμοί',
    'Επισκόπηση: Δευτερονόμιον',
    'Επισκόπηση: Ιησούς του Ναυή',
    'Επισκόπηση: Κριταί',
    'Επισκόπηση: Ρουθ',
    "Επισκόπηση: Α' Σαμουήλ",
    "Επισκόπηση: Β' Σαμουήλ",
    "Επισκόπηση: Α' & Β' Βασιλέων",
    "Επισκόπηση: Α' & Β' Χρονικών",
    "Επισκόπηση: Έσδρας & Νεεμίας",
    'Επισκόπηση: Εσθήρ',
    'Επισκόπηση: Ιώβ',
    'Επισκόπηση: Ψαλμοί',
    'Επισκόπηση: Παροιμίαι',
    'Επισκόπηση: Εκκλησιαστής',
    'Επισκόπηση: Άσμα Ασμάτων',
    'Επισκόπηση: Ησαΐας 1-39',
    'Επισκόπηση: Ησαΐας 40-66',
    'Επισκόπηση: Ιερεμίας',
    'Επισκόπηση: Θρήνοι',
    'Επισκόπηση: Ιεζεκιήλ 1-33',
    'Επισκόπηση: Ιεζεκιήλ 34-48',
    'Επισκόπηση: Δανιήλ',
    'Επισκόπηση: Ωσηέ',
    'Επισκόπηση: Ιωήλ',
    'Επισκόπηση: Αμώς',
    'Επισκόπηση: Οβδιού',
    'Επισκόπηση: Ιωνάς',
    'Επισκόπηση: Μιχαίας',
    'Επισκόπηση: Ναούμ',
    'Επισκόπηση: Αββακούμ',
    'Επισκόπηση: Σοφονίας',
    'Επισκόπηση: Αγγαίος',
    'Επισκόπηση: Ζαχαρίας',
    'Επισκόπηση: Μαλαχίας'
  ],
  'Καινή Διαθήκη: Επισκόπηση Βιβλίων': [
    'Επισκόπηση: Καινή Διαθήκη',
    'Επισκόπηση: Κατά Ματθαίον 1-13',
    'Επισκόπηση: Κατά Ματθαίον 14-28',
    'Επισκόπηση: Κατά Μάρκον',
    'Επισκόπηση: Κατά Ιωάννην 1-12',
    'Επισκόπηση: Κατά Ιωάννην 13-21',
    'Επισκόπηση: Κατά Λουκάν 1-9',
    'Επισκόπηση: Κατά Λουκάν 10-24',
    'Επισκόπηση: Πράξεις 1-12',
    'Επισκόπηση: Πράξεις 13-28',
    'Επισκόπηση: Προς Ρωμαίους 1-4',
    'Επισκόπηση: Προς Ρωμαίους 5-16',
    "Επισκόπηση: Προς Κορινθίους Α'",
    "Επισκόπηση: Προς Κορινθίους Β'",
    'Επισκόπηση: Προς Γαλάτας',
    'Επισκόπηση: Προς Εφεσίους',
    'Επισκόπηση: Προς Φιλιππησίους',
    'Επισκόπηση: Προς Κολοσσαείς',
    "Επισκόπηση: Προς Θεσσαλονικείς Α'",
    "Επισκόπηση: Προς Θεσσαλονικείς Β'",
    "Επισκόπηση: Προς Τιμόθεον Α'",
    "Επισκόπηση: Προς Τιμόθεον Β'",
    'Επισκόπηση: Προς Τίτον',
    'Επισκόπηση: Προς Φιλήμονα',
    'Επισκόπηση: Προς Εβραίους',
    'Επισκόπηση: Ιακώβου',
    "Επισκόπηση: Πέτρου Α'",
    "Επισκόπηση: Πέτρου Β'",
    "Επισκόπηση: Ιωάννου Α', Β' & Γ'",
    'Επισκόπηση: Ιούδα',
    'Επισκόπηση: Αποκάλυψις Ιωάννου 1-11',
    'Επισκόπηση: Αποκάλυψις Ιωάννου 12-22'
  ],
  'Κατά Λουκάν: Ευαγγέλιο και Πράξεις': [
    'Η Γέννηση του Ιησού: Κατά Λουκάν 1–2',
    'Η Βάπτιση του Ιησού: Κατά Λουκάν 3–9',
    'Ο Άσωτος Υιός: Κατά Λουκάν 9–19',
    'Η Σταύρωση του Ιησού: Κατά Λουκάν 19–23',
    'Η Ανάσταση του Ιησού: Κατά Λουκάν 24',
    'Πεντηκοστή: Πράξεις 1–7',
    'Ο Απόστολος Παύλος: Πράξεις 8–12',
    'Τα Ιεραποστολικά Ταξίδια του Παύλου: Πράξεις 13–20',
    'Η Πορεία προς την Ρώμη: Πράξεις 21–28'
  ]
};

const collectionDisplayOrder = [
  'Κατά Λουκάν: Ευαγγέλιο και Πράξεις',
  'Ο Χαρακτήρας του Θεού: Μελέτες Λέξεων',
  'Καινή Διαθήκη: Επισκόπηση Βιβλίων',
  'Παλαιά Διαθήκη: Επισκόπηση Βιβλίων',
  'Προσμένουμε την Έλευση του Χριστού'
];

// Simple Frontmatter Parser
function parseFrontmatter(text) {
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) return { data: {}, content: text };

  const yaml = fmMatch[1];
  const content = fmMatch[2];
  const data = {};

  yaml.split('\n').forEach(line => {
    const [key, ...val] = line.split(':');
    if (key && val) {
      data[key.trim()] = val.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });

  return { data, content };
}

// Fetch and load all resources
async function loadResources() {
  const promises = [];

  // Articles
  mediaRegistry.articles.forEach(file => {
    promises.push(loadItem(`content/articles/${file}`, 'article'));
  });

  // Videos
  mediaRegistry.videos.forEach(file => {
    promises.push(loadItem(`content/videos/${file}`, 'video'));
  });

  // Plans
  mediaRegistry.plans.forEach(file => {
    promises.push(loadItem(`content/plans/${file}`, 'plan'));
  });

  // Posters
  mediaRegistry.posters.forEach(file => {
    promises.push(loadItem(`content/posters/${file}`, 'poster'));
  });

  allItems = await Promise.all(promises);
  renderGrid(allItems);
}

async function loadItem(path, type) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    const { data, content } = parseFrontmatter(text);
    return { ...data, content, type, id: path };
  } catch (err) {
    console.error(`Failed to load ${path}:`, err);
    return null;
  }
}

function renderGrid(items) {
  if (items.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">Δεν βρέθηκαν αποτελέσματα.</div>';
    return;
  }

  // Group items by collection
  const groups = items.reduce((acc, item) => {
    const collection = item.collection || 'Άλλα';
    if (!acc[collection]) acc[collection] = [];
    acc[collection].push(item);
    return acc;
  }, {});

  // Determine the order of keys: explicitly iterate defined order first
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const indexA = collectionDisplayOrder.indexOf(a);
    const indexB = collectionDisplayOrder.indexOf(b);

    // 0. Sort by Type Priority (Articles -> Videos -> Posters -> Plans)
    const typePriority = { 'article': 1, 'video': 2, 'poster': 3, 'plan': 4 };
    // Safe access to type (assuming groups have at least one item)
    const typeA = groups[a] && groups[a][0] ? groups[a][0].type : 'other';
    const typeB = groups[b] && groups[b][0] ? groups[b][0].type : 'other';

    if (typePriority[typeA] !== typePriority[typeB]) {
      return (typePriority[typeA] || 99) - (typePriority[typeB] || 99);
    }
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b, 'el');
  });

  let html = '';
  sortedKeys.forEach((collection) => {
    const collectionItems = groups[collection];
    html += `
      <div class="collection-header" style="grid-column: 1/-1; margin-top: 2rem; margin-bottom: 1rem;">
        <h2 style="font-family: 'Outfit', sans-serif; color: var(--primary-gold); font-size: 1.5rem; border-left: 4px solid var(--primary-gold); padding-left: 1rem;">${collection}</h2>
      </div>
    `;

    collectionItems.forEach((item) => {
      // Find original index in allItems to keep listeners working correctly
      const originalIndex = allItems.indexOf(item);
      html += `
        <div class="card" data-index="${originalIndex}">
          <img src="${item.thumbnail || item.image || 'https://via.placeholder.com/400x225'}" class="card-img" alt="${item.title}">
          <div class="card-content">
            <div class="card-type">
              ${getTypeIcon(item.type)}
            </div>
            <h3 class="card-title">${item.title}</h3>
          </div>
        </div>
      `;
    });
  });

  grid.innerHTML = html;

  // Add click listeners
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const index = card.getAttribute('data-index');
      openViewer(allItems[index]);
    });
  });
}

function getTypeIcon(type) {
  switch (type) {
    case 'video': return '▶️ Βίντεο';
    case 'article': return '📄 Άρθρο';
    case 'plan': return '📅 Σχέδιο';
    case 'poster': return '🖼️ Αφίσα';
    default: return '• Υλικό';
  }
}

function getEnglishLinkHtml(url) {
  if (!url) return '';
  return `
    <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--glass-border); text-align: center;">
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">Available in English:</p>
      <a href="${url}" target="_blank" class="filter-btn active" style="text-decoration: none; display: inline-block;">
        View English Version 🌐
      </a>
    </div>
  `;
}

function openViewer(item, pushState = true) {
  if (!item) return;
  viewer.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Update URL
  if (pushState) {
    const resourceId = item.id.split('/').pop().replace('.md', '');
    const newUrl = `${window.location.pathname}?resource=${resourceId}`;
    window.history.pushState({ resourceId }, '', newUrl);
  }

  let html = '';
  if (item.type === 'article') {
    html = `
      <div class="article-header">
        <div class="card-type">${getTypeIcon(item.type)}</div>
        <h1>${item.title}</h1>
        <p>${item.date || ''} • ${item.author || 'BibleProject'}</p>
      </div>
      <div class="markdown-body">
        ${marked(item.content)}
      </div>
      ${getEnglishLinkHtml(item.englishUrl)}
    `;
  } else if (item.type === 'video') {
    html = `
      <div class="article-header">
        <h1>${item.title}</h1>
      </div>
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <iframe 
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
          src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
      <div class="markdown-body" style="margin-top:2rem">
        <p>${item.content}</p>
      </div>
      ${getEnglishLinkHtml(item.englishUrl)}
    `;
  } else if (item.type === 'plan') {
    html = `
      <div class="article-header">
        <h1>${item.title}</h1>
        <p>${item.days || ''} Ημέρες</p>
      </div>
      <div style="text-align:center">
        <img src="${item.thumbnail}" style="width:100%; border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom:2rem">
        <p style="margin-bottom:2rem">${item.content}</p>
        <a href="${item.bibleComUrl}" target="_blank" class="filter-btn active" style="text-decoration:none">Ξεκινήστε το Σχέδιο στο Bible.com</a>
      </div>
      ${getEnglishLinkHtml(item.englishUrl)}
    `;
  } else if (item.type === 'poster') {
    html = `
      <div class="article-header">
        <h1>${item.title}</h1>
        <p>Ανάλυση: ${item.resolution || 'Υψηλή'}</p>
      </div>
      <div style="text-align:center">
        <img src="${item.image}" style="width:100%; border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom:2rem">
        <p>${item.content}</p>
        <a href="${item.downloadUrl || item.image}" download class="filter-btn active" style="text-decoration:none">Λήψη Αφίσας (Υψηλή Ανάλυση)</a>
      </div>
      ${getEnglishLinkHtml(item.englishUrl)}
    `;
  }

  viewerContainer.innerHTML = html;
}

function closeViewer(pushState = true) {
  viewer.style.display = 'none';
  document.body.style.overflow = 'auto';
  viewerContainer.innerHTML = '';

  if (pushState) {
    window.history.pushState({}, '', window.location.pathname);
  }
}

closeBtn.addEventListener('click', () => closeViewer());

// Handle Browser Navigation
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.resourceId) {
    const item = allItems.find(i => i.id.includes(event.state.resourceId));
    if (item) openViewer(item, false);
  } else {
    closeViewer(false);
  }
});

const searchInput = document.getElementById('search-input');
const subFilterBar = document.getElementById('sub-filter-bar');
let currentFilter = 'all';
let currentSubFilter = 'all';
let currentSearch = '';

function normalizeGreek(text) {
  if (!text) return '';
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
    .replace(/ά/g, 'α').replace(/έ/g, 'ε').replace(/ή/g, 'η').replace(/ί/g, 'ι').replace(/ό/g, 'ο').replace(/ύ/g, 'υ').replace(/ώ/g, 'ω')
    .replace(/ϊ/g, 'ι').replace(/ϋ/g, 'υ').replace(/ΐ/g, 'ι').replace(/ΰ/g, 'υ');
}

function getAvailableCollections(type) {
  if (type === 'all') return [];
  const items = allItems.filter(i => i.type === type);
  // Extract unique non-empty collections
  const collections = new Set(items.map(i => i.collection).filter(Boolean));

  // If type is video, ensure our priority collections are present (if user wants to see them even empty)
  // The request "put the filter for now" for Luke-Acts implies we should force it.
  if (type === 'video') {
    collectionDisplayOrder.forEach(col => collections.add(col));
  }

  return Array.from(collections).sort((a, b) => {
    const indexA = collectionDisplayOrder.indexOf(a);
    const indexB = collectionDisplayOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b, 'el');
  });
}

function renderSubFilters() {
  const collections = getAvailableCollections(currentFilter);

  if (collections.length === 0) {
    subFilterBar.innerHTML = '';
    return;
  }

  let html = `<button class="sub-filter-chip ${currentSubFilter === 'all' ? 'active' : ''}" data-sub="all">Όλα</button>`;

  collections.forEach(col => {
    html += `<button class="sub-filter-chip ${currentSubFilter === col ? 'active' : ''}" data-sub="${col}">${col}</button>`;
  });

  subFilterBar.innerHTML = html;

  // Add listeners
  subFilterBar.querySelectorAll('.sub-filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSubFilter = btn.getAttribute('data-sub');
      renderSubFilters(); // Re-render to update active state
      applyFilters();
    });
  });
}

function applyFilters() {
  let filtered = allItems;

  // Filter by category
  if (currentFilter !== 'all') {
    filtered = filtered.filter(i => i.type === currentFilter);
  }

  // Filter by sub-category (collection)
  if (currentSubFilter !== 'all') {
    filtered = filtered.filter(i => i.collection === currentSubFilter);
  }

  // Search
  if (currentSearch) {
    const query = normalizeGreek(currentSearch);
    filtered = filtered.filter(i =>
      normalizeGreek(i.title).includes(query) ||
      normalizeGreek(i.content).includes(query) ||
      (i.author && normalizeGreek(i.author).includes(query))
    );
  }





  // Sort Logic
  filtered.sort((a, b) => {
    const colA = a.collection || 'Άλλα';
    const colB = b.collection || 'Άλλα';



    // 1. Sort by Collection Display Order
    const indexA = collectionDisplayOrder.indexOf(colA);
    const indexB = collectionDisplayOrder.indexOf(colB);

    if (indexA !== -1 && indexB !== -1) {
      if (indexA !== indexB) return indexA - indexB;
    } else if (indexA !== -1) {
      return -1; // A is in custom list, B is not -> A comes first
    } else if (indexB !== -1) {
      return 1; // B is in custom list, A is not -> B comes first
    } else {
      // Both not in list, fallback to alphabetical collection sort
      if (colA !== colB) return colA.localeCompare(colB, 'el');
    }

    // 2. Inside same collection: Custom Order (for items)
    if (customOrders[colA]) {
      const order = customOrders[colA];
      const itemIndexA = order.indexOf(a.title);
      const itemIndexB = order.indexOf(b.title);

      // If both are in the custom list, sort by index
      if (itemIndexA !== -1 && itemIndexB !== -1) return itemIndexA - itemIndexB;
      // If only one is in the list, prioritize it
      if (itemIndexA !== -1) return -1;
      if (itemIndexB !== -1) return 1;
    }

    // 3. Default to Alphabetical within collection
    return a.title.localeCompare(b.title, 'el');
  });

  renderGrid(filtered);
}

// Filtering
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const newFilter = btn.getAttribute('data-filter');
    if (currentFilter !== newFilter) {
      currentFilter = newFilter;
      currentSubFilter = 'all'; // Reset sub-filter when changing main category
      renderSubFilters();
    }
    applyFilters();
  });
});

// Search
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  applyFilters();
});

async function init() {
  await loadResources();

  // Check for deep link
  const urlParams = new URLSearchParams(window.location.search);
  const resourceId = urlParams.get('resource');
  if (resourceId) {
    const item = allItems.find(i => i.id.includes(resourceId));
    if (item) openViewer(item, false);
  }

  // Initial filter application
  applyFilters();
}

init();
