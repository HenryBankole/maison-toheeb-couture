import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Compass, 
  CheckCircle2, 
  Clock, 
  Calendar,
  AlertCircle,
  MessageCircle,
  Scissors
} from 'lucide-react';
import { api } from '../services/api';

export default function OrderTrackerModal({ onClose, defaultQuery = '' }) {
  const [query, setQuery] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.trackOrder(query.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'Aucune commande trouvée pour cette référence.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-xl space-y-5 my-6 max-h-[90vh] overflow-y-auto cursor-default"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-700" />
            <h3 className="font-serif text-lg font-semibold text-slate-900">
              Suivi de Confection en Direct
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleTrack} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Entrez votre référence (ex: TB-1045) ou téléphone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs disabled:opacity-50 transition-colors"
          >
            {loading ? 'Recherche...' : 'Vérifier'}
          </button>
        </form>

        {/* Quick test buttons */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span>Exemples :</span>
          <button type="button" onClick={() => { setQuery('TB-1045'); }} className="underline text-slate-600 hover:text-slate-900">TB-1045</button>
          <span>&bull;</span>
          <button type="button" onClick={() => { setQuery('TB-1048'); }} className="underline text-slate-600 hover:text-slate-900">TB-1048</button>
          <span>&bull;</span>
          <button type="button" onClick={() => { setQuery('TB-1051'); }} className="underline text-slate-600 hover:text-slate-900">TB-1051</button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Top Order Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {result.order.id}
                </span>
                <span className="text-[11px] text-slate-500">
                  Commandé le : {result.order.orderDate}
                </span>
              </div>

              <h4 className="font-serif text-base font-bold text-slate-900">
                {result.order.customerName}
              </h4>

              <p className="text-xs text-slate-600">
                Pièce(s) : {result.order.items?.map(i => `${i.name} (x${i.qty})`).join(', ')}
              </p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span>Livraison estimée : <strong>{result.order.estimatedCompletionDate || result.order.dueDate}</strong></span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  result.order.balanceOwed <= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {result.order.balanceOwed <= 0 ? 'Paiement Soldé' : `Reste : ${result.order.balanceOwed?.toLocaleString()} FCFA`}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Évolution de la Confection
              </h5>

              <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {result.stages.map((stg, idx) => {
                  const isCompleted = idx < result.order.stageIndex;
                  const isCurrent = idx === result.order.stageIndex;
                  const historyMatch = result.order.stageHistory?.find(h => h.stage === stg.name);

                  return (
                    <div key={stg.id} className="relative flex items-start gap-3 pl-1">
                      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCompleted
                          ? 'bg-slate-900 text-white'
                          : isCurrent
                          ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                          : 'bg-white text-slate-400 border border-slate-200'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className={`flex-1 p-2.5 rounded-xl border text-xs ${
                        isCurrent 
                          ? 'border-slate-900 bg-white shadow-sm' 
                          : isCompleted 
                          ? 'border-slate-200 bg-slate-50 text-slate-700' 
                          : 'border-slate-100 text-slate-400'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${isCurrent ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                            {stg.name}
                          </span>
                          {historyMatch && (
                            <span className="text-[10px] text-slate-400 font-mono">{historyMatch.date}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{stg.description}</p>
                        {historyMatch?.note && (
                          <div className="mt-1 text-[11px] text-slate-700 font-medium">
                            Note atelier : {historyMatch.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Une question sur votre tenue ?</span>
              <a
                href={`https://wa.me/${result.atelier.phone}?text=${encodeURIComponent(`Bonjour Maître Tailleur, je souhaite avoir des nouvelles de ma commande [${result.order.id}].`)}`}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 font-medium flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contacter l'Atelier</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
