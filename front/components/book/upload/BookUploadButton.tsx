import { useModalContext } from '@/contexts/ModalContext';
import { Button } from '../../ui/button';
import { Upload } from 'lucide-react';
import BookUploadForm from './BookUploadForm';
import { uploadBook } from '@/lib/book';
import { useUploadStore } from '@/stores/useUploadStore';
import { useQueryClient } from '@tanstack/react-query';

function BookUploadButton() {
  const { open, close } = useModalContext();
  const { setFile } = useUploadStore();
  const queryClient = useQueryClient();

  return (
    <Button
      className="cursor-pointer"
      onClick={() => {
        open({
          title: '파일 업로드',
          rightBtnLabel: '업로드',
          onRightBtnClick: async () => {
            const formData = new FormData();
            const file = useUploadStore.getState().file;
            if (!file) return;
            formData.append('file', file);
            await uploadBook(formData);
            queryClient.invalidateQueries({ queryKey: ['books'] });
            setFile(undefined);
            close();
          },
          content: <BookUploadForm />,
          rightBtnColor: 'bg-sky-500 hover:bg-sky-500/80 text-white',
        });
      }}
    >
      <Upload />
      업로드
    </Button>
  );
}

export default BookUploadButton;
