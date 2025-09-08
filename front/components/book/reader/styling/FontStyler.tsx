import { Button } from '@/components/ui/button';

interface FontStylerProps {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  setFontSize: (val: number) => void;
  setLineHeight: (val: number) => void;
  setLetterSpacing: (val: number) => void;
}

function FontStyler({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  letterSpacing,
  setLetterSpacing,
}: FontStylerProps) {
  return (
    <ul className="flex w-full gap-4 justify-between">
      <li className="flex flex-col gap-2">
        <span className="text-xs text-foreground">폰트 크기</span>
        <div className="flex items-center gap-2">
          <Button
            className="text-sm cursor-pointer size-8"
            disabled={fontSize <= 8}
            onClick={() => setFontSize(fontSize - 1)}
          >
            A
          </Button>
          <Button
            className="text-lg cursor-pointer size-8"
            disabled={fontSize >= 24}
            onClick={() => setFontSize(fontSize + 1)}
          >
            A
          </Button>
        </div>
      </li>
      <li className="flex flex-col gap-2">
        <span className="text-xs text-foreground">줄 간격</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="size-8 cursor-pointer"
            disabled={lineHeight <= 1}
            onClick={() => setLineHeight(lineHeight - 0.1)}
          >
            -
          </Button>
          <span>{lineHeight}</span>
          <Button
            variant="ghost"
            className="size-8 cursor-pointer"
            disabled={lineHeight >= 1.5}
            onClick={() => setLineHeight(lineHeight + 0.1)}
          >
            +
          </Button>
        </div>
      </li>
      <li className="flex flex-col gap-2">
        <span className="text-xs text-foreground">글자 간격</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="size-8 cursor-pointer"
            disabled={letterSpacing <= 0}
            onClick={() => setLetterSpacing(letterSpacing - 1)}
          >
            -
          </Button>
          <span>{letterSpacing}</span>
          <Button
            variant="ghost"
            className="size-8 cursor-pointer"
            disabled={letterSpacing >= 4}
            onClick={() => setLetterSpacing(letterSpacing + 1)}
          >
            +
          </Button>
        </div>
      </li>
    </ul>
  );
}

export default FontStyler;
