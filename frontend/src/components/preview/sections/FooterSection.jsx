import React from 'react';

const FooterSection = ({ 
  content,
  text,
  links = [],
  theme,
  businessName,
}) => {
  const displayContent = content || text || 'Building the future of the web, one pixel at a time.';
  const displayLinks = links && links.length > 0 ? links : [
    { label: 'Privacy Policy', url: '#' },
    { label: 'Terms of Service', url: '#' },
    { label: 'Contact', url: '#contact' }
  ];

  return (
    <footer className="py-20 px-6" style={{ backgroundColor: 'var(--theme-secondary)', color: 'white' }}>
      <div className="max-w-7xl mx-auto container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-black mb-6 tracking-tighter" style={{ color: 'white' }}>
              {businessName || 'SITE'}
            </h3>
            <p className="text-lg opacity-60 max-w-sm leading-relaxed">
              {displayContent}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-xs opacity-40">Company</h4>
            <ul className="space-y-4 font-medium">
              {displayLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.url} className="hover:opacity-100 opacity-70 transition-opacity">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-xs opacity-40">Follow Us</h4>
            <div className="flex gap-6 text-xl">
              <a href="#" className="opacity-70 hover:opacity-100 transition-all">𝕏</a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-all">📸</a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-all">💼</a>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-sm font-medium">
          <p>© 2026 {businessName || 'SITE'}. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#">Cookies</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
