// js/cars.js

document.addEventListener('DOMContentLoaded', () => {
  const carsContainer = document.getElementById('carsGrid') || document.getElementById('homeFeaturedCars');
  const filterBrand = document.getElementById('filterBrand');
  const filterType = document.getElementById('filterType');
  const filterPrice = document.getElementById('filterPrice');
  
  if (!carsContainer) return; // Only run on cars page or sections with the grid

  // Initial render (limit to 3 if on home page)
  const isHomePage = document.getElementById('homeFeaturedCars') !== null;
  const initialCars = isHomePage ? carsData.slice(0, 3) : carsData;
  renderCars(initialCars);

  // Filter Event Listeners (only if filters exist)
  if (filterBrand && filterType && filterPrice) {
    const applyFilters = () => {
      let filtered = carsData;

      const brand = filterBrand.value;
      const type = filterType.value;
      const price = filterPrice.value;

      if (brand !== 'all') {
        filtered = filtered.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
      }
      
      if (type !== 'all') {
        filtered = filtered.filter(car => car.type.toLowerCase() === type.toLowerCase());
      }
      
      if (price !== 'all') {
        if (price === 'low') {
          filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
        } else if (price === 'high') {
          filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
        }
      } else {
        // Default sort by ID
        filtered.sort((a, b) => a.id - b.id);
      }

      renderCars(filtered);
    };

    filterBrand.addEventListener('change', applyFilters);
    filterType.addEventListener('change', applyFilters);
    filterPrice.addEventListener('change', applyFilters);
  }

  function renderCars(cars) {
    carsContainer.innerHTML = '';
    
    if (cars.length === 0) {
      carsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-muted);">No cars match your filters.</div>';
      return;
    }

    cars.forEach((car, index) => {
      const delay = (index % 3) * 100 + 100; // staggered animation delay
      
      const card = document.createElement('div');
      card.className = `car-card slide-up delay-${delay}`;
      
      card.innerHTML = `
        <div class="car-img-wrapper">
          <img src="${car.image}" alt="${car.name}" loading="lazy">
          <div class="car-badge">${car.type}</div>
        </div>
        <div class="car-details">
          <h3 class="car-title">${car.name}</h3>
          <div class="car-brand">${car.brand}</div>
          
          <div class="car-specs">
            <div><i class="fa-solid fa-gas-pump"></i> ${car.fuel}</div>
            <div><i class="fa-solid fa-gear"></i> ${car.transmission}</div>
            <div><i class="fa-solid fa-user"></i> ${car.seats} Seats</div>
          </div>
          
          <div class="car-footer">
            <div class="car-price">
              <span class="price">$${car.pricePerDay}</span>
              <span class="unit">/day</span>
            </div>
            <a href="car-details.html?id=${car.id}" class="btn btn-outline">View Details</a>
          </div>
        </div>
      `;
      carsContainer.appendChild(card);
    });
  }
});
