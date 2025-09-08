import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FontStyler from './FontStyler';
import ThemeStyler from './ThemeStyler';

interface StylingOverlayProps {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  setFontSize: (val: number) => void;
  setLineHeight: (val: number) => void;
  setLetterSpacing: (val: number) => void;
}

function StylingOverlay({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  letterSpacing,
  setLetterSpacing,
}: StylingOverlayProps) {
  return (
    <div className="absolute top-[2.5rem] bottom-0 left-0 right-0 bg-foreground/50 z-[1000]">
      <Tabs defaultValue="font" className="w-full p-2 bg-background border">
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
          <ThemeStyler />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StylingOverlay;
