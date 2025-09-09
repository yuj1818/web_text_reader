import { ThemeType, ViewerThemes } from '@/constants/viewerThemes';
import ThemeBox from './ThemeBox';

interface ThemeStylerProps {
  theme: ThemeType;
  setTheme: (val: ThemeType) => void;
}

function ThemeStyler({ theme, setTheme }: ThemeStylerProps) {
  return (
    <ul className="flex w-full gap-4 overflow-x-auto">
      {Object.keys(ViewerThemes).map((key) => (
        <ThemeBox
          key={key}
          theme={key as ThemeType}
          isSelected={theme === key}
          onClick={setTheme}
        />
      ))}
    </ul>
  );
}

export default ThemeStyler;
