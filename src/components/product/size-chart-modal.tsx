import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { defaultSizeChart } from '../../content/site-content';
import { Ruler } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const [customChartUrl, setCustomChartUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('sanaat_size_chart_image');
        setCustomChartUrl(saved);
      } catch {
        setCustomChartUrl(null);
      }
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SANAAT SIZE GUIDE"
      size="xl"
    >
      <div className="space-y-6 pt-2">
        {/* If custom uploaded size chart exists */}
        {customChartUrl ? (
          <div className="space-y-3">
            <div className="overflow-hidden border border-gray-200 bg-white">
              <img
                src={customChartUrl}
                alt="SANAAT Official Size Chart"
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>
            <p className="text-[11px] text-gray-500 font-sans text-center">
              Official Sanaat sizing chart. If you are between sizes, we recommend selecting the larger size for a relaxed modest fit.
            </p>
          </div>
        ) : (
          /* Default elegant Sanaat measurements table */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-sans text-gray-500 border-b border-gray-100 pb-2">
              <span className="flex items-center gap-1.5 text-plum font-medium">
                <Ruler className="w-4 h-4" />
                <span>All measurements in inches</span>
              </span>
              <span>Modest Relaxed Fit</span>
            </div>

            <div className="overflow-x-auto border border-gray-200">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-black uppercase tracking-wider font-semibold">
                    {defaultSizeChart.headers.map((h, i) => (
                      <th key={i} className="py-3 px-3.5 sm:px-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {defaultSizeChart.rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                    >
                      <td className="py-3 px-3.5 sm:px-4 font-bold text-black font-serif text-sm">
                        {row.size}
                      </td>
                      <td className="py-3 px-3.5 sm:px-4 text-gray-700">{row.chest}&quot;</td>
                      <td className="py-3 px-3.5 sm:px-4 text-gray-700">{row.waist}&quot;</td>
                      <td className="py-3 px-3.5 sm:px-4 text-gray-700">{row.hips}&quot;</td>
                      <td className="py-3 px-3.5 sm:px-4 text-gray-700">{row.shirtLength}&quot;</td>
                      <td className="py-3 px-3.5 sm:px-4 text-gray-700">{row.trouserLength}&quot;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How to measure tips */}
            <div className="bg-gray-50 p-4 border border-gray-200 space-y-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-black block">
                How to Measure:
              </span>
              <ul className="text-xs font-sans text-gray-600 space-y-1.5 font-light">
                {defaultSizeChart.guidelines.map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-plum font-bold">·</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
