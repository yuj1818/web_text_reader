import { useModalContext } from '@/contexts/ModalContext';

function Dimmed({ children }: { children: React.ReactNode }) {
  const { close } = useModalContext();

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50" onClick={() => close()}>
      {children}
    </div>
  );
}

export default Dimmed;
