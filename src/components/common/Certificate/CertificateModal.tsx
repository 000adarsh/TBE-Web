import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { CertificateModalProps } from '@/interfaces';
import {
  Button,
  CertificateContent,
  FlexContainer,
  LinkButton,
  Modal,
} from '@/components';
import { useUser } from '@/hooks';
import { useRouter } from 'next/router';

import { formatDate, generatePublicCertificateLink } from '@/utils';

const CertificateModal = ({
  isOpen,
  closeModal,
  courseName,
  certificateId,
}: CertificateModalProps) => {
  const { user } = useUser();
  const certificateRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDownload = async () => {
    if (certificateRef.current) {
      try {
        const dataUrl = await toPng(certificateRef.current, { quality: 1 });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${user?.name}-${courseName}.png`;
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
            type='SHIKSHA'
            userName={user?.name ?? ''}
            courseName={courseName}
            date={formatDate({}).date}
          />
        </div>
        <FlexContainer className='py-2 gap-1'>
          <LinkButton
            target='_blank'
            href={generatePublicCertificateLink(router.basePath, certificateId)}
            buttonProps={{ variant: 'PRIMARY', text: 'View' }}
          />
          <Button variant='OUTLINE' text='Download' onClick={handleDownload} />
        </FlexContainer>
      </section>
    </Modal>
  );
};

export default CertificateModal;
