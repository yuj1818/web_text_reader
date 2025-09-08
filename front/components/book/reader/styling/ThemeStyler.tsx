import ThemeBox from './ThemeBox';

function ThemeStyler() {
  return (
    <ul className="flex w-full gap-4 overflow-x-auto">
      <ThemeBox bgColor="bg-neutral-800" fontColor="text-white" />
      <ThemeBox bgColor="bg-black" fontColor="text-white" />
      <ThemeBox bgColor="bg-amber-100" fontColor="text-neutral-800" />
      <ThemeBox bgColor="bg-white" fontColor="text-black" />
    </ul>
  );
}

export default ThemeStyler;
