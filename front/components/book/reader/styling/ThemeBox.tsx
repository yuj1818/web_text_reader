import { ThemeType, ViewerThemes } from '@/constants/viewerThemes';
import clsx from 'clsx';

function ThemeBox({
  theme,
  isSelected,
  onClick,
}: {
  theme: ThemeType;
  isSelected: boolean;
  onClick: (val: ThemeType) => void;
}) {
  const themeStyles = ViewerThemes[theme];

  return (
    <li
      className={clsx(
        'flex justify-center items-center rounded shrink-0 w-[5rem] h-[5rem] cursor-pointer border',
        isSelected ? 'border-foreground border-2' : '',
      )}
      style={themeStyles}
      onClick={() => onClick(theme)}
    >
      <span className="text-sm">가나다</span>
    </li>
  );
}

export default ThemeBox;
