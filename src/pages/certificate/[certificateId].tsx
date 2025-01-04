import React from 'react';
import { SEO } from '@/components';
import { WebinarsLandingPageProps } from '@/interfaces';
import { getCertificatePageProps } from '@/utils';

const Home = ({ seoMeta, webinars }: WebinarsLandingPageProps) => {
  const [filteredWebinars, setFilteredWebinars] = React.useState(webinars);

  const handleToggle = (activeOption: string) => {
    if (activeOption === 'Upcoming') {
      setFilteredWebinars(webinars.filter((webinar) => !webinar.isCompleted));
    } else if (activeOption === 'Past') {
      setFilteredWebinars(webinars.filter((webinar) => webinar.isCompleted));
    } else {
      setFilteredWebinars(webinars);
    }
  };

  return (
    <React.Fragment>
      <SEO seoMeta={seoMeta} />
    </React.Fragment>
  );
};

export const getServerSideProps = getCertificatePageProps;

export default Home;
