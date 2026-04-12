import React, { useEffect, useRef } from 'react';

/* ── Parallax Star Canvas ── */
const StarCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Three layers — far, mid, near — for parallax depth
    const layers = [
      { count: 160, speed: 0.008, radius: 0.7, opacity: 0.45 },
      { count: 90,  speed: 0.02,  radius: 1.2, opacity: 0.65 },
      { count: 40,  speed: 0.04,  radius: 1.9, opacity: 0.9  },
    ];

    const stars = layers.flatMap(({ count, speed, radius, opacity }) =>
      Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        baseX: Math.random(),
        baseY: Math.random(),
        radius,
        speed,
        opacity: opacity * (0.6 + Math.random() * 0.4),
        twinkleOffset: Math.random() * Math.PI * 2,
      }))
    );

    const onMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMouseMove);

    let t = 0;
    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle radial nebula glow
      const grd = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.45, 0,
        canvas.width * 0.5, canvas.height * 0.45, canvas.width * 0.55
      );
      grd.addColorStop(0,   'rgba(107,94,255,0.07)');
      grd.addColorStop(0.5, 'rgba(107,94,255,0.025)');
      grd.addColorStop(1,   'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      stars.forEach(s => {
        const px = (s.baseX + mx * s.speed) % 1;
        const py = (s.baseY + my * s.speed) % 1;
        const x = ((px + 1) % 1) * canvas.width;
        const y = ((py + 1) % 1) * canvas.height;
        const twinkle = 0.55 + 0.45 * Math.sin(t * 1.6 + s.twinkleOffset);

        ctx.beginPath();
        ctx.arc(x, y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,255,${s.opacity * twinkle})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

/* ── Landing Page ── */
const Landing = ({ onStart }) => {
  return (
    <>
      <StarCanvas />

      {/* Glassmorphic Navbar */}
      <nav
        className="top-nav"
        style={{
          background: 'rgba(10,10,15,0.45)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          borderBottom: '1px solid rgba(107,94,255,0.18)',
          boxShadow: '0 1px 32px rgba(0,0,0,0.35)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <span
          className="logo"
          onClick={() => window.location.reload()}
          style={{ cursor: 'pointer' }}
          title="Go to home"
        >
          CraftFolio
        </span>
        <div style={{ display: 'flex', gap: '.75rem' }}>
        </div>
      </nav>

      {/* Hero — pushed below fixed nav */}
      <div
        className="landing-hero"
        style={{ position: 'relative', zIndex: 1, paddingTop: '7rem' }}
      >
        <div className="hero-glow" />
        <div className="hero-badge">✦ Portfolio builder, reimagined</div>

        {/* Title: 3 words per line */}
        <h1 className="hero-title" style={{ maxWidth: '760px' }}>
          Craft a portfolio<br />
          you're proud to<br />
          <span>ship ✦</span>
        </h1>

        <p className="hero-sub">
          Pick your theme, reorder sections, fill in your story — download a single,
          beautiful HTML file. Zero setup. Zero backend. Zero compromise.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn btn-primary btn-craft-now"
            onClick={onStart}
          >
            Craft Now →
          </button>
        </div>

        <div className="hero-features">
          {['10 curated themes', 'Drag-drop sections', '3 layouts per section', 'Single HTML download'].map(f => (
            <div key={f} className="feat-item">
              <div className="feat-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '1px',
          background: 'var(--border)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {[
          ['⬡', 'Theme Engine', '10 light & dark themes with CSS custom properties — swap with one click'],
          ['⬡', 'Drag & Reorder', 'Rearrange, exclude, and pick layouts for each section — live preview'],
          ['⬡', 'Instant Download', 'One-click download of a self-contained HTML file — host it anywhere'],
        ].map(([icon, title, desc], idx) => (
          <div key={idx} style={{ padding: '2rem', background: 'var(--surface)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.75rem', color: 'var(--accent)' }}>{icon}</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.5rem' }}>{title}</h3>
            <p style={{ fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Landing;
