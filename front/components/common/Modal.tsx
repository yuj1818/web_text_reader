import Dimmed from './Dimmed';
import { Button } from '../ui/button';
import clsx from 'clsx';

interface ModalProps {
  open: boolean;
  title?: string;
  content?: React.ReactNode;
  rightBtnLabel?: string;
  onRightBtnClick?: () => void | Promise<void>;
  leftBtnLabel?: string;
  onLeftBtnClick?: () => void;
  buttonVariant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost';
  rightBtnColor?: string;
  rightBtnDisabled?: boolean;
}

function Modal({
  open,
  title,
  content,
  rightBtnLabel,
  leftBtnLabel,
  onRightBtnClick,
  onLeftBtnClick,
  buttonVariant,
  rightBtnColor = '',
}: ModalProps) {
  if (open === false) return null;

  return (
    <Dimmed>
      <div
        className="absolute top-1/2 left-1/2 -translate-1/2 bg-foreground rounded overflow-hidden z-[1001] min-w-[15rem] p-4 flex flex-col justify-center gap-8 border boder-gray-200 min-h-[10rem] min-w-[20rem]"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <span className="text-xl font-semibold text-background">{title}</span>
        )}
        {content}
        {(leftBtnLabel || rightBtnLabel) && (
          <div className="w-full flex items-center gap-2 justify-end">
            {leftBtnLabel && (
              <Button
                size="sm"
                className="bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-500/10 "
                onClick={onLeftBtnClick}
              >
                {leftBtnLabel}
              </Button>
            )}
            {rightBtnLabel && (
              <Button
                size="sm"
                variant={buttonVariant || 'default'}
                className={clsx('cursor-pointer', rightBtnColor)}
                onClick={onRightBtnClick}
              >
                {rightBtnLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </Dimmed>
  );
}

export default Modal;
