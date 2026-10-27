import { useMemo, useState } from 'react';
import { Check, ChevronRight, Minus, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react';

type Gum = {
  id: number;
  name: string;
  flavor: string;
  description: string;
  price: number;
  accent: string;
  tag: string;
  pieces: number;
};

const gums: Gum[] = [
  { id: 1, name: 'Mint Orbit', flavor: 'Mint', description: 'Cool spearmint with a crisp, clean finish.', price: 79, accent: '#c8ff46', tag: 'Bestseller', pieces: 15 },
  { id: 2, name: 'Berry Riot', flavor: 'Berry', description: 'Juicy strawberry and raspberry with a tart kick.', price: 89, accent: '#ff5d8f', tag: 'New', pieces: 15 },
  { id: 3, name: 'Citrus Zap', flavor: 'Citrus', description: 'Bright lemon-lime flavor made for long chews.', price: 85, accent: '#ffd84d', tag: 'Zesty', pieces: 18 },
  { id: 4, name: 'Watermelon Wave', flavor: 'Fruit', description: 'Soft, sweet watermelon with a fresh finish.', price: 99, accent: '#59e391', tag: 'Fan favorite', pieces: 20 },
  { id: 5, name: 'Cola Pop', flavor: 'Cola', description: 'Classic cola sweetness with a fizzy-style tang.', price: 75, accent: '#d29b6e', tag: 'Classic', pieces: 15 },
  { id: 6, name: 'Grape Static', flavor: 'Fruit', description: 'Bold grape flavor with an extra-sour first bite.', price: 95, accent: '#b88cff', tag: 'Sour', pieces: 18 },
];

const filters = ['All', 'Mint', 'Berry', 'Citrus', 'Fruit', 'Cola'];

function App() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [ordered, setOrdered] = useState(false);

  const visibleGums = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return gums.filter((gum) => {
      const matchesFilter = activeFilter === 'All' || gum.flavor === activeFilter;
      const matchesQuery = !normalized || `${gum.name} ${gum.flavor} ${gum.description}`.toLowerCase().includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const cartItems = gums.filter((gum) => (cart[gum.id] ?? 0) > 0);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = cartItems.reduce((sum, gum) => sum + gum.price * (cart[gum.id] ?? 0), 0);

  const addToCart = (id: number) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    setCartOpen(true);
  };

  const changeQuantity = (id: number, delta: number) => {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[id] ?? 0) + delta);
      const next = { ...current, [id]: nextQuantity };
      if (nextQuantity === 0) delete next[id];
      return next;
    });
  };

  const startCheckout = () => {
    if (cartCount === 0) return;
    setCheckoutOpen(true);
    setCartOpen(false);
    setOrdered(false);
    setError('');
  };

  const submitOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      setError('Enter your name and a valid email to continue.');
      return;
    }
    setError('');
    setOrdered(true);
    setCart({});
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Chewsy home"><span className="brand-dot" />CHEWSY</a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#shop">Shop</a><a href="#why">Why Chewsy</a><a href="#about">About</a></nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}><ShoppingBag size={19} /><span>Bag</span><b>{cartCount}</b></button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> BIG FLAVOR. SMALL PACK.</div>
            <h1>GUM THAT<br /><em>HITS DIFFERENT.</em></h1>
            <p>Long-lasting flavor, punchy combinations, and pocket-ready packs made for your everyday chew.</p>
            <a className="primary-cta" href="#shop">Shop flavors <ChevronRight size={18} /></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="bubble bubble-one" /><div className="bubble bubble-two" />
            <div className="pack pack-back"><span>CHEWSY</span><b>BERRY<br />RIOT</b></div>
            <div className="pack pack-front"><span>CHEWSY</span><b>MINT<br />ORBIT</b><small>15 PIECES</small></div>
          </div>
        </section>

        <section className="ticker" aria-label="Product highlights"><span>SUGAR FREE</span><i>✦</i><span>LONG LASTING</span><i>✦</i><span>6 BOLD FLAVORS</span><i>✦</i><span>POCKET READY</span></section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><span className="section-kicker">PICK YOUR FIX</span><h2>Find your flavor.</h2></div>
            <div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search flavors" aria-label="Search flavors" /></div>
          </div>
          <div className="filters" aria-label="Flavor filters">
            {filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
          </div>
          <div className="product-grid">
            {visibleGums.map((gum, index) => (
              <article className="product-card" key={gum.id}>
                <div className="product-visual" style={{ background: gum.accent }}><span className="product-tag">{gum.tag}</span><div className={`mini-pack rotate-${index % 3}`}><small>CHEWSY</small><strong>{gum.name.toUpperCase()}</strong><span>{gum.pieces} PCS</span></div></div>
                <div className="product-info"><div><span>{gum.flavor}</span><h3>{gum.name}</h3></div><strong>₹{gum.price}</strong></div>
                <p>{gum.description}</p>
                <button className="add-button" onClick={() => addToCart(gum.id)}>Add to bag <Plus size={17} /></button>
              </article>
            ))}
          </div>
          {visibleGums.length === 0 && <div className="empty-state">No gum matches that search. Try another flavor.</div>}
        </section>

        <section className="why-section" id="why">
          <div className="why-card lime"><span>01</span><h3>Flavor that stays.</h3><p>Built for a longer chew, not a two-minute cameo.</p></div>
          <div className="why-card dark"><span>02</span><h3>Zero sugar.</h3><p>All the flavor punch without the sugar crash.</p></div>
          <div className="why-card pink"><span>03</span><h3>Made to roam.</h3><p>Slim packs fit in pockets, bags, desks, and glove boxes.</p></div>
        </section>

        <section className="about-section" id="about"><span>CHEW BOLDER</span><h2>Ordinary gum is boring.<br />We fixed that.</h2><p>Chewsy is a fictional gum shop built around loud flavors and clean design. This storefront is a demo—checkout does not process real payments.</p></section>
      </main>

      <footer><div className="brand footer-brand"><span className="brand-dot" />CHEWSY</div><p>Demo storefront · No real purchases are processed.</p><span>© 2026 Chewsy</span></footer>

      {cartOpen && (
        <div className="overlay" onMouseDown={() => setCartOpen(false)}>
          <aside className="cart-panel" onMouseDown={(event) => event.stopPropagation()} aria-label="Shopping bag">
            <div className="panel-header"><div><span>YOUR BAG</span><h2>{cartCount} {cartCount === 1 ? 'item' : 'items'}</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button></div>
            <div className="cart-list">
              {cartItems.length === 0 ? <div className="cart-empty"><ShoppingBag size={32} /><h3>Your bag is empty.</h3><p>Add a flavor and it will show up here.</p></div> : cartItems.map((gum) => (
                <div className="cart-item" key={gum.id}>
                  <div className="cart-swatch" style={{ background: gum.accent }}>{gum.name.slice(0, 1)}</div>
                  <div className="cart-item-copy"><h3>{gum.name}</h3><span>₹{gum.price} · {gum.pieces} pieces</span><div className="quantity"><button onClick={() => changeQuantity(gum.id, -1)} aria-label={`Decrease ${gum.name}`}><Minus size={15} /></button><b>{cart[gum.id]}</b><button onClick={() => changeQuantity(gum.id, 1)} aria-label={`Increase ${gum.name}`}><Plus size={15} /></button></div></div>
                  <strong>₹{gum.price * (cart[gum.id] ?? 0)}</strong>
                </div>
              ))}
            </div>
            <div className="cart-footer"><div><span>Subtotal</span><strong>₹{subtotal}</strong></div><small>Demo only. Shipping and payment are not processed.</small><button className="checkout-button" disabled={cartCount === 0} onClick={startCheckout}>Demo checkout <ChevronRight size={18} /></button></div>
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="overlay checkout-overlay" onMouseDown={() => setCheckoutOpen(false)}>
          <div className="checkout-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button>
            {ordered ? (
              <div className="success-state"><div className="success-icon"><Check /></div><span>DEMO ORDER COMPLETE</span><h2>Nice choice, {name.trim()}.</h2><p>Your demo order has been confirmed. No payment was charged and no real order was placed.</p><button className="checkout-button" onClick={() => setCheckoutOpen(false)}>Keep browsing</button></div>
            ) : (
              <form onSubmit={submitOrder}><span className="section-kicker">DEMO CHECKOUT</span><h2>Almost yours.</h2><p className="modal-note">This is a demonstration checkout. Do not enter real payment information.</p><label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label><label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>{error && <div className="form-error">{error}</div>}<div className="checkout-total"><span>Demo total</span><strong>₹{subtotal}</strong></div><button className="checkout-button" type="submit">Place demo order <ChevronRight size={18} /></button></form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
