import { memo } from 'react';
import {
  DriverRatingBadge,
  type DriverRatingBadgeProps,
} from '../../DriverRatingBadge/DriverRatingBadge';

interface BadgeCellProps {
  hidden?: boolean;
  license?: string;
  rating?: number;
  ratingChange?: number;
  ratingChangeEnabled?: boolean;
  badgeFormat?: DriverRatingBadgeProps['format'];
}

export const BadgeCell = memo(
  ({ hidden, license, rating, ratingChange, ratingChangeEnabled, badgeFormat }: BadgeCellProps) => (
    <td data-column="badge" className="w-auto whitespace-nowrap text-center">
      {hidden ? null : (
        <DriverRatingBadge
          license={license}
          rating={rating}
          ratingChange={ratingChange}
          ratingChangeEnabled={ratingChangeEnabled}
          format={badgeFormat}
        />
      )}
    </td>
  )
);

BadgeCell.displayName = 'BadgeCell';

