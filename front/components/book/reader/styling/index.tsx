import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FontStyler from './FontStyler';
import ThemeStyler from './ThemeStyler';
import { ThemeType } from '@/constants/viewerThemes';

interface StylingOverlayProps {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  theme: ThemeType;
  setFontSize: (val: number) => void;
  setLineHeight: (val: number) => void;
  setLetterSpacing: (val: number) => void;
  setTheme: (val: ThemeType) => void;
  toggleOverlay: () => void;
}

function StylingOverlay({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  letterSpacing,
  setLetterSpacing,
  theme,
  setTheme,
  toggleOverlay,
}: StylingOverlayProps) {
  return (
    <div
      className="absolute top-[2.5rem] bottom-0 left-0 right-0 bg-foreground/50 z-[1000]"
      onClick={toggleOverlay}
    >
      <Tabs
        defaultValue="font"
        className="w-full p-2 bg-background border"
        onClick={(e) => e.stopPropagation()}
      >
        <TabsList>
          <TabsTrigger className="text-xs" value="font">
            폰트
          </TabsTrigger>
          <TabsTrigger className="text-xs" value="theme">
            테마
          </TabsTrigger>
        </TabsList>
        <TabsContent value="font">
          <FontStyler
            fontSize={fontSize}
            setFontSize={setFontSize}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            letterSpacing={letterSpacing}
            setLetterSpacing={setLetterSpacing}
          />
        </TabsContent>
        <TabsContent value="theme">
          <ThemeStyler theme={theme} setTheme={setTheme} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StylingOverlay;
