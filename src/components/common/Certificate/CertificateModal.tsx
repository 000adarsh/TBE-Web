import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { CertificateDataPoints } from '@/interfaces';
import { CertificateContent, Modal } from '@/components';

const CertificateModal = ({
  isOpen,
  closeModal,
  certificateDataPoints,
}: {
  isOpen: boolean;
  closeModal: () => void;
  certificateDataPoints: CertificateDataPoints;
}) => {
  const { username, courseName, date } = certificateDataPoints;
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (certificateRef.current) {
      try {
        const dataUrl = await toPng(certificateRef.current, { quality: 1 });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${username}-${courseName}.png`;
        link.click();
      } catch (error) {
        console.error('Error generating certificate image:', error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title='Your Certificate'>
      <section>
        <div ref={certificateRef} className='bg-gray-100 border'>
          <CertificateContent
            type='shiksha'
            username={username}
            courseName={courseName}
            date={date}
          />
        </div>
        <div className='mt-2 text-center'>
          <button
            onClick={handleDownload}
            className='rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600 focus:outline-none'
          >
            Download Certificate
          </button>
        </div>
      </section>
    </Modal>
  );
};

export default CertificateModal;
