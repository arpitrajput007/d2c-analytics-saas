import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import {
  Search, Save, RefreshCw, Plus, Eye, EyeOff,
  Tag, AlertTriangle, CheckCircle2, Package, DollarSign
} from 'lucide-react';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

/* ─── Inline number input ─── */
function PriceInput({ value, onChange, disabled, placeholder }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
        color: 'rgba(255,255,255,0.3)', fontSize: '12px', pointerEvents: 'none',
      }}>₹</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        placeholder={placeholder || '0'}
        style={{
          width: '100%', padding: '8px 8px 8px 22px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: disabled ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.35)',
          color: disabled ? 'rgba(255,255,255,0.25)' : '#fff',
          fontSize: '13px', outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = 'rgba(167,139,250,0.5)'; }}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
      />
    </div>
  );
}

/* ─── Margin badge ─── */
function MarginBadge({ cp, shipping, sp }) {
  if (!sp || sp <= 0) return <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>—</span>;
  const profit = sp - cp - shipping;
  const margin = (profit / sp * 100).toFixed(1);
  const isProfit = profit >= 0;
  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px',
    }}>
      <span style={{
        fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
        background: isProfit ? 'rgba(52,211,153,0.1)' : 'rgba(251,113,133,0.1)',
        border: `1px solid ${isProfit ? 'rgba(52,211,153,0.25)' : 'rgba(251,113,133,0.25)'}`,
        color: isProfit ? 'rgba(52,211,153,0.9)' : 'rgba(251,113,133,0.9)',
      }}>{margin}%</span>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{fmt(profit)} / unit</span>
    </div>
  );
}

export default function PricingView({ store }) {
  const [products, setProducts] = useState([]);   // { id, title, sku, cost_price, selling_price, shipping_cost, hidden }
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [toast, setToast] = useState(null);   // { msg, type }
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', sku: '', cost_price: 0, selling_price: 0, shipping_cost: 135 });

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    if (store?.id) fetchProducts();
  }, [store?.id]);

  async function fetchProducts() {
    if (!store?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', store.id)
      .order('title');
    setLoading(false);
    if (error) { showToast('Failed to load: ' + error.message, 'error'); return; }
    setProducts((data || []).map(p => ({ ...p, _dirty: false })));
  }

  async function syncFromShopify() {
    if (!store?.id) return;
    setSyncing(true);
    try {
      // Pull products from Supabase (synced from Shopify via server)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .order('title');
      if (error) throw error;
      setProducts((data || []).map(p => ({ ...p, _dirty: false })));
      showToast(`Synced ${data?.length || 0} SKUs from your store`);
    } catch (e) {
      showToast('Sync failed: ' + e.message, 'error');
    }
    setSyncing(false);
  }

  function updateField(id, field, value) {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value, _dirty: true } : p
    ));
  }

  async function saveSingle(product) {
    setSavingId(product.id);
    const { error } = await supabase
      .from('products')
      .update({
        cost_price: product.cost_price,
        selling_price: product.selling_price,
        shipping_cost: product.shipping_cost,
      })
      .eq('id', product.id);
    setSavingId(null);
    if (error) showToast('Save failed: ' + error.message, 'error');
    else {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, _dirty: false } : p));
      showToast(`Saved: ${product.title}`);
    }
  }

  async function saveAll() {
    const dirty = products.filter(p => p._dirty);
    if (!dirty.length) { showToast('No changes to save'); return; }
    setSavingAll(true);
    const updates = dirty.map(p =>
      supabase.from('products').update({
        cost_price: p.cost_price,
        selling_price: p.selling_price,
        shipping_cost: p.shipping_cost,
      }).eq('id', p.id)
    );
    const results = await Promise.all(updates);
    const errors = results.filter(r => r.error);
    setSavingAll(false);
    if (errors.length) showToast(`${errors.length} save(s) failed`, 'error');
    else {
      setProducts(prev => prev.map(p => ({ ...p, _dirty: false })));
      showToast(`Saved ${dirty.length} product(s) ✓`);
    }
  }

  async function toggleHide(product) {
    // hidden stored in localStorage per store
    const key = `hidden_pricing_${store.id}`;
    const hidden = JSON.parse(localStorage.getItem(key) || '{}');
    if (hidden[product.id]) delete hidden[product.id];
    else hidden[product.id] = true;
    localStorage.setItem(key, JSON.stringify(hidden));
    setProducts(prev => prev.map(p =>
      p.id === product.id ? { ...p, hidden: !!hidden[product.id] } : p
    ));
  }

  async function addCustomProduct() {
    if (!newProduct.title.trim()) { showToast('Product title is required', 'error'); return; }
    const { data, error } = await supabase.from('products').insert([{
      store_id: store.id,
      shopify_product_id: 'custom_' + Date.now(),
      title: newProduct.title,
      sku: newProduct.sku || '',
      cost_price: newProduct.cost_price,
      selling_price: newProduct.selling_price,
      shipping_cost: newProduct.shipping_cost,
    }]).select().single();
    if (error) { showToast('Failed: ' + error.message, 'error'); return; }
    setProducts(prev => [...prev, { ...data, _dirty: false }]);
    setShowAddModal(false);
    setNewProduct({ title: '', sku: '', cost_price: 0, selling_price: 0, shipping_cost: 135 });
    showToast('Product added!');
  }

  // Load hidden state from localStorage on mount
  useEffect(() => {
    if (!store?.id) return;
    const key = `hidden_pricing_${store.id}`;
    const hidden = JSON.parse(localStorage.getItem(key) || '{}');
    setProducts(prev => prev.map(p => ({ ...p, hidden: !!hidden[p.id] })));
  }, [store?.id, products.length]);

  const hiddenCount = products.filter(p => p.hidden).length;
  const dirtyCount = products.filter(p => p._dirty).length;

  const filtered = useMemo(() => products
    .filter(p => showHidden ? p.hidden : !p.hidden)
    .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())),
    [products, showHidden, search]
  );

  if (!store?.shopify_domain) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:'16px', textAlign:'center', padding:'40px' }}>
        <DollarSign size={48} color="rgba(167,139,250,0.5)" strokeWidth={1.2} />
        <div style={{ fontFamily:'Outfit', fontSize:'22px', fontWeight:800, color:'#fff' }}>No Store Connected</div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px', maxWidth:'360px', lineHeight:1.7 }}>
          Connect your Shopify store first to manage product pricing.
        </div>
      </div>
    );
  }

  const thStyle = {
    padding: '11px 14px', fontSize: '11px', fontWeight: 700,
    color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
    letterSpacing: '0.5px', background: 'rgba(0,0,0,0.3)',
    borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left', whiteSpace: 'nowrap',
  };

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '13px 18px', borderRadius: '12px',
          background: toast.type === 'error' ? 'rgba(251,113,133,0.15)' : 'rgba(52,211,153,0.15)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(251,113,133,0.4)' : 'rgba(52,211,153,0.4)'}`,
          color: toast.type === 'error' ? '#fb7185' : '#34d399',
          fontSize: '13px', fontWeight: 600, backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {toast.type === 'error' ? <AlertTriangle size={15}/> : <CheckCircle2 size={15}/>}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h2 style={{ fontFamily:'Outfit', fontSize:'22px', fontWeight:800, color:'#fff', margin:'0 0 4px 0' }}>Pricing Management</h2>
          <p style={{ margin:0, fontSize:'13px', color:'rgba(255,255,255,0.4)' }}>
            Set cost price, selling price and shipping per product. Used to calculate net profit.
          </p>
        </div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          {dirtyCount > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'10px', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.25)', color:'rgba(251,191,36,0.9)', fontSize:'12px', fontWeight:600 }}>
              <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'rgba(251,191,36,1)', display:'inline-block' }}/>
              {dirtyCount} unsaved change{dirtyCount > 1 ? 's' : ''}
            </div>
          )}
          <button onClick={() => setShowAddModal(true)} style={{
            display:'flex', alignItems:'center', gap:'7px', padding:'9px 16px', borderRadius:'10px',
            background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.25)',
            color:'rgba(52,211,153,0.9)', cursor:'pointer', fontSize:'13px', fontWeight:600,
          }}>
            <Plus size={15}/> Add Product
          </button>
          <button onClick={syncFromShopify} disabled={syncing} style={{
            display:'flex', alignItems:'center', gap:'7px', padding:'9px 16px', borderRadius:'10px',
            background:'rgba(56,189,248,0.08)', border:'1px solid rgba(56,189,248,0.2)',
            color:'rgba(56,189,248,0.85)', cursor:syncing?'not-allowed':'pointer', fontSize:'13px', fontWeight:600, opacity:syncing?0.7:1,
          }}>
            <RefreshCw size={14} style={{ animation:syncing?'spin 1s linear infinite':'none' }}/> Sync SKUs
          </button>
          <button onClick={saveAll} disabled={savingAll || !dirtyCount} style={{
            display:'flex', alignItems:'center', gap:'8px', padding:'9px 20px', borderRadius:'10px', border:'none',
            background: dirtyCount ? 'linear-gradient(135deg, rgba(167,139,250,1), rgba(56,189,248,1))' : 'rgba(255,255,255,0.06)',
            color: dirtyCount ? '#000' : 'rgba(255,255,255,0.25)',
            fontWeight:700, fontSize:'13px', cursor:!dirtyCount||savingAll?'not-allowed':'pointer',
            transition:'all 0.2s',
          }}>
            <Save size={14}/> {savingAll ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:'12px', alignItems:'center', padding:'14px 16px', borderRadius:'14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', marginBottom:'20px', flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:'200px', position:'relative' }}>
          <Search size={14} style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products or SKU..."
            style={{ width:'100%', padding:'8px 10px 8px 32px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(0,0,0,0.3)', color:'white', fontSize:'13px', outline:'none', boxSizing:'border-box' }}/>
        </div>
        <button onClick={() => setShowHidden(s=>!s)} style={{
          display:'flex', alignItems:'center', gap:'7px', padding:'8px 14px', borderRadius:'10px',
          background: showHidden ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.04)',
          border: showHidden ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.08)',
          color: showHidden ? 'rgba(251,191,36,0.85)' : 'rgba(255,255,255,0.45)',
          cursor:'pointer', fontSize:'13px', fontWeight:600,
        }}>
          {showHidden ? <Eye size={14}/> : <EyeOff size={14}/>}
          {showHidden ? 'Showing Hidden' : `Hidden (${hiddenCount})`}
        </button>
        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.3)', whiteSpace:'nowrap' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} shown
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'60px', color:'rgba(255,255,255,0.3)', fontSize:'14px' }}>
          <RefreshCw size={20} style={{ animation:'spin 1s linear infinite', marginRight:'10px' }}/> Loading products...
        </div>
      ) : (
        <div style={{ borderRadius:'16px', border:'1px solid rgba(255,255,255,0.08)', overflow:'hidden', background:'rgba(0,0,0,0.2)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'780px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Product / SKU</th>
                  <th style={{ ...thStyle, width:'150px' }}>Cost Price (CP)</th>
                  <th style={{ ...thStyle, width:'150px' }}>Selling Price (SP)</th>
                  <th style={{ ...thStyle, width:'150px' }}>Shipping / Fulfillment</th>
                  <th style={{ ...thStyle, width:'130px', textAlign:'right' }}>Margin / Profit</th>
                  <th style={{ ...thStyle, width:'150px', textAlign:'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding:'70px', textAlign:'center' }}>
                    <Package size={36} style={{ opacity:0.2, display:'block', margin:'0 auto 14px' }}/>
                    <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'14px' }}>
                      {products.length === 0
                        ? 'No products found. Click "Sync SKUs" to pull from your Shopify store.'
                        : showHidden ? 'No hidden products' : 'No products match your search'}
                    </div>
                  </td></tr>
                ) : filtered.map((p, i) => (
                  <tr key={p.id} style={{
                    borderBottom:'1px solid rgba(255,255,255,0.04)',
                    background: p._dirty ? 'rgba(167,139,250,0.04)' : i%2===0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                    opacity: p.hidden ? 0.4 : 1,
                    transition:'background 0.15s, opacity 0.2s',
                  }}>
                    {/* Product */}
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{
                          width:'32px', height:'32px', borderRadius:'8px', flexShrink:0,
                          background:'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(56,189,248,0.1))',
                          border:'1px solid rgba(167,139,250,0.15)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <Tag size={14} color="rgba(167,139,250,0.6)"/>
                        </div>
                        <div>
                          <div style={{ fontWeight:600, color:'#fff', fontSize:'13px', marginBottom:'2px' }}>{p.title}</div>
                          <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>
                            {p.sku || <em style={{ fontStyle:'italic' }}>No SKU</em>}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* CP */}
                    <td style={{ padding:'8px 14px' }}>
                      <PriceInput value={p.cost_price} onChange={v=>updateField(p.id,'cost_price',v)} disabled={p.hidden}/>
                    </td>
                    {/* SP */}
                    <td style={{ padding:'8px 14px' }}>
                      <PriceInput value={p.selling_price} onChange={v=>updateField(p.id,'selling_price',v)} disabled={p.hidden}/>
                    </td>
                    {/* Shipping */}
                    <td style={{ padding:'8px 14px' }}>
                      <PriceInput value={p.shipping_cost} onChange={v=>updateField(p.id,'shipping_cost',v)} disabled={p.hidden}/>
                    </td>
                    {/* Margin */}
                    <td style={{ padding:'8px 14px', textAlign:'right' }}>
                      <MarginBadge cp={p.cost_price} shipping={p.shipping_cost} sp={p.selling_price}/>
                    </td>
                    {/* Actions */}
                    <td style={{ padding:'8px 14px', textAlign:'center' }}>
                      <div style={{ display:'flex', gap:'6px', justifyContent:'center' }}>
                        <button onClick={()=>saveSingle(p)} disabled={!p._dirty || p.hidden || savingId===p.id} style={{
                          padding:'5px 10px', borderRadius:'7px', fontSize:'11px', fontWeight:700,
                          background: p._dirty && !p.hidden ? 'linear-gradient(135deg,rgba(167,139,250,1),rgba(56,189,248,1))' : 'rgba(255,255,255,0.06)',
                          border:'none', color: p._dirty && !p.hidden ? '#000' : 'rgba(255,255,255,0.2)',
                          cursor: p._dirty && !p.hidden ? 'pointer' : 'not-allowed',
                          transition:'all 0.2s',
                        }}>
                          {savingId===p.id ? '...' : 'Save'}
                        </button>
                        <button onClick={()=>toggleHide(p)} style={{
                          padding:'5px 10px', borderRadius:'7px', fontSize:'11px', fontWeight:600,
                          background: p.hidden ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.05)',
                          border: p.hidden ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(255,255,255,0.08)',
                          color: p.hidden ? 'rgba(56,189,248,0.8)' : 'rgba(255,255,255,0.4)',
                          cursor:'pointer', transition:'all 0.2s',
                        }}>
                          {p.hidden ? <Eye size={11}/> : <EyeOff size={11}/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'oklch(0.18 0.03 270)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'440px', boxShadow:'0 24px 60px rgba(0,0,0,0.6)' }}>
            <h3 style={{ fontFamily:'Outfit', fontSize:'18px', fontWeight:800, color:'#fff', margin:'0 0 20px 0' }}>Add Custom Product</h3>
            {[
              { label:'Product Title *', field:'title', type:'text', placeholder:'e.g. Premium Toy Set' },
              { label:'SKU', field:'sku', type:'text', placeholder:'e.g. TOY-001' },
              { label:'Cost Price (₹)', field:'cost_price', type:'number', placeholder:'0' },
              { label:'Selling Price (₹)', field:'selling_price', type:'number', placeholder:'0' },
              { label:'Shipping Cost (₹)', field:'shipping_cost', type:'number', placeholder:'135' },
            ].map(f => (
              <div key={f.field} style={{ marginBottom:'14px' }}>
                <label style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.4)', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{f.label}</label>
                <input type={f.type} value={newProduct[f.field]} placeholder={f.placeholder}
                  onChange={e=>setNewProduct(p=>({...p,[f.field]:f.type==='number'?parseFloat(e.target.value)||0:e.target.value}))}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:'9px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(0,0,0,0.35)', color:'white', fontSize:'13px', outline:'none', boxSizing:'border-box' }}/>
              </div>
            ))}
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={()=>setShowAddModal(false)} style={{ flex:1, padding:'11px', borderRadius:'10px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>Cancel</button>
              <button onClick={addCustomProduct} style={{ flex:2, padding:'11px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,rgba(167,139,250,1),rgba(56,189,248,1))', color:'#000', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Add Product</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
