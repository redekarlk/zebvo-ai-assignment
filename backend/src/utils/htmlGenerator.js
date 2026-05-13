export const generateHTML = (project) => {
  try {
    const { businessInfo, theme, seo, sections, images: projectImages } = project;

    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);
    const escapeHtml = (value = '') => String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    const escapeAttr = (value = '') => escapeHtml(String(value)).replace(/`/g, '&#96;');
    const resolveImage = (value) => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'object') {
        return value.url || value.url_ref || value.dataUrl || '';
      }
      return '';
    };

    const colorVars = Object.entries(theme?.colors || {}).map(([key, value]) => {
      return `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`;
    }).join('\n');

    const styles = `
      :root {
        ${colorVars}
        --radius: ${theme?.layout?.radius || '12px'};
        --font-heading: "${theme?.typography?.headingFontFamily || 'serif'}";
        --font-body: "${theme?.typography?.fontFamily || 'sans-serif'}";
      }
      
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@800;900&display=swap');

      * { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { font-family: var(--font-body); background: var(--background); color: var(--text-primary); line-height: 1.7; -webkit-font-smoothing: antialiased; }
      
      .container { max-width: 1240px; margin: 0 auto; padding: 0 2.5rem; }
      section { 
        padding: 9rem 0; 
        position: relative; 
        overflow: hidden; 
        border-bottom: 1px solid var(--border, rgba(0,0,0,0.08));
      }
      section:last-of-type { border-bottom: none; }
      
      h1, h2, h3 { font-family: var(--font-heading); line-height: 1.1; letter-spacing: -0.03em; word-wrap: break-word; overflow-wrap: break-word; }
      h1 { font-size: clamp(3.5rem, 10vw, 6.5rem); font-weight: 900; }
      h2 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; text-align: center; margin-bottom: 5rem; }
      h3 { font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; }

      p { color: var(--text-secondary); font-size: 1.125rem; }

      .btn { 
        display: inline-flex; align-items: center; justify-content: center; 
        padding: 1.25rem 3.5rem; background: var(--primary); color: white; 
        text-decoration: none; border-radius: var(--radius); 
        font-weight: 800; transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1); 
        border: none; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.9rem;
        box-shadow: 0 10px 30px -10px var(--primary);
      }
      .btn:hover { transform: translateY(-4px) scale(1.02); filter: brightness(1.1); box-shadow: 0 20px 40px -10px var(--primary); }

      /* Components */
      .card { 
        padding: 3.5rem; border-radius: var(--radius); 
        background: var(--surface); border: 1px solid var(--border, rgba(0,0,0,0.05)); 
        transition: 0.4s; box-shadow: 0 10px 30px rgba(0,0,0,0.02); 
      }
      .card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px rgba(0,0,0,0.08); border-color: var(--primary); }

      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem; }
      .flex { display: flex; align-items: center; gap: 7rem; }
      .flex-reverse { flex-direction: row-reverse; }

      /* Specialized Lists */
      .logo-strip { display: flex; flex-wrap: wrap; justify-content: center; gap: 5rem; opacity: 0.5; filter: grayscale(1); padding: 2rem 0; }
      .logo-item { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.05em; }

      .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 5rem; counter-reset: step; }
      .step-item { position: relative; }
      .step-item::before { 
        counter-increment: step; content: counter(step); 
        display: block; font-size: 5rem; font-weight: 900; color: var(--primary); 
        opacity: 0.1; margin-bottom: -2.5rem; line-height: 1; 
      }

      .testimonial-card { font-style: italic; position: relative; }
      .testimonial-card::after { content: '”'; position: absolute; top: 1rem; right: 2rem; font-size: 8rem; opacity: 0.05; line-height: 1; }

      /* FAQ Accordion */
      .faq-item { margin-bottom: 1.5rem; cursor: pointer; border: 1px solid var(--border, rgba(0,0,0,0.05)); }
      .faq-header { display: flex; justify-content: space-between; align-items: center; padding: 2rem; font-weight: 700; font-size: 1.25rem; transition: 0.3s; }
      .faq-item.active .faq-header { color: var(--primary); border-bottom: 1px solid var(--border, rgba(0,0,0,0.05)); }
      .faq-answer { display: none; padding: 2rem; opacity: 0.8; }
      .faq-item.active .faq-answer { display: block; animation: slideDown 0.3s ease-out; }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

      /* Sticky Navbar */
      nav { 
        position: sticky; top: 0; z-index: 1000; 
        background: rgba(255,255,255,0.96); backdrop-filter: blur(18px); 
        border-bottom: 1px solid var(--border, rgba(0,0,0,0.06)); 
        box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
        padding: 1rem 0; 
      }
      .nav-container { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; }
      .brand { display: inline-flex; align-items: center; gap: 0.85rem; font-weight: 900; font-size: 1.45rem; color: var(--primary); text-decoration: none; white-space: nowrap; letter-spacing: -0.05em; }
      .brand-mark {
        width: 2.25rem; height: 2.25rem; border-radius: 0.85rem; background: var(--primary);
        display: inline-flex; align-items: center; justify-content: center; color: white;
        font-size: 1rem; box-shadow: 0 10px 24px -12px var(--primary);
      }
      .nav-links { display: flex; gap: 1.75rem; align-items: center; flex-wrap: wrap; justify-content: center; }
      .nav-link { 
        text-decoration: none; color: var(--text-primary); 
        font-weight: 700; font-size: 0.82rem; text-transform: uppercase; 
        letter-spacing: 0.12em; opacity: 0.7; transition: 0.3s; 
        padding: 0.35rem 0.1rem;
      }
      .nav-link:hover { opacity: 1; color: var(--primary); transform: translateY(-1px); }
      .nav-cta {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 0.85rem 1.4rem; background: var(--primary); color: white;
        text-decoration: none; border-radius: 999px; font-weight: 800;
        font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase;
        box-shadow: 0 12px 28px -14px var(--primary);
        transition: 0.3s ease;
      }
      .nav-cta:hover { transform: translateY(-2px); filter: brightness(1.05); }
      .faq-container { display: grid; gap: 1rem; }

      @media (max-width: 1024px) { 
        .flex, .flex-reverse { flex-direction: column !important; text-align: center; gap: 4rem; }
        section { padding: 6rem 0; }
        .nav-container { flex-direction: column; gap: 1rem; text-align: center; justify-content: center; padding: 1.5rem; }
        .nav-links { display: none !important; }
        .nav-cta { display: none !important; }
        .brand { justify-content: center; width: 100%; font-size: 1.3rem; }
      }

      @media (max-width: 640px) {
        h1 { font-size: clamp(2.5rem, 12vw, 4rem); }
        h2 { font-size: clamp(2rem, 8vw, 3rem); margin-bottom: 2.5rem; }
        section { padding: 4.5rem 0; }
        .container { padding: 0 1.5rem; }
        nav { padding: 1rem 0; }
        .brand { font-size: 1.15rem; }
      }
    `;

    const getVal = (props, keys) => {
      for (const k of keys) {
        if (hasOwn(props, k) && props[k] !== null && props[k] !== undefined) {
          return props[k];
        }
      }
      return null;
    };

    const renderText = (val) => {
      if (!val) return '';
      const content = Array.isArray(val) ? val.join('\n\n') : String(val);

      // Split into paragraphs/blocks
      const blocks = content.split('\n\n').filter(b => b.trim());

      return blocks.map(block => {
        // Handle lists
        if (block.trim().startsWith('- ') || block.trim().startsWith('* ')) {
          const items = block.split('\n').filter(li => li.trim());
          const listItems = items.map(item => `<li>${escapeHtml(item.replace(/^[-*]\s+/, ''))}</li>`).join('');
          return `<ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; list-style-type: disc;">${listItems}</ul>`;
        }

        // Handle plain paragraphs
        return `<p style="margin-bottom: 1.5rem;">${escapeHtml(block).replace(/\n/g, '<br>')}</p>`;
      }).join('');
    };

    const findList = (type, variant, props) => {
      const byType = {
        faq: ['faqItems', 'questions', 'items'],
        testimonials: ['testimonials', 'reviews', 'items'],
        services: variant.includes('steps') ? ['steps', 'serviceItems', 'cards', 'items'] : ['serviceItems', 'cards', 'items', 'steps'],
        features: ['cards', 'items', 'serviceItems', 'logos'],
      };
      const fallback = ['logos', 'cards', 'steps', 'reviews', 'questions', 'serviceItems', 'faqItems', 'testimonials', 'items', 'links'];
      const keys = byType[type] || fallback;
      for (const k of keys) if (Array.isArray(props[k])) return props[k];
      return [];
    };

    const renderSection = (section) => {
      if (!section || section.visible === false) return '';
      const { type, variant = '' } = section;
      const props = section.props || section;
      const image = resolveImage(projectImages?.[type]) || resolveImage(props.image) || resolveImage(props.imageUrl) || '';
      const sectionId = section.id || `${type}-${section.order ?? 1}`;

      const headline = getVal(props, ['headline', 'title', 'question']);
      const subheadline = getVal(props, ['subheadline', 'description', 'subtitle', 'label']);
      const content = getVal(props, ['content', 'text', 'answer', 'body']);
      const cta = getVal(props, ['ctaText', 'buttonText', 'label', 'action']);
      const list = findList(type, variant, props);

      const isCentered = variant.includes('centered') || type === 'hero' || type === 'cta';
      const isReverse = variant.includes('reverse') || variant.includes('right') || variant.includes('left-image');

      let listHTML = '';
      if (list.length > 0) {
        const isSteps = variant.includes('steps');
        const isLogos = variant.includes('logo') || (Array.isArray(props.logos) && props.logos.length > 0);
        const isFaq = type === 'faq' || variant.includes('accordion');
        const isReviews = type === 'testimonials' || variant.includes('quote') || Array.isArray(props.testimonials) || Array.isArray(props.reviews);

        listHTML = `
          <div class="${isLogos ? 'logo-strip' : isSteps ? 'steps-grid' : isFaq ? 'faq-container' : 'grid'}">
            ${list.map(item => {
          const itemTitle = typeof item === 'string' ? item : (item.title || item.question || item.name || item.label || item.author || '');
          const itemText = typeof item === 'string' ? '' : (item.description || item.answer || item.quote || item.text || item.body || '');

          return `
                <div class="${isFaq ? 'faq-item' : isLogos ? 'logo-item' : isReviews ? 'card testimonial-card' : 'card'} ${isSteps ? 'step-item' : ''}" 
                     ${isFaq ? 'onclick="this.classList.toggle(\'active\')"' : ''}>
                  ${isFaq ? '<div class="faq-header"><span>' + escapeHtml(itemTitle) + '</span><span>↓</span></div>' : '<h3>' + escapeHtml(itemTitle) + '</h3>'}
                  ${itemText ? `<div class="${isFaq ? 'faq-answer' : ''}" style="margin-top: 1rem;">${renderText(itemText)}</div>` : ''}
                </div>
              `;
        }).join('')}
          </div>
        `;
      }

      if (type === 'hero') {
        const bgStyle = image ? `background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${escapeAttr(image)}'); background-size: cover; background-position: center;` : `background: var(--primary);`;
        return `
          <section id="${escapeAttr(sectionId)}" class="hero" style="${bgStyle} min-height: 90vh; display: flex; align-items: center; color: white;">
            <div class="container" style="text-align: center;">
                  <h1 data-field="headline" style="color: white; margin-bottom: 3rem;">${escapeHtml(headline || '')}</h1>
                  ${subheadline ? `<p data-field="subheadline" style="font-size: 1.5rem; max-width: 900px; margin: 0 auto 5rem; opacity: 0.9; color: white;">${escapeHtml(subheadline)}</p>` : ''}
                  ${cta ? `<a data-field="cta" href="#${escapeAttr(sectionId)}" class="btn">${escapeHtml(cta)}</a>` : ''}
                </div>
          </section>
        `;
      }

      return `
        <section id="${escapeAttr(sectionId)}" class="${escapeAttr(type)} ${escapeAttr(variant)}">
          <div class="container">
            ${headline ? `<h2 data-field="headline" style="${isCentered ? 'text-align: center;' : ''}">${escapeHtml(headline)}</h2>` : ''}
            ${subheadline && isCentered ? `<p data-field="subheadline" style="text-align: center; max-width: 800px; margin: -4rem auto 6rem; opacity: 0.7;">${escapeHtml(subheadline)}</p>` : ''}
            
            <div class="flex ${isReverse ? 'flex-reverse' : ''}">
              <div style="flex: 1.3;">
                ${!isCentered && subheadline ? `<p style="margin-bottom: 1.5rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">${escapeHtml(subheadline)}</p>` : ''}
                ${content ? `<div data-field="content" style="font-size: 1.25rem; margin-bottom: 3rem;">${renderText(content)}</div>` : ''}
                ${listHTML}
                ${cta ? `<a data-field="cta" href="#${escapeAttr(sectionId)}" class="btn" style="margin-top: 4rem;">${escapeHtml(cta)}</a>` : ''}
              </div>
              ${image && list.length === 0 ? `
                <div style="flex: 1;">
                  <img src="${escapeAttr(image)}" alt="${escapeAttr(type)}" style="width: 100%; border-radius: var(--radius); box-shadow: 0 40px 80px rgba(0,0,0,0.12); transform: perspective(1000px) rotateY(${isReverse ? '5deg' : '-5deg'}); transition: 0.5s;">
                </div>
              ` : ''}
            </div>
          </div>
        </section>
      `;
    };

    const getNavLinkLabel = (s) => {
      const typeLabels = { about: 'About', services: 'Services', features: 'Features', faq: 'FAQ', testimonials: 'Reviews', contact: 'Contact' };
      return typeLabels[s.type] || s.type.charAt(0).toUpperCase() + s.type.slice(1);
    };

    const seenNavTypes = new Set();
    const navLinks = (sections || [])
      .filter(s => {
        if (s.visible === false || s.type === 'hero' || s.type === 'footer' || s.type === 'cta') return false;
        if (seenNavTypes.has(s.type)) return false;
        seenNavTypes.add(s.type);
        return true;
      })
      .map(s => `<a href="#${escapeAttr(s.id || `${s.type}-${s.order ?? 1}`)}" class="nav-link">${escapeHtml(getNavLinkLabel(s))}</a>`)
      .join('');

    const sortedSections = [...(sections || [])].sort((a, b) => (a?.order ?? Number.MAX_SAFE_INTEGER) - (b?.order ?? Number.MAX_SAFE_INTEGER));

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(seo?.title || project.name || businessInfo?.businessName || 'Website')}</title>
  <style>${styles}</style>
</head>
<body>
  <nav>
    <div class="container nav-container">
      <a href="#" class="brand"><span class="brand-mark">◆</span><span>${escapeHtml(businessInfo?.businessName || project?.name || 'Brand')}</span></a>
      <div class="nav-links">
        ${navLinks}
      </div>
      <a href="#contact" class="nav-cta">Connect Now</a>
    </div>
  </nav>
  <main>${sortedSections.map(renderSection).join('')}</main>
</body>
</html>`;
  } catch (error) {
    console.error('[htmlGenerator] Critical Error:', error);
    throw error;
  }
};
