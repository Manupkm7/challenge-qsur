import { ReactNode } from 'react';
import { MdClose as CloseIcon } from '@react-icons/all-files/md/MdClose';

type ModalLayoutProps = {
  children: ReactNode;
  handleToggle: () => void;
  title: string;
  show: boolean;
  width?: any;
};

const ModalLayout = ({ children, handleToggle, title, show, width = '540' }: ModalLayoutProps) => {
  return (
    <>
      {show ? (
        <div className="fixed flex items-center justify-center inset-0 bg-[rgba(0,0,0,0.3)] w-full z-30">
          <div
            className="relative w-full px-4 py-5 bg-white rounded-lg"
            data-testid="modal-content"
            style={{ maxWidth: `${width}px` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-semibold">{title}</div>
              <CloseIcon
                onClick={handleToggle}
                className="cursor-pointer"
                data-testid="close-icon"
              />
            </div>
            <div>{children}</div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalLayout;
