import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';

// ── Constants ──────────────────────────────────────────────────────────────
const PRODUCT_COST = 555;
const SHIPPING_COST = 135;
const PREPAID_LAUNCH_DATE = '2026-03-28';
const STATUS_TAGS = ['Delivered','Canceled','Attempted Delivery','In Transit','Out for Delivery','Failed Delivery','RTO','RTO Prediction','Unreachable','Not Confirmed','Fulfilled','Unfulfilled'];

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');
function toDateStr(d) {
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function getOrderDateIST(o) {
  if (!o.created_at) return '';
  const istMs = new Date(o.created_at).getTime() + (5.5*60*60*1000);
  const d = new Date(istMs);
  return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0');
}
function parseDateStr(s) {
  const [y,m,d] = s.split('-').map(Number);
  return new Date(y, m-1, d, 12, 0, 0);
}
function isOrderDelivered(o) {
  const tags = (o.tags||'').split(',').map(t=>t.trim().toLowerCase());
  const ss = (tags.find(t=>t.startsWith('__ss:'))||'').replace('__ss:','');
  const isRTO = tags.some(t=>!t.startsWith('__ss:')&&t.includes('rto')&&!t.includes('rto_prediction'));
  const delivered = ss==='delivered'||tags.some(t=>t==='delivered'&&!t.startsWith('__ss:'));
  return !isRTO && delivered;
}
function isOrderPrepaidRevenue(o) {
  const d = (o.created_at||'').substring(0,10);
  if (d < PREPAID_LAUNCH_DATE) return false;
  return (o.shipping_title||'').toLowerCase().includes('prepaid');
}
function getPaymentCounts(orders) {
  let prepaid=0, cash=0;
  orders.forEach(o=>{ (o.shipping_title||'').toLowerCase().includes('prepaid')?prepaid++:cash++; });
  return {prepaid,cash};
}
function getRevenueBreakdown(orders) {
  let deliveredRev=0,prepaidRev=0,deliveredCount=0,prepaidCount=0;
  orders.forEach(o=>{
    const isDel=isOrderDelivered(o), isPre=isOrderPrepaidRevenue(o);
    if(isDel||isPre){
      const rev=parseFloat(o.total_price||0);
      if(isPre){prepaidRev+=rev;prepaidCount++;}
      else if(isDel){deliveredRev+=rev;deliveredCount++;}
    }
  });
  return {totalRevenue:deliveredRev+prepaidRev,deliveredRevenue:deliveredRev,prepaidRevenue:prepaidRev,deliveredCount,prepaidCount};
}
function getTotalRevenue(orders){ return getRevenueBreakdown(orders).totalRevenue; }
function categorizeOrders(orders) {
  const c={};
  STATUS_TAGS.forEach(t=>c[t]=0); c['Other']=0;
  orders.forEach(o=>{
    const tags=(o.tags||'').split(',').map(t=>t.trim().toLowerCase());
    const fs=(o.fulfillment_status||'').toLowerCase();
    const fin=(o.financial_status||'').toLowerCase();
    const ss=(tags.find(t=>t.startsWith('__ss:'))||'').replace('__ss:','');
    const isRTO=!isOrderDelivered(o)&&tags.some(t=>!t.startsWith('__ss:')&&(t.includes('rto')&&!t.includes('rto_prediction')||t.includes('undelivered')));
    const isRTOPred=tags.some(t=>!t.startsWith('__ss:')&&t.includes('rto_prediction'));
    const isUnreachable=tags.some(t=>!t.startsWith('__ss:')&&t.includes('unreachable'));
    const isDelivered=isOrderDelivered(o);
    const isFulfilled=(fs==='fulfilled'||fs==='partial')||isDelivered;
    const ssInTransit=ss==='in_transit'||tags.some(t=>t.includes('in transit')&&!t.startsWith('__ss:'));
    const ssOut=ss==='out_for_delivery'||tags.some(t=>t.includes('out for delivery')&&!t.startsWith('__ss:'));
    const ssFail=ss==='failure'||ss==='attempted_delivery'||tags.some(t=>(t.includes('failed delivery')||t.includes('attempted delivery'))&&!t.startsWith('__ss:'));
    const ssDel=ss==='delivered'||tags.some(t=>t==='delivered'&&!t.startsWith('__ss:'));
    const isInTransit=ssInTransit&&!ssOut&&!ssFail&&!ssDel&&!isRTO;
    const isOutForDel=ssOut&&!ssFail&&!ssDel&&!isRTO;
    const isFailedDel=ssFail&&!isRTO;
    const isCanceled=tags.some(t=>t==='canceled'||t==='cancelled')||fin==='voided'||fin==='refunded'||!!o.cancelled_at;
    const isCOD=fin==='pending';
    const hasConfirm=tags.some(t=>t==='confirm'||t==='confirmed');
    const isNotConfirmed=isCOD&&!hasConfirm&&!isCanceled&&!isFulfilled;
    const isUnfulfilled=!isFulfilled&&!isCanceled&&!isNotConfirmed&&(fs===''||fs==='unfulfilled'||!fs);
    if(isFulfilled) c['Fulfilled']++;
    if(isDelivered) c['Delivered']++;
    if(isRTO) c['RTO']++;
    if(isRTOPred) c['RTO Prediction']++;
    if(isUnreachable) c['Unreachable']++;
    if(isInTransit) c['In Transit']++;
    if(isOutForDel) c['Out for Delivery']++;
    if(isFailedDel) c['Failed Delivery']++;
    if(isCanceled) c['Canceled']++;
    if(isUnfulfilled) c['Unfulfilled']++;
    if(isNotConfirmed) c['Not Confirmed']++;
  });
  return c;
}
function calcPL(revenue, deliveredCount, adCost, fulfilledCount=0, items=[], pricing={}) {
  let productCost=0, shippingCost=0;
  if(items&&items.length>0){
    items.forEach(item=>{
      const p=pricing[item.sku]||{cp:PRODUCT_COST,shipping:SHIPPING_COST};
      if(item.isDelivered) productCost+=(p.cp||PRODUCT_COST)*item.quantity;
      if(item.isFulfilled) shippingCost+=(p.shipping||SHIPPING_COST)*item.quantity;
    });
    if(productCost===0&&deliveredCount>0) productCost=deliveredCount*PRODUCT_COST;
    if(shippingCost===0&&(fulfilledCount>0||deliveredCount>0)) shippingCost=(fulfilledCount||deliveredCount)*SHIPPING_COST;
  } else {
    productCost=(deliveredCount||0)*PRODUCT_COST;
    shippingCost=(fulfilledCount||deliveredCount||0)*SHIPPING_COST;
  }
  const totalCost=productCost+shippingCost+adCost;
  return {revenue,productCost,shippingCost,adCost,totalCost,profit:revenue-totalCost};
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function DailyDashboard({ store }) {
  const [orders, setOrders] = useState([]);
  const [pricing, setPricing] = useState({});
  const [adCosts, setAdCosts] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const now = new Date();
  const d30 = new Date(now); d30.setDate(d30.getDate()-29);
  const [sbStart, setSbStart] = useState(toDateStr(d30));
  const [sbEnd, setSbEnd] = useState(toDateStr(now));
  const [feedStart, setFeedStart] = useState(toDateStr(d30));
  const [feedEnd, setFeedEnd] = useState(toDateStr(now));
  const [lastLoaded, setLastLoaded] = useState('');
  const [scoreboard, setScoreboard] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showCPP, setShowCPP] = useState(false);
  const [dayFilterState, setDayFilterState] = useState({});
  const [dayOrdersCache, setDayOrdersCache] = useState({});
  const [adSpendModal, setAdSpendModal] = useState(null);
  const [pnlModal, setPnlModal] = useState(null);
  const [plModal, setPlModal] = useState(null);
  const [revModal, setRevModal] = useState(null);
  const [itemsModal, setItemsModal] = useState(null);
  const [dayProducts, setDayProducts] = useState({});

  useEffect(()=>{ if(store?.id){ loadPricing(); } },[store?.id]);

  async function loadPricing() {
    if(!store?.id) return;
    const {data}=await supabase.from('products').select('*').eq('store_id',store.id);
    if(data){
      const map={};
      data.forEach(p=>{
        const entry={cp:parseFloat(p.cost_price||PRODUCT_COST),shipping:parseFloat(p.shipping_cost||SHIPPING_COST),title:p.title};
        if(p.sku) map[p.sku]=entry;
        map['TITLE:'+p.title]=entry;
      });
      setPricing(map);
    }
  }

  async function fetchOrders(start, end) {
    if(!store?.id) return [];
    const {data}=await supabase.from('orders').select('*, order_items(*)').eq('store_id',store.id)
      .gte('created_at',new Date(start+'T00:00:00+05:30').toISOString())
      .lte('created_at',new Date(end+'T23:59:59+05:30').toISOString())
      .order('created_at',{ascending:false});
    return (data||[]).map(o=>({...o,line_items:o.order_items||[],customer:{first_name:o.customer_fn,last_name:o.customer_ln}}));
  }

  async function loadAdCosts(start, end) {
    const {data}=await supabase.from('ad_costs').select('date,amount').gte('date',start).lte('date',end);
    const map={};
    if(data) data.forEach(r=>map[r.date]=r.amount);
    return map;
  }

  async function handleFetchFeed() {
    setLoading(true); setLoadingMsg('Fetching orders...');
    try {
      const [ords, ads] = await Promise.all([fetchOrders(feedStart,feedEnd), loadAdCosts(feedStart,feedEnd)]);
      setOrders(ords); setAdCosts(ads);
      setLastLoaded(new Date().toLocaleTimeString());
    } finally { setLoading(false); setLoadingMsg(''); }
  }

  async function handleCalcScoreboard() {
    setLoading(true); setLoadingMsg('Calculating...');
    try {
      const [ords,ads]=await Promise.all([fetchOrders(sbStart,sbEnd),loadAdCosts(sbStart,sbEnd)]);
      const sb=computeScoreboard(sbStart,sbEnd,ords,ads,pricing);
      setScoreboard(sb);
    } finally { setLoading(false); setLoadingMsg(''); }
  }

  function computeScoreboard(start,end,ords,ads,pric) {
    let totalNet=0,profitDays=0,lossDays=0,profitAmt=0,lossAmt=0,totalAd=0,totalItems=0;
    const days=[];
    const dStart=parseDateStr(start), dEnd=parseDateStr(end);
    for(let d=new Date(dEnd);d>=dStart;d.setDate(d.getDate()-1)){
      const ds=toDateStr(d);
      const dayOrds=ords.filter(o=>getOrderDateIST(o)===ds);
      const tc=categorizeOrders(dayOrds);
      const rev=getTotalRevenue(dayOrds);
      const adCost=ads[ds]||0;
      const items=[];
      dayOrds.forEach(o=>{
        const isDel=isOrderDelivered(o),isPre=isOrderPrepaidRevenue(o),counted=isDel||isPre;
        (o.line_items||[]).forEach(li=>{const k=li.sku||('TITLE:'+li.title);items.push({...li,sku:k,isDelivered:counted,isFulfilled:counted});});
      });
      const prepaid=dayOrds.filter(isOrderPrepaidRevenue).length;
      const pl=calcPL(rev,(tc['Delivered']||0)+prepaid,adCost,(tc['Fulfilled']||0)+prepaid,items,pric);
      totalNet+=pl.profit;
      let itemCount=0; dayOrds.forEach(o=>(o.line_items||[]).forEach(li=>itemCount+=parseInt(li.quantity||1)));
      totalAd+=adCost; totalItems+=itemCount;
      if(dayOrds.length>0||pl.profit!==0){
        if(pl.profit>0){profitDays++;profitAmt+=pl.profit;}
        else if(pl.profit<0){lossDays++;lossAmt+=pl.profit;}
        days.push({ds,date:new Date(d),profit:pl.profit,cpp:itemCount>0?adCost/itemCount:0});
      }
    }
    return {totalNet,profitDays,profitAmt,lossDays,lossAmt,avgCpp:totalItems>0?totalAd/totalItems:0,days,dateRange:start+' to '+end};
  }

  function buildDayBlock(dateStr,dayOrds,ads,pric) {
    const tc=categorizeOrders(dayOrds);
    const rev=getTotalRevenue(dayOrds);
    const adCost=ads[dateStr]||0;
    const items=[];
    dayOrds.forEach(o=>{
      const isDel=isOrderDelivered(o),isPre=isOrderPrepaidRevenue(o),counted=isDel||isPre;
      (o.line_items||[]).forEach(li=>{const k=li.sku||('TITLE:'+li.title);items.push({...li,sku:k,isDelivered:counted,isFulfilled:counted});});
    });
    const prepaid=dayOrds.filter(isOrderPrepaidRevenue).length;
    const pl=calcPL(rev,(tc['Delivered']||0)+prepaid,adCost,(tc['Fulfilled']||0)+prepaid,items,pric);
    let totalItems=0; const itemMap={};
    dayOrds.forEach(o=>(o.line_items||[]).forEach(li=>{
      const qty=parseInt(li.quantity||1); totalItems+=qty;
      itemMap[li.title||'?']=(itemMap[li.title||'?']||0)+qty;
    }));
    const cpp=totalItems>0?adCost/totalItems:0;
    const pc=getPaymentCounts(dayOrds);
    const revBD=getRevenueBreakdown(dayOrds);
    return {tc,rev,adCost,pl,totalItems,itemMap,cpp,pc,revBD,prepaidCount:prepaid};
  }

  function handleCardFilter(dateStr, filterKey) {
    setDayFilterState(prev=>{
      const cur=prev[dateStr];
      return {...prev,[dateStr]:cur===filterKey?null:filterKey};
    });
  }

  function getFilteredOrders(dayOrds, filterKey) {
    if(!filterKey||filterKey==='all') return dayOrds;
    return dayOrds.filter(o=>{
      const tc=categorizeOrders([o]);
      if(filterKey==='orders') return true;
      if(filterKey==='fulfilled') return tc['Fulfilled']>0;
      if(filterKey==='delivered') return tc['Delivered']>0;
      if(filterKey==='in-transit') return tc['In Transit']>0;
      if(filterKey==='out-delivery') return tc['Out for Delivery']>0;
      if(filterKey==='failed-delivery') return tc['Failed Delivery']>0;
      if(filterKey==='canceled') return tc['Canceled']>0;
      if(filterKey==='rto-prediction') return tc['RTO Prediction']>0;
      if(filterKey==='rto') return tc['RTO']>0;
      if(filterKey==='unreachable') return tc['Unreachable']>0;
      if(filterKey==='not-confirmed') return tc['Not Confirmed']>0;
      if(filterKey==='prepaid') return isOrderPrepaidRevenue(o);
      if(filterKey==='cash') return !isOrderPrepaidRevenue(o);
      return true;
    });
  }

  async function saveAdCost(dateStr, amount) {
    const val=parseFloat(amount)||0;
    await supabase.from('ad_costs').upsert({date:dateStr,amount:val});
    setAdCosts(prev=>({...prev,[dateStr]:val}));
  }

  function openPNLModal(dateStr, prettyDate) {
    const dayOrds = dayOrdersCache[dateStr]||[];
    const dailyAdSplits = JSON.parse(localStorage.getItem('dailyProductAdCosts')||'{}')[dateStr]||{};
    const totalDayAd = adCosts[dateStr]||0;
    const productMap={};
    dayOrds.forEach(o=>{
      const counted=isOrderDelivered(o)||isOrderPrepaidRevenue(o);
      (o.line_items||[]).forEach(li=>{
        const key=li.title||'?';
        if(!productMap[key]){
          const p=pricing[li.sku]||pricing['TITLE:'+li.title]||{cp:PRODUCT_COST,shipping:SHIPPING_COST};
          productMap[key]={title:key,sku:li.sku||'',qty:0,revenue:0,cpPerUnit:p.cp||PRODUCT_COST,shippingPerUnit:p.shipping||SHIPPING_COST};
        }
        productMap[key].qty+=parseInt(li.quantity||1);
        if(counted) productMap[key].revenue+=parseFloat(li.price||0)*parseInt(li.quantity||1);
      });
    });
    setPnlModal({dateStr,prettyDate,products:Object.values(productMap),dailyAdSplits,totalDayAd});
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  const dStart=parseDateStr(feedStart), dEnd=parseDateStr(feedEnd);
  const dayBlocks=[];
  for(let d=new Date(dEnd);d>=dStart;d.setDate(d.getDate()-1)){
    const ds=toDateStr(d);
    const dayOrds=orders.filter(o=>getOrderDateIST(o)===ds);
    dayBlocks.push({ds, dayOrds, prettyDate:parseDateStr(ds).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})});
  }

  // cache for filter
  useEffect(()=>{
    const cache={};
    dayBlocks.forEach(({ds,dayOrds})=>{ cache[ds]=dayOrds; });
    setDayOrdersCache(cache);
    const dp={};
    dayBlocks.forEach(({ds,dayOrds})=>{ const m={}; dayOrds.forEach(o=>(o.line_items||[]).forEach(li=>{m[li.title||'?']=(m[li.title||'?']||0)+parseInt(li.quantity||1);})); dp[ds]=Object.keys(m); });
    setDayProducts(dp);
  },[orders]);

  return (
    <div style={{animation:'fadeInUp 0.4s ease forwards'}}>
      {/* Loading */}
      {loading && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',zIndex:9999,backdropFilter:'blur(12px)'}}>
          <div style={{width:60,height:60,border:'3px solid rgba(245,200,66,0.2)',borderTop:'3px solid var(--primary)',borderRadius:'50%',animation:'spin 1s linear infinite',marginBottom:20}}/>
          <div style={{color:'#fff',fontWeight:700,fontSize:16,letterSpacing:1}}>{loadingMsg||'Loading...'}</div>
        </div>
      )}

      {/* ── Scoreboard ─────────────────────────────────────────────────── */}
      <div style={{background:'rgba(15,15,26,0.6)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'18px 22px',marginBottom:20,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
        <div style={{flex:1,fontFamily:'Outfit',fontWeight:800,fontSize:18,color:'var(--text-main)'}}>Profit/Loss Scoreboard</div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:3}}>Start Date</div>
            <input type="date" value={sbStart} onChange={e=>setSbStart(e.target.value)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid var(--border)',background:'rgba(0,0,0,0.3)',color:'#fff',colorScheme:'dark',fontSize:13,outline:'none'}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:3}}>End Date</div>
            <input type="date" value={sbEnd} onChange={e=>setSbEnd(e.target.value)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid var(--border)',background:'rgba(0,0,0,0.3)',color:'#fff',colorScheme:'dark',fontSize:13,outline:'none'}}/>
          </div>
          <button onClick={handleCalcScoreboard} style={{alignSelf:'flex-end',padding:'8px 18px',background:'var(--primary)',color:'#000',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',fontSize:14}}>Calculate</button>
        </div>
      </div>

      {scoreboard && (
        <div style={{background:'rgba(15,15,26,0.5)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'22px 26px',marginBottom:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:16}}>
            <div>
              <div style={{fontSize:12,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1,fontWeight:700}}>Cumulative Net Profit</div>
              <div style={{fontSize:38,fontWeight:800,color:scoreboard.totalNet>=0?'var(--profit-color)':'var(--loss-color)',fontFamily:'Outfit',marginTop:6,textShadow:scoreboard.totalNet>=0?'0 0 20px rgba(52,211,153,0.4)':'0 0 20px rgba(248,113,113,0.4)'}}>
                {fmt(scoreboard.totalNet)}
              </div>
              <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{scoreboard.dateRange?.replace('-',' ').replace('to',' to ')}</div>
              <div style={{display:'flex',gap:10,marginTop:14,flexWrap:'wrap'}}>
                <div style={{background:'rgba(56,189,248,0.1)',border:'1px solid rgba(56,189,248,0.3)',padding:'8px 14px',borderRadius:10}}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:0.5,fontWeight:700}}>Avg CPP</div>
                  <div style={{fontSize:17,fontWeight:700,color:'#38bdf8'}}>{fmt(scoreboard.avgCpp)}</div>
                </div>
                <div style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',padding:'8px 14px',borderRadius:10}}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:0.5,fontWeight:700}}>Profitable Days ({scoreboard.profitDays})</div>
                  <div style={{fontSize:17,fontWeight:700,color:'var(--profit-color)'}}>+{fmt(scoreboard.profitAmt)}</div>
                </div>
                <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',padding:'8px 14px',borderRadius:10}}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:0.5,fontWeight:700}}>Loss Days ({scoreboard.lossDays})</div>
                  <div style={{fontSize:17,fontWeight:700,color:'var(--loss-color)'}}>-{fmt(Math.abs(scoreboard.lossAmt))}</div>
                </div>
              </div>
            </div>
            <button onClick={()=>setShowBreakdown(p=>!p)} style={{background:'rgba(255,255,255,0.05)',border:'1px solid var(--border)',color:'#fff',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',gap:8}}>
              View Breakdown {showBreakdown?'▲':'▼'}
            </button>
          </div>
          {showBreakdown && (
            <div style={{marginTop:20,borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:20}}>
              <button onClick={()=>setShowCPP(p=>!p)} style={{marginBottom:14,background:'rgba(167,139,250,0.1)',border:'1px solid #a78bfa',color:'#a78bfa',padding:'4px 12px',borderRadius:6,cursor:'pointer',fontSize:12,fontWeight:700}}>
                {showCPP?'Hide CPP':'Show CPP'}
              </button>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:10}}>
                {scoreboard.days.map(({ds,date,profit,cpp})=>{
                  const isP=profit>=0;
                  const op=0.2+(Math.abs(profit)/Math.max(...scoreboard.days.map(d=>Math.abs(d.profit)),1))*0.5;
                  return (
                    <div key={ds} style={{background:isP?`rgba(16,185,129,${op})`:`rgba(239,68,68,${op})`,border:`1px solid ${isP?`rgba(16,185,129,${op+0.3})`:`rgba(239,68,68,${op+0.3})`}`,borderRadius:10,padding:'12px',textAlign:'center'}}>
                      <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.85)',marginBottom:4}}>{date.toLocaleDateString('en-US',{day:'numeric',month:'short'})}</div>
                      <div style={{fontSize:16,fontWeight:700,color:isP?'#a7f3d0':'#fecaca'}}>{isP?'+':''}{fmt(profit)}</div>
                      {showCPP&&<div style={{fontSize:10,color:'#e2e8f0',marginTop:6,padding:'2px 6px',background:'rgba(0,0,0,0.3)',borderRadius:4}}>CPP: {fmt(cpp)}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Daily Feed Controls ─────────────────────────────────────────── */}
      <div style={{background:'rgba(15,15,26,0.6)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'16px 22px',marginBottom:20,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:'Outfit',fontWeight:800,fontSize:18,color:'var(--text-main)'}}>Daily Feed</div>
          {lastLoaded&&<div style={{fontSize:12,color:'var(--text-muted)',marginTop:3}}>Loaded at {lastLoaded}</div>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:3}}>Start Date</div>
            <input type="date" value={feedStart} onChange={e=>setFeedStart(e.target.value)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid var(--border)',background:'rgba(0,0,0,0.3)',color:'#fff',colorScheme:'dark',fontSize:13,outline:'none'}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:3}}>End Date</div>
            <input type="date" value={feedEnd} onChange={e=>setFeedEnd(e.target.value)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid var(--border)',background:'rgba(0,0,0,0.3)',color:'#fff',colorScheme:'dark',fontSize:13,outline:'none'}}/>
          </div>
          <button onClick={handleFetchFeed} style={{alignSelf:'flex-end',padding:'8px 18px',background:'var(--primary)',color:'#000',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',fontSize:14}}>Fetch Feed</button>
        </div>
      </div>

      {/* ── Day Blocks ────────────────────────────────────────────────────── */}
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        {dayBlocks.length===0&&!loading&&(
          <div style={{textAlign:'center',padding:60,color:'var(--text-muted)',background:'rgba(255,255,255,0.02)',borderRadius:14,border:'1px solid rgba(255,255,255,0.06)'}}>
            Select a date range and click Fetch Feed
          </div>
        )}
        {dayBlocks.map(({ds,dayOrds,prettyDate})=>{
          const {tc,rev,adCost,pl,totalItems,itemMap,cpp,pc,revBD}=buildDayBlock(ds,dayOrds,adCosts,pricing);
          const filterKey=dayFilterState[ds]||null;
          const filteredOrds=getFilteredOrders(dayOrds,filterKey);
          return <DayBlock key={ds} ds={ds} prettyDate={prettyDate} dayOrds={dayOrds} tc={tc} rev={rev} adCost={adCost} pl={pl} totalItems={totalItems} itemMap={itemMap} cpp={cpp} pc={pc} revBD={revBD} filterKey={filterKey} filteredOrds={filteredOrds} onCardFilter={handleCardFilter} onAdSpend={dstr=>setAdSpendModal({dateStr:dstr,dayOrds,adCosts})} onPNL={(dstr,pd)=>openPNLModal(dstr,pd)} onShowPL={d=>setPlModal(d)} onShowRev={r=>setRevModal(r)} onShowItems={m=>setItemsModal(m)} adCosts={adCosts}/>;
        })}
      </div>

      {/* ── Ad Spend Modal ──────────────────────────────────────────────── */}
      {adSpendModal && <AdSpendModal modal={adSpendModal} adCosts={adCosts} onSave={async(ds,amt,splits)=>{await saveAdCost(ds,amt);const stored=JSON.parse(localStorage.getItem('dailyProductAdCosts')||'{}');stored[ds]=splits;localStorage.setItem('dailyProductAdCosts',JSON.stringify(stored));setAdSpendModal(null);}} onClose={()=>setAdSpendModal(null)}/>}
      {pnlModal && <PNLModal modal={pnlModal} adCosts={adCosts} onClose={()=>setPnlModal(null)}/>}
      {plModal && <PLModal data={plModal} onClose={()=>setPlModal(null)}/>}
      {revModal && <RevModal data={revModal} onClose={()=>setRevModal(null)}/>}
      {itemsModal && <ItemsModal data={itemsModal} onClose={()=>setItemsModal(null)}/>}
    </div>
  );
}

// ── DayBlock Sub-component ─────────────────────────────────────────────────
function DayBlock({ds,prettyDate,dayOrds,tc,rev,adCost,pl,totalItems,itemMap,cpp,pc,revBD,filterKey,filteredOrds,onCardFilter,onAdSpend,onPNL,onShowPL,onShowRev,onShowItems,adCosts}) {
  const [ordersOpen,setOrdersOpen]=React.useState(false);
  const profitColor=pl.profit>=0?'var(--profit-color)':'var(--loss-color)';
  const profitChar=pl.profit>=0?'▲':'▼';
  const cards=[
    {key:'orders',label:'Orders',val:dayOrds.length,color:'#fff',glow:'rgba(255,255,255,0.15)',onClick:()=>onCardFilter(ds,'orders')},
    {key:'items',label:'Number of Items',val:totalItems,color:'#fff',glow:'rgba(255,255,255,0.15)',onClick:()=>onShowItems(itemMap)},
    {key:'cpp',label:'CPP',val:fmt(cpp),sub:'Click for breakdown',color:'#fff',glow:'rgba(255,255,255,0.15)',onClick:()=>{}},
    {key:'fulfilled',label:'Fulfilled',val:tc['Fulfilled']||0,color:'var(--profit-color)',glow:'rgba(52,211,153,0.2)',onClick:()=>onCardFilter(ds,'fulfilled')},
    {key:'delivered',label:'Delivered',val:tc['Delivered']||0,color:'var(--profit-color)',glow:'rgba(52,211,153,0.2)',onClick:()=>onCardFilter(ds,'delivered')},
    {key:'in-transit',label:'In Transit',val:tc['In Transit']||0,color:'#60a5fa',glow:'rgba(96,165,250,0.2)',onClick:()=>onCardFilter(ds,'in-transit')},
    {key:'out-delivery',label:'Out for Delivery',val:tc['Out for Delivery']||0,color:'#a78bfa',glow:'rgba(167,139,250,0.2)',onClick:()=>onCardFilter(ds,'out-delivery')},
    {key:'failed-delivery',label:'Failed Delivery',val:tc['Failed Delivery']||0,color:'#f97316',glow:'rgba(249,115,22,0.2)',onClick:()=>onCardFilter(ds,'failed-delivery')},
    {key:'canceled',label:'Canceled',val:tc['Canceled']||0,color:'var(--loss-color)',glow:'rgba(248,113,113,0.2)',onClick:()=>onCardFilter(ds,'canceled')},
    {key:'rto-prediction',label:'Possibility of RTO',val:tc['RTO Prediction']||0,color:'#fbbf24',glow:'rgba(251,191,36,0.2)',onClick:()=>onCardFilter(ds,'rto-prediction')},
    {key:'rto',label:'RTO / Undelivered',val:tc['RTO']||0,color:'var(--loss-color)',glow:'rgba(248,113,113,0.2)',onClick:()=>onCardFilter(ds,'rto')},
    {key:'unreachable',label:'Unreachable',val:tc['Unreachable']||0,color:'#facc15',glow:'rgba(250,204,21,0.2)',onClick:()=>onCardFilter(ds,'unreachable')},
    {key:'not-confirmed',label:'Order Not Confirmed',val:tc['Not Confirmed']||0,color:'var(--loss-color)',glow:'rgba(248,113,113,0.2)',onClick:()=>onCardFilter(ds,'not-confirmed')},
    {key:'revenue',label:'Revenue',val:fmt(rev),color:'#60a5fa',glow:'rgba(96,165,250,0.2)',onClick:()=>onShowRev(revBD)},
    {key:'adspend',label:'Ad Spend',val:fmt(adCost),sub:'Click to edit',color:'#fff',glow:'rgba(255,255,255,0.1)',onClick:()=>onAdSpend(ds)},
    {key:'prepaid',label:'Prepaid Orders',val:pc.prepaid,color:'#818cf8',glow:'rgba(129,140,248,0.2)',onClick:()=>onCardFilter(ds,'prepaid')},
    {key:'cash',label:'Cash Orders',val:pc.cash,color:'#fb923c',glow:'rgba(251,146,60,0.2)',onClick:()=>onCardFilter(ds,'cash')},
    {key:'netprofit',label:'Net Profit',val:fmt(pl.profit),color:profitColor,glow:pl.profit>=0?'rgba(52,211,153,0.2)':'rgba(248,113,113,0.2)',onClick:()=>onShowPL(pl)},
    {key:'pnl',label:'PNL of Products',val:'📊',color:'#fbbf24',glow:'rgba(251,191,36,0.2)',sub:'Click for breakdown',pulseDot:true,onClick:()=>onPNL(ds,prettyDate)},
  ];
  return (
    <div style={{background:'rgba(15,15,26,0.55)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'20px 24px',backdropFilter:'blur(12px)'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:10}}>
        <h2 style={{margin:0,fontSize:16,fontWeight:700,fontFamily:'Outfit',color:'var(--text-main)'}}>{prettyDate}</h2>
        <div style={{display:'flex',gap:10}}>
          <span style={{padding:'4px 12px',borderRadius:6,background:'rgba(167,139,250,0.15)',color:'#a78bfa',border:'1px solid #a78bfa',fontWeight:700,fontSize:13}}>CPP: {fmt(cpp)}</span>
          <span style={{padding:'4px 12px',borderRadius:6,background:pl.profit>=0?'rgba(52,211,153,0.15)':'rgba(248,113,113,0.15)',color:profitColor,border:`1px solid ${profitColor}`,fontWeight:700,fontSize:13}}>Net: {profitChar}{fmt(Math.abs(pl.profit))}</span>
        </div>
      </div>
      {/* Metric Cards Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10,marginBottom:20}}>
        {cards.map(c=>{
          const isActive=filterKey===c.key;
          return (
            <div key={c.key} onClick={c.onClick} style={{background:isActive?c.glow:'rgba(255,255,255,0.03)',border:`1px solid ${isActive?c.color:'rgba(255,255,255,0.07)'}`,borderRadius:10,padding:'12px 14px',cursor:'pointer',transition:'all 0.2s',boxShadow:isActive?`0 0 12px ${c.glow}`:'none',position:'relative',overflow:'hidden'}}>
              {c.pulseDot&&<div style={{position:'absolute',top:8,right:8,width:6,height:6,borderRadius:'50%',background:'#fbbf24',boxShadow:'0 0 8px #fbbf24',animation:'pulseGlow 2s infinite'}}/>}
              <div style={{fontSize:11,color:'var(--text-muted)',fontWeight:600,marginBottom:6,lineHeight:1.2}}>{c.label}</div>
              <div style={{fontSize:20,fontWeight:800,color:c.color,fontFamily:'Outfit'}}>{c.val}</div>
              {c.sub&&<div style={{fontSize:10,color:'var(--text-muted)',marginTop:5,opacity:0.7}}>{c.sub}</div>}
            </div>
          );
        })}
      </div>
      {/* Orders Toggle */}
      <div onClick={()=>setOrdersOpen(p=>!p)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',padding:'10px 14px',background:'rgba(0,0,0,0.2)',borderRadius:8,marginBottom:ordersOpen?14:0}}>
        <h3 style={{margin:0,fontSize:14,fontWeight:600,color:filterKey?'var(--primary)':'var(--text-main)'}}>
          {filterKey?(`Filtered: ${cards.find(c=>c.key===filterKey)?.label||filterKey}`):'View Orders'}
        </h3>
        <span style={{color:'var(--text-muted)',fontSize:13}}>{ordersOpen?'▲':'▼'} {filterKey?`${filteredOrds.length} of ${dayOrds.length}`:`${dayOrds.length}`}</span>
      </div>
      {ordersOpen && (
        <div style={{overflowX:'auto',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                {['Order #','Customer','Amount','Payment','Revenue','Tags','Time'].map(h=>(
                  <th key={h} style={{padding:'10px 12px',textAlign:'left',color:'var(--text-muted)',fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:0.5,whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrds.length===0 && <tr><td colSpan={7} style={{textAlign:'center',padding:24,color:'var(--text-muted)'}}>No orders match this filter</td></tr>}
              {filteredOrds.slice(0,50).map(o=>{
                const isPre=isOrderPrepaidRevenue(o), isDel=isOrderDelivered(o), counted=isPre||isDel;
                const orderRev=counted?parseFloat(o.total_price||0):0;
                const tags=(o.tags||'').split(',').filter(t=>t.trim()&&!t.trim().startsWith('__ss:'));
                return (
                  <tr key={o.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:'10px 12px',verticalAlign:'top'}}>
                      <span style={{fontWeight:600}}>{o.name}</span>
                      <span style={{fontSize:10,fontWeight:700,padding:'1px 6px',borderRadius:4,marginLeft:6,background:isPre?'rgba(129,140,248,0.15)':'rgba(251,146,60,0.15)',color:isPre?'#818cf8':'#fb923c',border:`1px solid ${isPre?'rgba(129,140,248,0.4)':'rgba(251,146,60,0.4)'}`}}>{isPre?'PREPAID':'COD'}</span>
                    </td>
                    <td style={{padding:'10px 12px',verticalAlign:'top'}}>{o.customer?.first_name||''} {o.customer?.last_name||''}</td>
                    <td style={{padding:'10px 12px',verticalAlign:'top'}}>{fmt(o.total_price)}</td>
                    <td style={{padding:'10px 12px',verticalAlign:'top',color:'var(--text-muted)',fontSize:12}}>{isPre?'Prepaid':'COD'}</td>
                    <td style={{padding:'10px 12px',verticalAlign:'top'}}>{counted?<span style={{color:isPre&&!isDel?'#818cf8':'var(--profit-color)',fontWeight:600}}>{fmt(orderRev)}</span>:<span style={{opacity:0.4}}>—</span>}</td>
                    <td style={{padding:'10px 12px',verticalAlign:'top',maxWidth:200}}>{tags.map((t,i)=><span key={i} style={{display:'inline-block',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:4,padding:'2px 7px',fontSize:10,marginRight:4,marginBottom:4,color:'var(--text-muted)',whiteSpace:'nowrap'}}>{t.trim()}</span>)}</td>
                    <td style={{padding:'10px 12px',verticalAlign:'top',color:'var(--text-muted)',fontSize:12,whiteSpace:'nowrap'}}>{o.created_at?new Date(o.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Modal Components ───────────────────────────────────────────────────────
const OVERLAY={position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9998,backdropFilter:'blur(8px)'};
const SHEET={background:'linear-gradient(135deg,rgba(15,15,26,0.98),rgba(20,20,40,0.98))',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:'24px 28px',maxWidth:700,width:'90%',maxHeight:'85vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.8)'};

function AdSpendModal({modal,adCosts,onSave,onClose}) {
  const {dateStr,dayOrds}=modal;
  const [total,setTotal]=React.useState(String(adCosts[dateStr]||0));
  const stored=JSON.parse(localStorage.getItem('dailyProductAdCosts')||'{}');
  const todaySplits=stored[dateStr]||{};
  const [splits,setSplits]=React.useState(todaySplits);
  const products=[...new Set(dayOrds.flatMap(o=>(o.line_items||[]).map(li=>li.title||'?')))];
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={SHEET} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h2 style={{margin:0,fontFamily:'Outfit',fontSize:20}}>Ad Spend — {dateStr}</h2>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer'}}>×</button>
        </div>
        <div style={{marginBottom:20,padding:16,background:'rgba(255,255,255,0.05)',borderRadius:10}}>
          <div style={{fontSize:12,color:'var(--text-muted)',textTransform:'uppercase',marginBottom:8}}>Total Ad Spend for the Day</div>
          <input type="number" value={total} onChange={e=>setTotal(e.target.value)} style={{width:'100%',padding:'10px 12px',background:'rgba(0,0,0,0.3)',border:'1px solid var(--border)',color:'#fff',borderRadius:8,fontSize:16,outline:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{fontSize:12,color:'var(--text-muted)',textTransform:'uppercase',fontWeight:700,marginBottom:10}}>Per-Product Breakdown</div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20,maxHeight:300,overflowY:'auto'}}>
          {products.map(p=>(
            <div key={p} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(0,0,0,0.2)',padding:'8px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.06)'}}>
              <span style={{fontWeight:600,fontSize:13,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginRight:12}}>{p}</span>
              <input type="number" value={splits[p]||''} placeholder="0" onChange={e=>setSplits(prev=>({...prev,[p]:parseFloat(e.target.value)||0}))} style={{width:90,padding:'6px 8px',background:'rgba(0,0,0,0.3)',border:'1px solid var(--border)',color:'#fff',borderRadius:6,outline:'none'}}/>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'8px 18px',background:'transparent',border:'1px solid var(--border)',color:'#fff',borderRadius:8,cursor:'pointer',fontWeight:600}}>Cancel</button>
          <button onClick={()=>onSave(dateStr,total,splits)} style={{padding:'8px 18px',background:'var(--primary)',color:'#000',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700}}>Save Breakdown</button>
        </div>
      </div>
    </div>
  );
}

function PNLModal({modal,adCosts,onClose}) {
  const {dateStr,prettyDate,products,dailyAdSplits,totalDayAd}=modal;
  let totRev=0,totCP=0,totShip=0,totAd=0,totPNL=0;
  const rows=products.map(p=>{
    const cp=p.cpPerUnit*p.qty, ship=p.shippingPerUnit*p.qty;
    const ad=dailyAdSplits[p.title]||0, cpp=p.qty>0?ad/p.qty:0;
    const pnl=p.revenue-cp-ship-ad;
    totRev+=p.revenue;totCP+=cp;totShip+=ship;totAd+=ad;totPNL+=pnl;
    return {...p,cp,ship,ad,cpp,pnl};
  });
  const alloc=Object.values(dailyAdSplits).reduce((a,b)=>a+b,0);
  const unalloc=totalDayAd-alloc;
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={{...SHEET,maxWidth:860}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div>
            <div style={{fontSize:11,color:'#fbbf24',fontWeight:800,textTransform:'uppercase',letterSpacing:1,marginBottom:4,display:'flex',alignItems:'center',gap:6}}><span style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:'#fbbf24'}}/>Product P&L Breakdown</div>
            <h2 style={{margin:0,fontFamily:'Outfit',fontSize:22}}>PNL of Products</h2>
            <div style={{fontSize:13,color:'var(--text-muted)',marginTop:4}}>{prettyDate}</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#fff',fontSize:24,cursor:'pointer'}}>×</button>
        </div>
        {/* Summary Bar */}
        <div style={{display:'flex',gap:12,flexWrap:'wrap',margin:'16px 0',padding:'14px 16px',background:'rgba(255,255,255,0.04)',borderRadius:10}}>
          {[{l:'Products',v:products.length,c:'#fbbf24'},{l:'Revenue',v:'₹'+Math.round(totRev).toLocaleString('en-IN'),c:'#34d399'},{l:'Total Cost',v:'₹'+Math.round(totCP+totShip+totAd).toLocaleString('en-IN'),c:'#f87171'},{l:'Net PNL',v:(totPNL>=0?'+':'')+'₹'+Math.round(Math.abs(totPNL)).toLocaleString('en-IN'),c:totPNL>=0?'#34d399':'#f87171'}].concat(unalloc>0.5?[{l:'Unallocated Ad',v:'₹'+Math.round(unalloc).toLocaleString('en-IN'),c:'#f59e0b'}]:[]).map(s=>(
            <div key={s.l} style={{flex:'1 1 120px',textAlign:'center'}}>
              <div style={{fontSize:11,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:0.5,marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:17,fontWeight:700,color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>
        {/* Table */}
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                {['Product','CP','Shipping','Ad Spend','CPP','Revenue','PNL'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',color:'var(--text-muted)',fontWeight:600,fontSize:11,textTransform:'uppercase'}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(p=>(
                <tr key={p.title} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'10px 12px'}}><div style={{fontWeight:600}}>{p.title}</div><div style={{fontSize:10,color:'var(--text-muted)'}}>{p.qty}×</div></td>
                  <td style={{padding:'10px 12px',color:'#f87171'}}>₹{Math.round(p.cp).toLocaleString('en-IN')}</td>
                  <td style={{padding:'10px 12px',color:'#60a5fa'}}>₹{Math.round(p.ship).toLocaleString('en-IN')}</td>
                  <td style={{padding:'10px 12px',color:'#a78bfa'}}>{p.ad>0?'₹'+Math.round(p.ad).toLocaleString('en-IN'):<span style={{opacity:0.35}}>—</span>}</td>
                  <td style={{padding:'10px 12px',color:'#a78bfa'}}>{p.cpp>0?'₹'+Math.round(p.cpp).toLocaleString('en-IN'):<span style={{opacity:0.35}}>—</span>}</td>
                  <td style={{padding:'10px 12px',color:'#34d399'}}>{p.revenue>0?'₹'+Math.round(p.revenue).toLocaleString('en-IN'):<span style={{opacity:0.35}}>—</span>}</td>
                  <td style={{padding:'10px 12px',color:p.pnl>=0?'#34d399':'#f87171',fontWeight:700}}>{p.pnl>=0?'+':''}₹{Math.round(Math.abs(p.pnl)).toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr style={{borderTop:'2px solid rgba(255,255,255,0.12)',fontWeight:700}}>
                <td style={{padding:'12px'}}>TOTAL</td>
                <td style={{padding:'12px',color:'#f87171'}}>₹{Math.round(totCP).toLocaleString('en-IN')}</td>
                <td style={{padding:'12px',color:'#60a5fa'}}>₹{Math.round(totShip).toLocaleString('en-IN')}</td>
                <td style={{padding:'12px',color:'#a78bfa'}}>₹{Math.round(totAd).toLocaleString('en-IN')}</td>
                <td style={{padding:'12px'}}>—</td>
                <td style={{padding:'12px',color:'#34d399'}}>₹{Math.round(totRev).toLocaleString('en-IN')}</td>
                <td style={{padding:'12px',color:totPNL>=0?'#34d399':'#f87171',fontSize:16}}>{totPNL>=0?'+':''}₹{Math.round(Math.abs(totPNL)).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PLModal({data,onClose}) {
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={{...SHEET,maxWidth:420}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h2 style={{margin:0,fontFamily:'Outfit',fontSize:18}}>P&L Breakdown</h2>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer'}}>×</button>
        </div>
        {[{l:'Revenue',v:data.revenue,c:'var(--profit-color)'},{l:'Product Cost',v:-data.productCost,c:'var(--loss-color)'},{l:'Shipping Cost',v:-data.shippingCost,c:'#60a5fa'},{l:'Ad Spend',v:-data.adCost,c:'#a78bfa'},{l:'Net Profit',v:data.profit,c:data.profit>=0?'var(--profit-color)':'var(--loss-color)',border:true}].map(r=>(
          <div key={r.l} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:r.border?'none':'1px solid rgba(255,255,255,0.06)',borderTop:r.border?'2px solid rgba(255,255,255,0.12)':'none',marginTop:r.border?8:0}}>
            <span style={{color:'var(--text-muted)',fontWeight:r.border?700:400}}>{r.l}</span>
            <span style={{color:r.c,fontWeight:700,fontSize:r.border?18:14}}>{r.v>=0?'':'-'}{fmt(Math.abs(r.v))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevModal({data,onClose}) {
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={{...SHEET,maxWidth:420}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h2 style={{margin:0,fontFamily:'Outfit',fontSize:18}}>Revenue Breakdown</h2>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer'}}>×</button>
        </div>
        {[{l:`Delivered COD (${data.deliveredCount} orders)`,v:data.deliveredRevenue,c:'var(--profit-color)'},{l:`Prepaid (${data.prepaidCount} orders)`,v:data.prepaidRevenue,c:'#818cf8'},{l:'Total Revenue',v:data.totalRevenue,c:'#fff',border:true}].map(r=>(
          <div key={r.l} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderTop:r.border?'2px solid rgba(255,255,255,0.12)':'none',borderBottom:r.border?'none':'1px solid rgba(255,255,255,0.06)',marginTop:r.border?8:0}}>
            <span style={{color:'var(--text-muted)',fontWeight:r.border?700:400}}>{r.l}</span>
            <span style={{color:r.c,fontWeight:700}}>{fmt(r.v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemsModal({data,onClose}) {
  return (
    <div style={OVERLAY} onClick={onClose}>
      <div style={{...SHEET,maxWidth:400}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h2 style={{margin:0,fontFamily:'Outfit',fontSize:18}}>Items Breakdown</h2>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer'}}>×</button>
        </div>
        {Object.entries(data).map(([name,qty])=>(
          <div key={name} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <span style={{color:'var(--text-main)',flex:1,marginRight:12}}>{name}</span>
            <span style={{color:'var(--primary)',fontWeight:700,background:'rgba(245,200,66,0.1)',padding:'2px 10px',borderRadius:20,fontSize:13}}>×{qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}