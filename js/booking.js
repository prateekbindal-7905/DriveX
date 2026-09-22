// js/booking.js

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get('id');
  
  const carSummaryEl = document.getElementById('carSummary');
  const bookingForm = document.getElementById('bookingForm');
  const pickupDate = document.getElementById('pickupDate');
  const returnDate = document.getElementById('returnDate');
  const totalDaysEl = document.getElementById('totalDays');
  const totalPriceEl = document.getElementById('totalPrice');
  const securityDepositEl = document.getElementById('securityDeposit');
  const finalTotalEl = document.getElementById('finalTotal');
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModal');

  const securityDeposit = 500; // Fixed deposit
  let selectedCar = null;

  // Load car details if carId is present (Shared between Car Details and Booking pages)
  if (carId && typeof carsData !== 'undefined') {
    selectedCar = carsData.find(c => c.id === parseInt(carId));
  }

  // Car Details Page Logic
  const carDetailsContainer = document.getElementById('carDetailsContent');
  if (carDetailsContainer && selectedCar) {
    carDetailsContainer.innerHTML = `
      <div class="grid grid-cols-2 gap-lg" style="align-items: start;">
        <div class="car-gallery slide-in-right">
          <img src="${selectedCar.image}" alt="${selectedCar.name}" style="border-radius: var(--radius-lg); width: 100%; box-shadow: var(--shadow-subtle);">
        </div>
        <div class="car-info fade-in delay-200">
          <div class="car-badge" style="position: static; display: inline-block; margin-bottom: 1rem;">${selectedCar.type}</div>
          <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${selectedCar.name}</h1>
          <p class="text-muted" style="font-size: 1.125rem; margin-bottom: 1.5rem;">${selectedCar.brand}</p>
          
          <div class="car-specs grid grid-cols-2 gap-md" style="margin-bottom: 2rem; font-size: 1rem;">
            <div><i class="fa-solid fa-gas-pump"></i> ${selectedCar.fuel}</div>
            <div><i class="fa-solid fa-gear"></i> ${selectedCar.transmission}</div>
            <div><i class="fa-solid fa-user"></i> ${selectedCar.seats} Seats</div>
            <div><i class="fa-solid fa-snowflake"></i> AC</div>
          </div>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Pricing</h3>
            <div style="display: flex; gap: 1.5rem;">
              <div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">$${selectedCar.pricePerHour}</div>
                <div class="text-muted">per hour</div>
              </div>
              <div style="border-left: 1px solid var(--color-border); padding-left: 1.5rem;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">$${selectedCar.pricePerDay}</div>
                <div class="text-muted">per day</div>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Features</h3>
            <ul class="features-list text-muted">
              ${selectedCar.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
            </ul>
          </div>
          
          <div style="background: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid rgba(59, 130, 246, 0.2); margin-bottom: 2rem;">
            <h4 style="margin-bottom: 0.5rem; color: var(--color-primary);"><i class="fa-solid fa-circle-info"></i> Important Information</h4>
            <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 0.5rem;">A fully refundable security deposit of $500 is required for this vehicle.</p>
            <p class="text-muted" style="font-size: 0.875rem;">Valid government-issued documents (Driving License & ID) are required at pickup.</p>
          </div>
          
          <a href="booking.html?id=${selectedCar.id}" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.125rem;">Book This Car Now</a>
        </div>
      </div>
    `;
  }

  // Booking Page Logic
  if (carSummaryEl && selectedCar) {
    carSummaryEl.innerHTML = `
      <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
        <img src="${selectedCar.image}" alt="${selectedCar.name}" style="width: 100px; height: 70px; object-fit: cover; border-radius: var(--radius-sm);">
        <div>
          <h4>${selectedCar.name}</h4>
          <div class="text-muted" style="font-size: 0.875rem;">$${selectedCar.pricePerDay} / day</div>
        </div>
      </div>
    `;
  }

  const updateSummary = () => {
    if (!selectedCar || !pickupDate.value || !returnDate.value) return;

    const start = new Date(pickupDate.value);
    const end = new Date(returnDate.value);
    
    // Calculate difference in days (min 1 day)
    const diffTime = Math.abs(end - start);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) diffDays = 1;
    if (start > end) diffDays = 0; // Invalid date

    if (diffDays > 0) {
      const totalCost = diffDays * selectedCar.pricePerDay;
      const finalCost = totalCost + securityDeposit;

      totalDaysEl.textContent = `${diffDays} Day(s)`;
      totalPriceEl.textContent = `$${totalCost}`;
      securityDepositEl.textContent = `$${securityDeposit}`;
      finalTotalEl.textContent = `$${finalCost}`;
    } else {
      totalDaysEl.textContent = `-`;
      totalPriceEl.textContent = `-`;
      securityDepositEl.textContent = `$${securityDeposit}`;
      finalTotalEl.textContent = `-`;
    }
  };

  if (pickupDate && returnDate) {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    pickupDate.min = today;
    returnDate.min = today;

    pickupDate.addEventListener('change', () => {
      returnDate.min = pickupDate.value;
      updateSummary();
    });
    returnDate.addEventListener('change', updateSummary);
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation
      if (!selectedCar) {
        alert("Please select a car first.");
        return;
      }
      
      // Show confirmation modal
      if (bookingModal) {
        bookingModal.classList.add('show');
      }
    });
  }

  if (closeModalBtn && bookingModal) {
    closeModalBtn.addEventListener('click', () => {
      bookingModal.classList.remove('show');
      window.location.href = 'index.html'; // Redirect to home after booking
    });
  }
});
