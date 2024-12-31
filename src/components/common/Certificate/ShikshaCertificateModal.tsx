import { CertificateModalProps } from '@/interfaces';
import {
  Button,
  CertificateContent,
  FlexContainer,
  LinkButton,
  Modal,
} from '@/components';
import { useCertificate, useUser } from '@/hooks';
import { useRouter } from 'next/router';
import { formatDate, generatePublicCertificateLink } from '@/utils';

const ShikshaCertificateModal = ({
  isOpen,
  closeModal,
  courseName,
  certificateId,
}: CertificateModalProps) => {
  const { user } = useUser();
  const { certificateRef, handleDownload } = useCertificate();
  const router = useRouter();

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
            buttonProps={{ variant: 'PRIMARY', text: 'Share' }}
          />
          <Button
            variant='OUTLINE'
            text='Download'
            onClick={() => handleDownload(courseName)}
          />
        </FlexContainer>
      </section>
    </Modal>
  );
};

export default ShikshaCertificateModal;
