import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Scissors, 
  Package, 
  MessageCircle, 
  ArrowRight, 
  UserCheck, 
  Sparkles,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';

export default function DashboardOverview({ 
  analytics, 
  orders, 
  customers, 
  fabrics, 
  settings, 
  onSwitchTab,
  onOpenOrderModal 
}) {
  const currency = settings?.currency || '₦';

  // Find customers with collected garments who owe money
  const collectedWithDebt = orders.filter(o => 
    (o.custodyState?.toLowerCase().includes('collected') && o.balanceOwed > 0) ||
    (o.tailoringStage === 'Delivered' && o.balanceOwed > 0)
  );

  const totalCollectedDebt = collectedWithDebt.reduce((sum, o) => sum + (o.balanceOwed || 0), 0);

  // Active tailoring in shop (not yet delivered)
  const activeOrders = orders.filter(o => o.tailoringStage !== 'Delivered');

  // Low fabric stocks
  const lowStockFabrics = fabrics.filter(f => (f.yardsInStock || 0) <= (f.lowStockThreshold || 10));

  // Handler to generate a courteous, professional payment reminder via WhatsApp
  const handleSendReminder = (order) => {
    const cleanPhone = order.whatsapp || order.customerPhone.replace(/[^0-9]/g, '');
    let msg = `Peace and blessings ${order.customerName},\n\n`;
    msg += `This is a gentle payment reminder from *${settings?.atelierName || 'TOHEEB BESPOKE COUTURE'}* regarding your completed bespoke order *${order.id}*.\n\n`;
    msg += `📋 *Summary:*\n`;
    msg += `• Total Billed: ${currency}${order.totalAmount.toLocaleString()}\n`;
    msg += `• Amount Received: ${currency}${order.amountPaid.toLocaleString()}\n`;
    msg += `• *Outstanding Balance: ${currency}${order.balanceOwed.toLocaleString()}*\n\n`;
    msg += `🏦 *Payment Details:*\n`;
    msg += `Bank: ${settings?.bankName || 'Zenith Bank'}\n`;
    msg += `Account Number: *${settings?.accountNumber || '1012345678'}*\n`;
    msg += `Account Name: ${settings?.accountName || 'Toheeb Bespoke Atelier'}\n\n`;
    msg += `Kindly send your payment confirmation receipt once transferred. Thank you for your continued patronage!`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Workshop & Atelier Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time control over bespoke orders, tailoring stages, fabric inventory & customer payment cycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchTab('orders')}
            className="py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-gold-500/10 transition-all"
          >
            <Scissors className="w-4 h-4" />
            <span>Manage Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => onSwitchTab('catalog')}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all"
          >
            <span>+ Add Garment Model</span>
          </button>
        </div>
      </div>

      {/* Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Billed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Billed Revenue</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
            {currency}{analytics?.totalRevenue?.toLocaleString() || '0'}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Across all {orders.length} bespoke orders</span>
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-emerald-400">Payments Collected</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-400">
            {currency}{analytics?.totalCollected?.toLocaleString() || '0'}
          </div>
          <div className="text-[11px] text-emerald-300/80">
            Deposits & full payments cleared
          </div>
        </div>

        {/* Outstanding Debts Owed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-400">Total Balance Owed</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
            {currency}{analytics?.totalDebtsOwed?.toLocaleString() || '0'}
          </div>
          <div className="text-[11px] text-slate-400">
            Pending customer collections & installments
          </div>
        </div>

        {/* Active Tailoring in Workshop */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-gold-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gold-400">In Workshop</span>
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-gold-400">
            {activeOrders.length} Garments
          </div>
          <div className="text-[11px] text-slate-400">
            Currently cutting, sewing or at embroidery
          </div>
        </div>

      </div>

      {/* CRITICAL REVOLUTIONARY ALERT: Garments Collected But Owes Balance */}
      {collectedWithDebt.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/60 via-red-900/30 to-[#121929] border border-red-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-red-100 flex items-center gap-2">
                  <span>Urgent Debt Recovery Alert:</span>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-red-500 text-white font-bold">
                    {collectedWithDebt.length} Client{collectedWithDebt.length > 1 ? 's' : ''} Collected Clothes but Owes Balance
                  </span>
                </h3>
                <p className="text-xs text-red-200/80 mt-0.5">
                  Total uncollected balance on picked-up clothes: <strong className="text-white text-sm font-serif">{currency}{totalCollectedDebt.toLocaleString()}</strong>. Send gentle reminder via WhatsApp.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSwitchTab('customers')}
              className="text-xs font-semibold text-gold-300 hover:text-white flex items-center gap-1 shrink-0"
            >
              <span>View Customer Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {collectedWithDebt.map((ord) => (
              <div 
                key={ord.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-red-500/30 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-red-300">{ord.id}</span>
                    <span className="text-[11px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30">
                      Owes {currency}{ord.balanceOwed?.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1">{ord.customerName}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{ord.items?.map(i => i.name).join(', ')}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{ord.customerPhone}</span>
                  <button
                    onClick={() => handleSendReminder(ord)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow"
                    title="Open prefilled payment reminder in WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Send Reminder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Low Fabric Stock & Recent Workshop Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fabric Stock Alert */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif text-lg font-bold text-white">Fabric Rolls & Stock Status</h3>
            </div>
            <button
              onClick={() => onSwitchTab('stock')}
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
            >
              <span>Manage Rolls</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {fabrics.slice(0, 5).map((fab) => {
              const isLow = fab.yardsInStock <= fab.lowStockThreshold;
              return (
                <div 
                  key={fab.id} 
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isLow 
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                      style={{ backgroundColor: fab.color || '#c89b27' }} 
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-white">{fab.name}</h4>
                      <span className="text-[10px] text-slate-400">Category: {fab.category}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-mono block">
                      {fab.yardsInStock} yds
                    </span>
                    {isLow ? (
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 justify-end">
                        <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider">
                        Adequate
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Tailoring Pipeline Quick Preview */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-emerald-400" />
              <h3 className="font-serif text-lg font-bold text-white">Active Tailoring Orders</h3>
            </div>
            <button
              onClick={() => onSwitchTab('orders')}
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
            >
              <span>View All Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeOrders.slice(0, 4).map((ord) => (
              <div 
                key={ord.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                      {ord.id}
                    </span>
                    <span className="text-xs text-white font-semibold">{ord.customerName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block line-clamp-1">
                    {ord.items?.map(i => i.name).join(', ')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-gold-300 border border-gold-500/30 block">
                    {ord.tailoringStage}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Due: {ord.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
