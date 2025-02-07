// Initialize Lucide icons
lucide.createIcons();

// State management
let locations = [];
let editingLocationId = null;

// DOM Elements
const locationGrid = document.getElementById('locationGrid');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const locationForm = document.getElementById('locationForm');
const addLocationBtn = document.getElementById('addLocationBtn');
const closeModalBtn = document.getElementById('closeModal');

// Load initial data
fetch('locais.json')
  .then(response => response.json())
  .then(data => {
    locations = data.locais;
    renderLocations();
  })
  .catch(error => console.error('Error loading locations:', error));

// Event Listeners
addLocationBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
locationForm.addEventListener('submit', handleSubmit);

// Functions
function renderLocations() {
  locationGrid.innerHTML = locations.map(location => `
    <div class="location-card">
      <img src="${location.photo}" alt="${location.title}">
      <div class="location-card-content">
        <h3>${location.title}</h3>
        <p>${location.description}</p>
        <div class="card-actions">
          <button class="btn-icon" onclick="editLocation(${location.id})">
            <i data-lucide="pencil"></i>
          </button>
          <button class="btn-icon" onclick="deleteLocation(${location.id})">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Reinitialize icons for newly added elements
  lucide.createIcons();
}

function openModal(location = null) {
  modal.classList.add('active');
  if (location) {
    editingLocationId = location.id;
    modalTitle.textContent = 'Edit Location';
    locationForm.title.value = location.title;
    locationForm.description.value = location.description;
    locationForm.photo.value = location.photo;
    locationForm.querySelector('button[type="submit"]').textContent = 'Update Location';
  } else {
    editingLocationId = null;
    modalTitle.textContent = 'Add New Location';
    locationForm.reset();
    locationForm.querySelector('button[type="submit"]').textContent = 'Add Location';
  }
}

function closeModal() {
  modal.classList.remove('active');
  editingLocationId = null;
  locationForm.reset();
}

function handleSubmit(e) {
  e.preventDefault();
  
  const locationData = {
    title: locationForm.title.value,
    description: locationForm.description.value,
    photo: locationForm.photo.value
  };

  if (editingLocationId) {
    // Edit existing location
    locations = locations.map(location =>
      location.id === editingLocationId
        ? { ...locationData, id: editingLocationId }
        : location
    );
  } else {
    // Add new location
    const newId = Math.max(0, ...locations.map(loc => loc.id)) + 1;
    locations.push({ ...locationData, id: newId });
  }

  renderLocations();
  closeModal();
}

function editLocation(id) {
  const location = locations.find(loc => loc.id === id);
  if (location) {
    openModal(location);
  }
}

function deleteLocation(id) {
  if (confirm('Are you sure you want to delete this location?')) {
    locations = locations.filter(location => location.id !== id);
    renderLocations();
  }
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
