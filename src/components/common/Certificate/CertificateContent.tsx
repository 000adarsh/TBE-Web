import React from 'react';
import { CertificateContentProps } from '@/interfaces';

const CertificateContent = ({
  type,
  userName,
  courseName,
  date,
}: CertificateContentProps) => {
  const backgroundImagePaths: Record<string, string> = {
    WEBINAR: 'url(/images/webinar_certificate.png)',
    SHIKSHA: 'url(/images/shiksha_certificate.png)',
  };

  const userNameStyles: React.CSSProperties = {
    top: '51.5%',
    left: '50%',
    transform:
      type === 'SHIKSHA' ? 'translate(-50%, -110%)' : 'translate(-50%,-140%)',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'capitalize',
    opacity: '0.8',
  };

  const courseNameStyles: React.CSSProperties = {
    top: '59%',
    left: '50%',
    transform:
      type === 'SHIKSHA' ? 'translate(-50%,-110%)' : 'translate(-50%,-130%)',
    fontSize: '0.7rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    opacity: '0.9',
  };

  const dateStyles: React.CSSProperties = {
    top: '67%',
    left: '50%',
    transform:
      type === 'SHIKSHA' ? 'translate(-50%,-110%)' : 'translate(-50%,-150%)',
    fontSize: '0.6rem',
    fontWeight: 500,
    opacity: '0.85',
  };

  return (
    <div
      className='certificate-container relative text-center bg-white'
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: 'auto',
        aspectRatio: '3/2',
        backgroundImage: backgroundImagePaths[type],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div className='absolute' style={userNameStyles}>
        {userName}
      </div>
      <div className='absolute' style={courseNameStyles}>
        {courseName}
      </div>
      <div className='absolute' style={dateStyles}>
        {date}
      </div>
    </div>
  );
};

export default CertificateContent;
