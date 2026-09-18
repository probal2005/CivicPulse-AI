import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertCircle, List, Map as MapIcon, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { useComplaints } from '@/hooks/useComplaints';
import {
  CATEGORY_LABELS,
  type Complaint,
  type ComplaintCategory,
} from '@/types/complaint';
import { categoryColors } from '@/data/mockComplaints';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function createIcon(color: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

export function CivicMapPage() {
  const { complaints, loading, error, refresh } = useComplaints();
  const [mapError, setMapError] = useState(false);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'all'>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (!L.Browser.retina) void 0;
      } catch {
        setMapError(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = complaints.filter((c) => categoryFilter === 'all' || c.category === categoryFilter);
  const center: [number, number] = [12.9716, 77.5946];

  const categoryOptions = Object.entries(CATEGORY_LABELS) as [ComplaintCategory, string][];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Civic Map</h1>
          <p className="mt-1.5 text-slate-500">View all reported civic issues on an interactive map</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('map')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              view === 'map' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Map View
          </button>
          <button
            onClick={() => setView('list')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              view === 'list' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            categoryFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {categoryOptions.map(([value, label]) => {
          const colors = categoryColors[value];
          return (
            <button
              key={value}
              onClick={() => setCategoryFilter(value)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                categoryFilter === value ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
              {label}
            </button>
          );
        })}
      </div>

      {loading && <LoadingState message="Loading map data..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && view === 'map' && (
        <>
          {mapError ? (
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900">Map could not load</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    The interactive map failed to load. You can still browse all reports using the List View.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setView('list')}>
                    Switch to List View
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 overflow-hidden">
                <div className="h-[500px] sm:h-[600px] bg-slate-100">
                  <MapContainer center={center} zoom={12} scrollWheelZoom={false}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filtered.map((c) => (
                      <Marker
                        key={c.id}
                        position={[c.lat, c.lng]}
                        icon={createIcon(categoryColors[c.category].marker)}
                        eventHandlers={{ click: () => setSelected(c) }}
                      >
                        <Popup>
                          <div className="min-w-[180px]">
                            <p className="font-semibold text-sm text-navy-900">{c.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{CATEGORY_LABELS[c.category]}</p>
                            <p className="text-xs text-slate-400 mt-1">{c.location}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-bold text-navy-900 mb-4">
                  {selected ? 'Selected Report' : 'Click a marker'}
                </h3>
                {selected ? (
                  <div className="space-y-3 animate-slide-in">
                    {selected.imageUrl && (
                      <img src={selected.imageUrl} alt={selected.title} className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                    )}
                    <div>
                      <p className="text-xs font-mono text-slate-400">{selected.id}</p>
                      <p className="font-semibold text-navy-900 text-sm mt-1">{selected.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[selected.category].bg} ${categoryColors[selected.category].text}`}>
                        {CATEGORY_LABELS[selected.category]}
                      </span>
                      <StatusBadge status={selected.status} />
                      <PriorityBadge priority={selected.priority} />
                    </div>
                    <p className="text-sm text-slate-500">{selected.description}</p>
                    <div className="flex items-start gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{selected.location}</span>
                    </div>
                    <p className="text-xs text-slate-400">Reported on {formatDate(selected.createdAt)}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <MapPin className="w-8 h-8 text-slate-300" />
                    <p className="text-sm text-slate-400 mt-2">Click any marker on the map to see the full report details here.</p>
                  </div>
                )}
              </Card>
            </div>
          )}
        </>
      )}

      {!loading && !error && view === 'list' && (
        <Card className="overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="w-6 h-6" />}
              title="No reports in this category"
              message="Try selecting a different category or clearing the filter."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const colors = categoryColors[c.category];
                return (
                  <div key={c.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} mt-2 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy-900 text-sm">{c.title}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{c.id}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{c.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <StatusBadge status={c.status} />
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                        {CATEGORY_LABELS[c.category]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Map tiles by OpenStreetMap. Markers use simulated coordinates from demo data.
      </p>
    </div>
  );
}
