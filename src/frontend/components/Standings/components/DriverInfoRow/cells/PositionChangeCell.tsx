import { memo } from 'react';
import { CaretUpIcon, CaretDownIcon, MinusIcon } from '@phosphor-icons/react';

interface PositionChangeCellProps {
  hidden?: boolean;
  positionChangeValue?: number;
}

export const PositionChangeCell = memo(
  ({ hidden, positionChangeValue }: PositionChangeCellProps) => {

    let text: string | undefined;
    let color = 'text-gray-400';
    let icon: React.ReactNode;

    if (positionChangeValue === undefined || isNaN(positionChangeValue)) {
      icon = (<span className="text-gray-400"><MinusIcon size={10} /></span>);
    } else {
      if (positionChangeValue > 0) {
        text = `${positionChangeValue}`;
        color = 'text-green-400';
        icon = <CaretUpIcon size={10} />;
      } else if (positionChangeValue < 0) {
        text = `${Math.abs(positionChangeValue)}`;
        color = 'text-red-400';
        icon = <CaretDownIcon size={10} />;
      } else {
        text = `${positionChangeValue}`;
        icon = <MinusIcon size={10} />;
      }
    }

    return (
      <td
        data-column="positionChange"
        className="w-auto px-2 text-center whitespace-nowrap align-middle"
      >
        {!hidden && (
          <>
            {icon}
            {text}
          </>
        )}
      </td>
    )
  }
);

PositionChangeCell.displayName = 'PositionChangeCell';

