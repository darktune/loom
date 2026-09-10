import { useMemo, useState } from 'react';

const currencies = {
  USD: { label: 'USD', symbol: '$', rate: 1 },
  NGN: { label: 'NGN', symbol: '₦', rate: 1500 },
};

const garmentDetails = [
  { title: 'Tailored Ivory Set', price: 840, badge: 'Signature drop', color: 'Ivory' },
  { title: 'Sculpted Agbada', price: 1180, badge: 'Bespoke fit', color: 'Ash' },
  { title: 'Evening Kaftan', price: 960, badge: 'New arrival', color: 'Cinder' },
];

const initialMeasurements = {
  height: '176',
  weight: '68',
  chest: '94',
  waist: '78',
  hip: '96',
};

const wizardSteps = ['Measurements', 'Reference', 'Preview'];

function formatPrice(value, currency) {
  const symbol = currencies[currency].symbol;
  const amount = value * currencies[currency].rate;

  return `${symbol}${amount.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;
}

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(true);
  const [wizardStep, setWizardStep] = useState(0);
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [selectedGarment, setSelectedGarment] = useState(garmentDetails[0]);

  const quotedPrice = useMemo(
    () => formatPrice(selectedGarment.price, currency),
    [selectedGarment.price, currency],
  );

  const wizardProgress = ((wizardStep + 1) / wizardSteps.length) * 100;

  const updateMeasurement = (field, value) => {
    setMeasurements((current) => ({ ...current, [field]: value }));
  };

  const nextStep = () => {
    setWizardStep((step) => Math.min(step + 1, wizardSteps.length - 1));
  };

  const previousStep = () => {
    setWizardStep((step) => Math.max(step - 1, 0));
  };

  return (
    <div className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">L</div>
          <span className="brand-name">LOOM</span>
        </div>

        <nav className="topnav" aria-label="Main navigation">
          <button className="nav-link active">Atelier</button>
          <button className="nav-link">Sizing</button>
          <button className="nav-link">Tailors</button>
          <button className="nav-link">Escrow</button>
        </nav>

        <div className="header-actions">
          <div className="currency-toggle" aria-label="Currency selector">
            {Object.entries(currencies).map(([key, value]) => (
              <button
                key={key}
                className={currency === key ? 'is-active' : ''}
                onClick={() => setCurrency(key)}
                type="button"
              >
                {value.label}
              </button>
            ))}
          </div>
          <button className="ghost-button small" type="button" onClick={() => setWizardOpen(true)}>
            AI sizing
          </button>
        </div>
      </header>

      <main className="main-layout">
        <section className="hero-copy">
          <p className="eyebrow">The Virtual Atelier</p>
          <h1>Luxury fashion, reimagined in 3D.</h1>
          <p className="subtitle">
            Explore bespoke silhouettes, preview tailored fit in real time, and pay with
            protected escrow in a single immersive showroom.
          </p>

          <div className="cta-row">
            <button className="primary-button" type="button" onClick={() => setCheckoutOpen(true)}>
              Enter the Atelier
            </button>
            <button className="ghost-button" type="button" onClick={() => setWizardOpen(true)}>
              Custom fit
            </button>
          </div>

          <div className="stats-row">
            <div>
              <strong>4.9/5</strong>
              <span>Client rating</span>
            </div>
            <div>
              <strong>48h</strong>
              <span>Design turnaround</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Escrow protected</span>
            </div>
          </div>
        </section>

        <section className="showroom-panel" aria-label="Featured garment">
          <div className="floating-card card-one">
            <span className="chip">Live fit</span>
            <strong>Tailor synced</strong>
          </div>

          <div className="product-frame">
            <div className="halo" />
            <div className="garment-figure">
              <div className="head" />
              <div className="torso" />
              <div className="arm arm-left" />
              <div className="arm arm-right" />
              <div className="skirt" />
              <div className="feature-dot dot-one" />
              <div className="feature-dot dot-two" />
              <div className="feature-dot dot-three" />
            </div>
          </div>

          <div className="floating-card card-two">
            <span className="tiny-label">Selected</span>
            <strong>{selectedGarment.title}</strong>
            <em>{quotedPrice}</em>
          </div>
        </section>
      </main>

      <section className="gallery-strip" aria-label="Garment collection">
        {garmentDetails.map((garment) => (
          <button
            key={garment.title}
            type="button"
            className={`gallery-item ${selectedGarment.title === garment.title ? 'selected' : ''}`}
            onClick={() => setSelectedGarment(garment)}
          >
            <span className="swatch" style={{ background: garment.color === 'Ivory' ? '#f5f1ea' : garment.color === 'Ash' ? '#d7d3cf' : '#2c2a2a' }} />
            <div>
              <strong>{garment.title}</strong>
              <small>{garment.badge}</small>
            </div>
            <span>{formatPrice(garment.price, currency)}</span>
          </button>
        ))}
      </section>

      {wizardOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Sizing wizard">
          <div className="modal-card">
            <button className="close-button" type="button" onClick={() => setWizardOpen(false)} aria-label="Close sizing wizard">
              ×
            </button>

            <div className="modal-header">
              <p className="eyebrow">AI sizing</p>
              <h2>Build your perfect digital fit</h2>
            </div>

            <div className="step-indicator" aria-label="Wizard step progress">
              {wizardSteps.map((step, index) => (
                <span key={step} className={index === wizardStep ? 'active' : ''} />
              ))}
            </div>

            <div className="progress-bar" aria-hidden="true">
              <span style={{ width: `${wizardProgress}%` }} />
            </div>

            {wizardStep === 0 && (
              <div className="wizard-form">
                <div className="field-row">
                  <label>
                    Height
                    <input type="number" value={measurements.height} onChange={(e) => updateMeasurement('height', e.target.value)} />
                  </label>
                  <label>
                    Weight
                    <input type="number" value={measurements.weight} onChange={(e) => updateMeasurement('weight', e.target.value)} />
                  </label>
                </div>
                <div className="field-row">
                  <label>
                    Chest
                    <input type="number" value={measurements.chest} onChange={(e) => updateMeasurement('chest', e.target.value)} />
                  </label>
                  <label>
                    Waist
                    <input type="number" value={measurements.waist} onChange={(e) => updateMeasurement('waist', e.target.value)} />
                  </label>
                </div>
                <label>
                  Hip
                  <input type="number" value={measurements.hip} onChange={(e) => updateMeasurement('hip', e.target.value)} />
                </label>
              </div>
            )}

            {wizardStep === 1 && (
              <div className="upload-panel">
                <div className="upload-area">
                  <span>Drop reference photo</span>
                  <small>or browse from your gallery</small>
                </div>
                <label className="prompt-box">
                  Describe your ideal silhouette
                  <textarea defaultValue="Fitted agbada with a softened shoulder and sculpted drape." />
                </label>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="preview-panel">
                <div className="mini-model">
                  <div className="model-head" />
                  <div className="model-body" />
                  <div className="model-skirt" />
                </div>
                <div className="preview-summary">
                  <strong>Suggested fit</strong>
                  <p>
                    Based on your measurements, the tailored silhouette will sit 8% closer at
                    the waist with a more relaxed drape through the shoulder.
                  </p>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="ghost-button small" onClick={previousStep} disabled={wizardStep === 0}>
                Back
              </button>
              <button type="button" className="primary-button" onClick={wizardStep === wizardSteps.length - 1 ? () => setWizardOpen(false) : nextStep}>
                {wizardStep === wizardSteps.length - 1 ? 'Finish' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <aside className="checkout-drawer" aria-label="Checkout panel">
          <div className="drawer-header">
            <div>
              <p className="eyebrow">Secure checkout</p>
              <h3>Complete your order</h3>
            </div>
            <button type="button" className="close-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">
              ×
            </button>
          </div>

          <div className="checkout-summary">
            <div className="summary-art" />
            <div>
              <strong>{selectedGarment.title}</strong>
              <small>Made for your profile</small>
            </div>
            <span>{quotedPrice}</span>
          </div>

          <div className="info-badge">
            Bespoke escrow protected ✓
          </div>

          <div className="checkout-form">
            <label>
              Full name
              <input type="text" defaultValue="Ada Okafor" />
            </label>
            <label>
              Delivery country
              <input type="text" defaultValue="United Kingdom" />
            </label>
            <label>
              Payment method
              <input type="text" defaultValue="Kora Virtual Account" />
            </label>
          </div>

          <button type="button" className="primary-button wide" onClick={() => setCheckoutOpen(false)}>
            Confirm & pay
          </button>
        </aside>
      )}
    </div>
  );
}
