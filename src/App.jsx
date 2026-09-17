import { useEffect, useMemo, useRef, useState } from 'react';
import ReferenceUpload, { ReferenceCard, usePhotoUrl } from './components/ReferenceUpload';
import ConstructionPanel from './components/ConstructionPanel';
import { defaultConstruction } from './lib/construction';
import GenerationPanel from './components/GenerationPanel';
import { useGeneration } from './lib/useGeneration';
import GarmentViewer from './components/GarmentViewer';
import { validateMeasurements } from './lib/sizing';

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
  const [construction, setConstruction] = useState(defaultConstruction);
  const [appliedConstruction, setAppliedConstruction] = useState(defaultConstruction);
  const [currency, setCurrency] = useState('USD');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [appliedMeasurements, setAppliedMeasurements] = useState(initialMeasurements);
  const measurementErrors = validateMeasurements(measurements);
  const [selectedGarment, setSelectedGarment] = useState(garmentDetails[0]);
  const [references, setReferences] = useState([]);
  const reference = references.find((item) => item.file.type.startsWith('image/'))?.file || null;
  const [referenceBusy, setReferenceBusy] = useState(false);
  const [generated, setGenerated] = useState(null);
  const generation = useGeneration(setGenerated);
  const [useFabric, setUseFabric] = useState(false);
  const referenceUrl = usePhotoUrl(reference);
  const [prompt, setPrompt] = useState('Fitted agbada with a softened shoulder and sculpted drape.');
  const [info, setInfo] = useState(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const [exportedBrief, setExportedBrief] = useState('');
  const showroom = useRef();
  const dialog = useRef();
  const openSizing = () => { setInfo(null); setCheckoutOpen(false); setWizardStep(0); setWizardOpen(true); };
  const enterAtelier = () => { setInfo(null); setCheckoutOpen(false); setWizardOpen(false); showroom.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); showroom.current?.focus({ preventScroll: true }); };
  const openCheckout = () => { setWizardOpen(false); setInfo(null); setOrderSaved(false); setCheckoutOpen(true); };
  useEffect(() => {
    if (!wizardOpen && !checkoutOpen && !info) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector('button')?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') { setWizardOpen(false); setCheckoutOpen(false); setInfo(null); }
      if (event.key === 'Tab') {
        const elements = [...(dialog.current?.querySelectorAll('button:not(:disabled), input:not([hidden]), select, textarea, [tabindex="0"]') || [])];
        const first = elements[0], last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [wizardOpen, checkoutOpen, info]);
  const downloadBrief = () => {
    const brief = { garment: selectedGarment.title, measurements: appliedMeasurements, construction: appliedConstruction, units: { length: 'cm', weight: 'kg' }, prompt, references: references.map((item) => ({ filename: item.file.name, type: item.file.type, role: item.role })), generation: generated ? { taskId: generated.taskId, sourceBrief: generated.snapshot } : null, note: 'Local design brief only. No order placed and no payment collected. Model adjustment is approximate, not validated fit.' };
    const serialized = JSON.stringify(brief, null, 2);
    setExportedBrief(serialized);
    const url = URL.createObjectURL(new Blob([serialized], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'loom-design-brief.json'; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setOrderSaved(true);
  };

  const quotedPrice = useMemo(
    () => formatPrice(selectedGarment.price, currency),
    [selectedGarment.price, currency],
  );

  const wizardProgress = ((wizardStep + 1) / wizardSteps.length) * 100;

  const updateMeasurement = (field, value) => {
    setMeasurements((current) => ({ ...current, [field]: value }));
  };

  const nextStep = () => {
    if (Object.keys(measurementErrors).length) return;
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
        <a className="brand-block" href="#" aria-label="loom — The Virtual Atelier" onClick={(event) => { event.preventDefault(); enterAtelier(); }}>
          <img className="brand-logo" src="/brand/loom-wordmark.png" alt="loom" width="174" height="58" />
        </a>

        <nav className="topnav" aria-label="Main navigation">
          <button className="nav-link" onClick={enterAtelier}>Atelier</button>
          <button className="nav-link" onClick={openSizing}>Sizing</button>
          <button className="nav-link" onClick={() => { setWizardOpen(false); setCheckoutOpen(false); setInfo('Tailors'); }}>Tailors</button>
          <button className="nav-link" onClick={() => { setWizardOpen(false); setCheckoutOpen(false); setInfo('Escrow'); }}>Escrow</button>
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
          <button className="ghost-button small" type="button" onClick={openSizing}>
            Sizing preview
          </button>
        </div>
      </header>

      <main className="main-layout">
        <section className="hero-copy">
          <p className="eyebrow">The Virtual Atelier</p>
          <h1>Luxury fashion, reimagined in 3D.</h1>
          <p className="subtitle">
            Explore bespoke silhouettes and preview your proportions in an interactive showroom. Save a design brief for your tailor.
          </p>

          <div className="cta-row">
            <button className="primary-button" type="button" onClick={enterAtelier}>
              Enter the Atelier
            </button>
            <button className="ghost-button" type="button" onClick={openSizing}>
              Custom fit
            </button>
          </div>

          <div className="stats-row">
            <div>
              <strong>3D</strong>
              <span>Interactive previews</span>
            </div>
            <div>
              <strong>Custom</strong>
              <span>Measurement profiles</span>
            </div>
            <div>
              <strong>Demo</strong>
              <span>No payments collected</span>
            </div>
          </div>
        </section>

        <section ref={showroom} tabIndex={-1} className="showroom-panel" aria-label="Featured garment">
          <div className="floating-card card-one">
            <span className="chip">3D studio</span>
            <strong>Explore your silhouette</strong>
          </div>

          <div className="product-frame">
            <GarmentViewer garment={selectedGarment} measurements={appliedMeasurements} construction={appliedConstruction} fabricUrl={useFabric ? referenceUrl : ''} generated={generated} />
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

      <div className="order-actions"><p>Preview prices · Fixed demo rate: $1 = ₦1,500</p><button className="primary-button" onClick={openCheckout}>Review selected garment</button></div>

      {info && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={info}><div className="modal-card" ref={dialog}>
        <button className="close-button" onClick={() => setInfo(null)} aria-label="Close information">×</button>
        <h2>{info === 'Tailors' ? "Abraham’s Collection" : 'Payments & escrow'}</h2>
        <p>{info === 'Tailors' ? 'Our flagship design partner. Prepare your measurements and reference, then download a brief to share yourself. Tailor matching and live chat are not connected yet.' : 'This is a showroom prototype. Kora payments and escrow are not connected, and no funds are collected or protected here yet.'}</p>
        {info === 'Tailors' && <button className="primary-button" onClick={openSizing}>Prepare my fit</button>}
      </div></div>}

      {wizardOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Sizing wizard">
          <div className="modal-card" ref={dialog}>
            <button className="close-button" type="button" onClick={() => setWizardOpen(false)} aria-label="Close sizing wizard">
              ×
            </button>

            <div className="modal-header">
              <p className="eyebrow">Sizing preview</p>
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
                    Height (cm)
                    <input type="number" value={measurements.height} onChange={(e) => updateMeasurement('height', e.target.value)} />
                  </label>
                  <label>
                    Weight (kg)
                    <input type="number" value={measurements.weight} onChange={(e) => updateMeasurement('weight', e.target.value)} />
                  </label>
                </div>
                <div className="field-row">
                  <label>
                    Chest (cm)
                    <input type="number" value={measurements.chest} onChange={(e) => updateMeasurement('chest', e.target.value)} />
                  </label>
                  <label>
                    Waist (cm)
                    <input type="number" value={measurements.waist} onChange={(e) => updateMeasurement('waist', e.target.value)} />
                  </label>
                </div>
                <label>
                  Hip (cm)
                  <input type="number" value={measurements.hip} onChange={(e) => updateMeasurement('hip', e.target.value)} />
                </label>
                {Object.entries(measurementErrors).map(([field, message]) => <p className="measurement-error" role="alert" key={field}>{field}: {message}</p>)}
              </div>
            )}

            {wizardStep === 1 && (
              <div className="upload-panel">
                <ReferenceUpload items={references} onChange={setReferences} onBusyChange={setReferenceBusy} />
                {reference && <label className="fabric-option"><input type="checkbox" checked={useFabric} onChange={(event) => setUseFabric(event.target.checked)} /> Use this image as fabric texture on the studio mannequin</label>}
                <p className="reference-help">The optional texture preview uses the first image and does not change geometry. To create new geometry, assign generation views and use Generate below.</p>
                <label className="prompt-box">
                  Describe your ideal silhouette
                  <textarea value={prompt} maxLength={2000} onChange={(event) => setPrompt(event.target.value)} />
                </label>
                <ConstructionPanel measurements={measurements} settings={construction} onChange={setConstruction} references={references} />
                <GenerationPanel generation={generation} items={references} measurements={measurements} prompt={prompt} construction={construction} disabled={referenceBusy || Object.keys(measurementErrors).length > 0} />
              </div>
            )}

            {wizardStep === 2 && (
              <div className="preview-panel">
                <GarmentViewer garment={selectedGarment} measurements={measurements} construction={construction} compact fabricUrl={useFabric ? referenceUrl : ''} generated={generated} />
                <div className="preview-summary">
                  <strong>Proportion preview</strong>
                  <p>{references.length} references in this design brief.</p>
                  {generated && <p>Generated model is available. Select Generated garment to inspect it and enable approximate fitting.</p>}
                  {prompt && <p>Design brief: {prompt}</p>}
                  <p>
                    Height {measurements.height} cm · Chest {measurements.chest} cm · Waist {measurements.waist} cm · Hip {measurements.hip} cm.
                    This illustrative model uses your measurements, not an AI fit prediction or a cloth simulation. Weight is recorded but does not determine body shape. Confirm final sizing with your tailor.
                  </p>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="ghost-button small" onClick={previousStep} disabled={wizardStep === 0}>
                Back
              </button>
              <button type="button" className="primary-button" disabled={referenceBusy || Object.keys(measurementErrors).length > 0} onClick={wizardStep === wizardSteps.length - 1 ? () => { setAppliedMeasurements({ ...measurements }); setAppliedConstruction({ ...construction }); setWizardOpen(false); } : nextStep}>
                {wizardStep === wizardSteps.length - 1 ? 'Finish' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <aside ref={dialog} className="checkout-drawer" role="dialog" aria-modal="true" aria-label="Order preview">
          <div className="drawer-header">
            <div>
              <p className="eyebrow">Demo order preview</p>
              <h3>Review your design</h3>
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
            Payments unavailable · No order will be placed
          </div>

          <div className="checkout-form"><p>Height {appliedMeasurements.height} cm · Chest {appliedMeasurements.chest} cm · Waist {appliedMeasurements.waist} cm · Hip {appliedMeasurements.hip} cm</p><p>{prompt}</p><div className="reference-grid">{references.map((item) => <ReferenceCard key={item.id} item={item} />)}</div><p>The downloaded brief includes reference filenames and generation task details. Share the files separately with your tailor.</p></div>

          <button type="button" className="primary-button wide" onClick={downloadBrief}>
            Download design brief
          </button>
          {orderSaved && <><p role="status">Download requested. If your browser blocks it, copy the brief below. No order was placed or payment collected.</p><label className="prompt-box">Copyable design brief<textarea readOnly value={exportedBrief} rows={8} onFocus={(event) => event.target.select()} /></label></>}
        </aside>
      )}
    </div>
  );
}
