// ──────────────────────────────────────────────
// SANAAT — Stock Badge
// ──────────────────────────────────────────────

import type { ProductWithRelations, DisplayStatus } from '../../types';
import { getDisplayStatus, getStatusLabel, getStatusBadgeClass, getLowStockMessage } from '../../utils/stock';
import { Badge } from '../ui';

interface StockBadgeProps {
  product?: ProductWithRelations;
  status?: DisplayStatus;
  preorderCount?: number;
  showLowStockMessage?: boolean;
}

export function StockBadge({
  product,
  status: statusProp,
  preorderCount = 0,
  showLowStockMessage = false,
}: StockBadgeProps) {
  const status = statusProp || (product ? getDisplayStatus(product, product.variants, preorderCount) : 'available');

  if (status === 'available') return null;
  if (status === 'draft' || status === 'archived') return null;

  const label = getStatusLabel(status);
  const colorClass = getStatusBadgeClass(status);
  const lowStockMsg = product ? getLowStockMessage(product.variants, product.low_stock_threshold) : null;

  return (
    <div className="flex flex-col items-start gap-1">
      <Badge className={`${colorClass} text-[10px] tracking-widest uppercase px-2.5 py-1`}>
        {label}
      </Badge>

      {showLowStockMessage && status === 'low_stock' && lowStockMsg && (
        <span className="text-[11px] tracking-wide text-plum">
          {lowStockMsg}
        </span>
      )}
    </div>
  );
}
