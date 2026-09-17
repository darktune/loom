import { useState } from 'react';

const features = [
  {
    id: 'showroom',
    label: '3D Showroom',
    title: 'Interactive 3D Garment Showroom',
    subtitle: 'Inspect museum-style 3D drapes with dynamic lighting, material reflections, and 360-degree rotation.',
    badge: 'Museum Experience',
    metrics: [
      { number: '360°', label: 'Interactive Rotation' },
      { number: 'PBR', label: 'Real-time Shaders' },
      { number: 'Ultra-HD', label: 'Garment Fidelity' },
    ],
    preview: {
      type: 'showroom',
      tag: 'Studio Mode',
      title: 'Bespoke Agbada & Kaftan Silhouette',
      description: 'Rendered in real-time using Three.js and React Three Fiber.',
    },
  },
  {
    id: 'sizing',
    label: 'AI Sizing Wizard',
    title: 'Precision Proportional Mannequin',
    subtitle: 'Calibrate your exact height, chest, waist, and hip measurements onto a responsive 3D mannequin.',
    badge: 'Fit Calibration',
    metrics: [
      { number: '5', label: 'Key Fit Points' },
      { number: '1:1', label: 'Proportional Scale' },
      { number: 'Instant', label: 'Visual Feedback' },
    ],
    preview: {
      type: 'sizing',
      tag: 'Proportion Wizard',
      title: 'Real-Time Body Mesh Scaling',
      description: 'Height 176cm · Chest 94cm · Waist 78cm · Hip 96cm',
    },
  },
  {
    id: 'conceptor',
    label: 'AI Conceptor',
    title: 'Text & Image to 3D Generation',
    subtitle: 'Describe your dream silhouette or upload reference images to generate 3D meshes using Tripo AI.',
    badge: 'Tripo Engine v3.1',
    metrics: [
      { number: '1-4', label: 'Multi-View Inputs' },
      { number: '30k', label: 'Face Mesh' },
      { number: 'AI', label: 'Prompt Synthesis' },
    ],
    preview: {
      type: 'conceptor',
      tag: 'Generative Studio',
      title: 'Fitted Agbada with Sculpted Drape',
      description: 'Generates production briefs ready for master tailors.',
    },
  },
  {
    id: 'checkout',
    label: 'Global Checkout',
    title: 'Multi-Currency Global Commerce',
    subtitle: 'Seamless international checkout in USD or NGN with instant tailor order specifications.',
    badge: 'Global Commerce',
    metrics: [
      { number: 'USD/NGN', label: 'Multi-Currency' },
      { number: 'Instant', label: 'Order Processing' },
      { number: 'Global', label: 'Worldwide Shipping' },
    ],
    preview: {
      type: 'checkout',
      tag: 'E-commerce Checkout',
      title: 'Seamless Multi-Currency Checkout',
      description: 'Instant conversion between USD ($) and NGN (₦).',
    },
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Select Garment & Silhouette',
    description: 'Explore signature garment drops from featured designers in our 3D showroom and inspect details.',
  },
  {
    step: '02',
    title: 'Calibrate Fit & Reference Textures',
    description: 'Enter your exact body measurements and optionally attach fabric pattern photos to your design brief.',
  },
  {
    step: '03',
    title: 'Download Brief & Complete Order',
    description: 'Export a tailor-ready design brief and complete your order with dynamic currency conversion.',
  },
];

export default function LandingPage({ enterAtelier, openSizing, currency, setCurrency, currencies }) {
  const [activeTab, setActiveTab] = useState('showroom');
  const currentFeature = features.find((f) => f.id === activeTab) || features[0];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="badge-pill">
            <span className="badge-dot" />
            <span>THE VIRTUAL ATELIER</span>
          </div>
          <h1 className="landing-title">
            Where Fashion Meets <span className="gradient-text">Dimension</span>.
          </h1>
          <p className="landing-subtitle">
            Experience bespoke luxury fashion in interactive 3D. Inspect garment drapes, calibrate your custom body fit, and export tailor-ready briefs.
          </p>

          <div className="landing-cta-row">
            <button className="primary-button landing-cta" type="button" onClick={enterAtelier}>
              Enter 3D Atelier
            </button>
            <button className="ghost-button landing-cta" type="button" onClick={openSizing}>
              Custom Fit Wizard
            </button>
          </div>

          <div className="landing-stats">
            <div className="stat-card">
              <strong className="stat-number">3D</strong>
              <span className="stat-desc">Interactive Showroom</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <strong className="stat-number">Tripo AI</strong>
              <span className="stat-desc">3D Mesh Generator</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <strong className="stat-number">USD / NGN</strong>
              <span className="stat-desc">Multi-Currency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase Switcher */}
      <section className="landing-showcase-section">
        <div className="section-header text-center">
          <span className="eyebrow">INTERACTIVE ENGINE</span>
          <h2 className="section-title">Designed for Patrons & Master Tailors</h2>
          <p className="section-sub">Explore the core technology driving the Loom 3D digital showroom.</p>
        </div>

        {/* Feature Pill Tabs */}
        <div className="feature-tabs-bar">
          {features.map((feature) => (
            <button
              key={feature.id}
              className={`feature-tab-pill ${activeTab === feature.id ? 'active' : ''}`}
              onClick={() => setActiveTab(feature.id)}
              type="button"
            >
              <span className="tab-label">{feature.label}</span>
            </button>
          ))}
        </div>

        {/* Active Feature Card Preview */}
        <div className="feature-preview-card">
          <div className="preview-card-header">
            <div>
              <span className="chip">{currentFeature.badge}</span>
              <h3 className="feature-card-title">{currentFeature.title}</h3>
              <p className="feature-card-sub">{currentFeature.subtitle}</p>
            </div>
            <button className="ghost-button small" onClick={enterAtelier}>
              Try in Studio →
            </button>
          </div>

          <div className="preview-card-body">
            <div className="preview-viewport-box">
              <div className="viewport-overlay-tag">{currentFeature.preview.tag}</div>
              <div className="viewport-center-graphic">
                <div className="graphic-sphere" />
                <div className="graphic-label">{currentFeature.preview.title}</div>
                <small className="graphic-sub">{currentFeature.preview.description}</small>
              </div>
            </div>

            <div className="preview-metrics-sidebar">
              <h4>Key Capabilities</h4>
              <div className="metrics-list">
                {currentFeature.metrics.map((m) => (
                  <div key={m.label} className="metric-item">
                    <strong>{m.number}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="landing-bento-section">
        <div className="section-header">
          <span className="eyebrow">THE DIGITAL ATELIER</span>
          <h2 className="section-title">Reimagining Craftsmanship</h2>
        </div>

        <div className="bento-grid">
          {/* Card 1: Museum Showroom */}
          <div className="bento-card card-large">
            <div className="bento-card-badge">01 • SHOWROOM</div>
            <h3>3D Garment Inspection</h3>
            <p>High-fidelity procedural fabric shaders, realistic lighting setups, and real-time physical drapes.</p>
            <div className="bento-visual visual-3d">
              <div className="garment-sketch-glow" />
              <div className="bento-tag">Museum Quality</div>
            </div>
          </div>

          {/* Card 2: AI Sizing */}
          <div className="bento-card card-medium">
            <div className="bento-card-badge">02 • PRECISION</div>
            <h3>Proportional Body Scaling</h3>
            <p>Input height, chest, waist, and hips to morph an interactive 3D mannequin to your exact fit.</p>
            <div className="bento-visual visual-sizing">
              <div className="sizing-ruler-grid">
                <span>Chest 94cm</span>
                <span>Waist 78cm</span>
                <span>Hip 96cm</span>
              </div>
            </div>
          </div>

          {/* Card 3: AI Conceptor */}
          <div className="bento-card card-medium">
            <div className="bento-card-badge">03 • GENERATIVE</div>
            <h3>Tripo AI Concepting</h3>
            <p>Turn prompt briefs and multi-view reference photos into 3D garment geometries in seconds.</p>
            <div className="bento-visual visual-tripo">
              <span className="mesh-pill">Tripo v3.1 API</span>
            </div>
          </div>

          {/* Card 4: Global Checkout */}
          <div className="bento-card card-large">
            <div className="bento-card-badge">04 • COMMERCE</div>
            <h3>Multi-Currency Global Checkout</h3>
            <p>Seamless international currency conversion ($ / ₦) with instant tailor order briefs.</p>
            <div className="bento-visual visual-checkout">
              <div className="checkout-currency-badge">USD $1 = ₦1,500 NGN</div>
            </div>
          </div>
        </div>
      </section>

      {/* How Loom Works (3-Step Pipeline) */}
      <section className="landing-pipeline-section">
        <div className="section-header text-center">
          <span className="eyebrow">WORKFLOW</span>
          <h2 className="section-title">Up and Running in Minutes</h2>
          <p className="section-sub">From digital exploration to master tailor execution.</p>
        </div>

        <div className="pipeline-steps-grid">
          {workflowSteps.map((step) => (
            <div key={step.step} className="pipeline-step-card">
              <div className="step-number-bubble">{step.step}</div>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center margin-top-lg">
          <button className="primary-button landing-cta" type="button" onClick={enterAtelier}>
            Launch Loom Studio Now
          </button>
        </div>
      </section>

      {/* Featured Designer Section */}
      <section className="landing-partner-section">
        <div className="partner-card-glow">
          <div className="partner-info">
            <span className="eyebrow">FEATURED DESIGNER</span>
            <h2>Abraham's Collection</h2>
            <p>
              Hand-crafted tailoring meets next-generation 3D spatial technology. Explore signature Agbada, Kaftan, and suit collections available on Loom.
            </p>
            <button className="ghost-button" type="button" onClick={enterAtelier}>
              Explore Collection
            </button>
          </div>
          <div className="partner-visual">
            <div className="garment-card-preview">
              <span className="brand-tag">Featured Collection</span>
              <strong className="garment-name">Tailored Ivory Set</strong>
              <small className="garment-price">$840 • ₦1,260,000</small>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/brand/loom-wordmark.png" alt="loom" className="footer-logo" width="140" height="46" />
            <p>Where Fashion Meets Dimension.</p>
          </div>
          <div className="footer-links">
            <div className="link-col">
              <h4>Atelier</h4>
              <button type="button" onClick={enterAtelier}>3D Showroom</button>
              <button type="button" onClick={openSizing}>Sizing Wizard</button>
            </div>
            <div className="link-col">
              <h4>Technology</h4>
              <span>React 19 + R3F</span>
              <span>Tripo AI API</span>
              <span>Global E-Commerce</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Loom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
