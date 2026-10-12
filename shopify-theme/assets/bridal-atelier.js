/**
 * Luxe Bridal Atelier - Dynamic Theme Behaviors
 * Handles Sizing Switcher, Event Date Calculations, and Final Sale Enforcement
 */

document.addEventListener('DOMContentLoaded', () => {
  initBridalProductModule();
});

function initBridalProductModule() {
  const dateInput = document.getElementById('bridalWeddingDate');
  if (dateInput) {
    // Set default placeholder date 60 days in the future
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 60);
    dateInput.value = defaultDate.toISOString().split('T')[0];
    validateEventBuffer(dateInput.value);
  }

  // Intercept Add to Cart to enforce validation
  const addToCartForms = document.querySelectorAll('form[action*="/cart/add"]');
  addToCartForms.forEach(form => {
    form.addEventListener('submit', handleBridalFormSubmit);
  });
}

function switchSizingMode(mode) {
  const sizingInput = document.getElementById('bridalSizingModeInput');
  const tabStandard = document.getElementById('tabStandard');
  const tabBespoke = document.getElementById('tabBespoke');
  const panelStandard = document.getElementById('panelStandardSizes');
  const panelBespoke = document.getElementById('panelBespokeNotice');

  if (!sizingInput) return;

  sizingInput.value = mode;

  if (mode === 'Standard') {
    tabStandard.classList.add('active');
    tabBespoke.classList.remove('active');
    panelStandard.classList.remove('hidden');
    panelBespoke.classList.add('hidden');
  } else {
    tabBespoke.classList.add('active');
    tabStandard.classList.remove('active');
    panelStandard.classList.add('hidden');
    panelBespoke.classList.remove('hidden');
  }
}

function validateEventBuffer(selectedDateStr) {
  if (!selectedDateStr) return;

  const eventTime = new Date(selectedDateStr).getTime();
  const now = new Date().getTime();
  const diffDays = Math.ceil((eventTime - now) / (1000 * 60 * 60 * 24));

  const badge = document.getElementById('bufferStatusBadge');
  const explainer = document.getElementById('bufferExplainerText');

  if (!badge || !explainer) return;

  if (diffDays < 28) {
    badge.className = 'buffer-badge buffer-rush';
    badge.innerText = `⚠️ Rush Order (${diffDays} Days)`;
    explainer.innerText = 'Event is in less than 4 weeks. Requires urgent artisan overtime to guarantee completion.';
  } else if (diffDays <= 44) {
    badge.className = 'buffer-badge buffer-tight';
    badge.innerText = `Priority Slot (${diffDays} Days)`;
    explainer.innerText = 'Tight timeline. Your garment will be expedited and dispatched 10 business days before the wedding.';
  } else {
    badge.className = 'buffer-badge buffer-good';
    badge.innerText = `Comfortable Buffer (${diffDays} Days) ✓`;
    explainer.innerText = 'Perfect timeline. Ample time for full bespoke zardozi embroidery, precision tailoring, and 5-point QC.';
  }
}

function handleBridalFormSubmit(e) {
  const dateInput = document.getElementById('bridalWeddingDate');
  const consentInput = document.getElementById('finalSaleConsentInput');

  if (dateInput && !dateInput.value) {
    e.preventDefault();
    alert('Please select your wedding or event date to proceed with your order.');
    dateInput.focus();
    return false;
  }

  if (consentInput && !consentInput.checked) {
    e.preventDefault();
    alert('Please acknowledge and accept the Final Sale Policy for made-to-order couture garments.');
    consentInput.focus();
    return false;
  }

  return true;
}

function openMeasurementGuideModal() {
  alert('Standard Sizing Guide:\n\n• XS: Bust 32", Waist 26", Hips 36"\n• S: Bust 34", Waist 28", Hips 38"\n• M: Bust 36", Waist 30", Hips 40"\n• L: Bust 38", Waist 32", Hips 42"\n• XL: Bust 40", Waist 34", Hips 44"\n• 2XL: Bust 43", Waist 37", Hips 47"\n• 3XL: Bust 46", Waist 40", Hips 50"\n\n*All sizes feature 3" internal seam margins.');
}
