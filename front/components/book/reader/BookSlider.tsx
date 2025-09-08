interface BookSliderProps {
  progress: number;
  onChange: (val: number) => void;
}

function BookSlider({ progress, onChange }: BookSliderProps) {
  return (
    <div className="p-2 flex items-center gap-2">
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={progress}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1"
      />
      <span className="text-white">{Math.round(progress * 100)}%</span>
    </div>
  );
}

export default BookSlider;
