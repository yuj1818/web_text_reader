import clsx from 'clsx';

function ThemeBox({
  bgColor,
  fontColor,
}: {
  bgColor: string;
  fontColor: string;
}) {
  return (
    <li
      className={clsx(
        'flex justify-center items-center rounded shrink-0 w-[5rem] h-[5rem] cursor-pointer border',
        bgColor,
      )}
    >
      <span className={clsx('text-sm', fontColor)}>가나다</span>
    </li>
  );
}

export default ThemeBox;
