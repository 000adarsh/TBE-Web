import React from 'react';
import {
  LandingPageHero,
  SEO,
  LinkButton,
  Section,
  Text,
  FlexContainer,
  WebibarCard,
  ToggleButton,
} from '@/components';
import { WebinarsLandingPageProps } from '@/interfaces';
import { getCertificatePageProps } from '@/utils';
import { STATIC_FILE_PATH, routes } from '@/constant';

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
