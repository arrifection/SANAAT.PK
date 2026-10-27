import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Ruler, Maximize2 } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType?: 'Top' | 'Bottom' | 'Set' | string | null;
}

export function SizeChartModal({ isOpen, onClose, productType = 'Set' }: SizeChartModalProps) {
  const normType = (productType || 'Set').toLowerCase();
  const initialTab = normType === 'bottom' ? 'bottoms' : 'tops';
  const [activeTab, setActiveTab] = useState<'tops' | 'bottoms'>(initialTab);
  const [topsChartUrl, setTopsChartUrl] = useState<string>('/images/size-charts/tops-size-chart.webp');
  const [bottomsChartUrl, setBottomsChartUrl] = useState<string>('/images/size-charts/bottoms-size-chart.webp');
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(normType === 'bottom' ? 'bottoms' : 'tops');
      try {
        const savedTops = localStorage.getItem('sanaat_tops_size_chart') || localStorage.getItem('sanaat_size_chart_image');
        if (savedTops) setTopsChartUrl(savedTops);

        const savedBottoms = localStorage.getItem('sanaat_bottoms_size_chart') || localStorage.getItem('sanaat_size_chart_image');
        if (savedBottoms) setBottomsChartUrl(savedBottoms);
      } catch {
        // Fallback to static assets
      }
    }
  }, [isOpen, normType]);

  const showTabs = normType === 'set' || !productType;
  const currentChartUrl = activeTab === 'tops' ? topsChartUrl : bottomsChartUrl;
  const currentLabel = activeTab === 'tops' ? 'Tops Size Chart' : 'Bottoms Size Chart';
  const comingSoonLabel = activeTab === 'tops' ? 'TOPS SIZE CHART' : 'BOTTOMS SIZE CHART';

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsZoomed(false);
        onClose();
      }}
      title="SANAAT SIZE GUIDE"
      size="xl"
    >
      <div className="space-y-4 pt-2">
        {/* Navigation Tabs for Set products */}
        {showTabs && (
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('tops')}
              className={`py-2 px-6 text-xs font-serif uppercase tracking-wider transition-colors border-b-2 font-medium ${
                activeTab === 'tops'
                  ? 'border-plum text-plum font-semibold'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              Tops / Shirt Chart
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bottoms')}
              className={`py-2 px-6 text-xs font-serif uppercase tracking-wider transition-colors border-b-2 font-medium ${
                activeTab === 'bottoms'
                  ? 'border-plum text-plum font-semibold'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              Bottoms / Shalwar Chart
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-xs font-sans text-gray-500 pb-1">
          <span className="flex items-center gap-1.5 text-plum font-medium">
            <Ruler className="w-4 h-4" />
            <span>{currentLabel} · Modest Relaxed Fit</span>
          </span>
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-black"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{isZoomed ? 'Standard View' : 'Zoom Chart'}</span>
          </button>
        </div>

        {/* Size Chart Image Display with object-fit: contain */}
        <div className={`overflow-auto border border-gray-200 bg-white p-2 ${isZoomed ? 'max-h-[85vh]' : 'max-h-[70vh]'}`}>
          {currentChartUrl ? (
            <img
              src={currentChartUrl}
              alt={`SANAAT ${currentLabel}`}
              className="w-full h-auto object-contain mx-auto"
              onError={(e) => {
                // If local image fails, show clean intentional placeholder (Section 7)
                e.currentTarget.style.display = 'none';
                const placeholder = document.getElementById(`placeholder-${activeTab}`);
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          ) : null}

          <div
            id={`placeholder-${activeTab}`}
            style={{ display: currentChartUrl ? 'none' : 'flex' }}
            className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-dashed border-gray-200 text-center min-h-[260px]"
          >
            <Ruler className="w-8 h-8 text-gray-300 stroke-1 mb-2" />
            <h4 className="font-serif text-sm uppercase tracking-widest text-black">
              {comingSoonLabel}
            </h4>
            <p className="text-xs text-gray-400 font-sans mt-1">
              Size chart image coming soon
            </p>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 font-sans text-center">
          Official Sanaat size guide. All measurements in inches. Designed with relaxed modest ease.
        </p>
      </div>
    </Modal>
  );
}
