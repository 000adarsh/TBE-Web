import React from 'react';
import {
  LandingPageHero,
  SEO,
  LinkButton,
  Section,
  Text,
  FlexContainer,
  WebibarCard,
} from '@/components';
import { WebinarsLandingPageProps } from '@/interfaces';
import { getWebinarLandingPageProps } from '@/utils';
import { STATIC_FILE_PATH, routes } from '@/constant';

const Home = ({ seoMeta, webinars }: WebinarsLandingPageProps) => {
  return (
    <React.Fragment>
      <SEO seoMeta={seoMeta} />
      <LandingPageHero
        sectionHeaderProps={{
          heading: 'Learn Industry Skills',
          focusText: 'with Live Workshops',
        }}
        heroText='Missing Trending Tech Skills? Join our Weekend Workshops and learn in 2 Hours.'
        primaryButton={
          <LinkButton
            href={`#${routes.internals.landing.webinar}`}
            className='w-full sm:w-fit'
            buttonProps={{
              variant: 'PRIMARY',
              text: 'Explore Workshops',
              className: 'w-full',
            }}
          />
        }
        backgroundImageUrl={`${STATIC_FILE_PATH.svg}/webinar-hero.svg`}
      />
      <Section id={routes.internals.landing.webinar}>
        <FlexContainer direction='col' className='gap-4 md:gap-6'>
          <Text level='h4' className='heading-4' textCenter={true}>
            Our Workshops
          </Text>
          <FlexContainer className='gap-2'>
            {webinars.map((webinar, index) => {
              return <WebibarCard key={index} {...webinar} />;
            })}
          </FlexContainer>
        </FlexContainer>
      </Section>
    </React.Fragment>
  );
};

export const getServerSideProps = getWebinarLandingPageProps;

export default Home;
