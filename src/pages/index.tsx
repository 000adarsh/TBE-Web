import React from 'react';
import {
  LandingPageHero,
  CardContainerA,
  CanYouBeAProgrammer,
  Testimonials,
  SEO,
  LinkButton,
  CardContainerB,
} from '@/components';
import { PageProps } from '@/interfaces';
import { getPreFetchProps } from '@/utils';
import {
  LINKS,
  PRODUCTS,
  STATIC_FILE_PATH,
  USP,
  generateSectionPath,
  routes,
} from '@/constant';
import { useRouter } from 'next/router';

const Home = ({ seoMeta }: PageProps) => {
  const router = useRouter();

  return (
    <React.Fragment>
      <SEO seoMeta={seoMeta} />
      <LandingPageHero
        sectionHeaderProps={{
          heading: 'Tech Education for',
          focusText: 'Everyone',
        }}
        heroText='Learn Tech Skills & Prepare yourself for a Tech Job.'
        primaryButton={
          <LinkButton
            href={generateSectionPath({
              basePath: router.basePath,
              sectionID: routes.internals.landing.products,
            })}
            className='w-full sm:w-fit'
            buttonProps={{
              variant: 'PRIMARY',
              text: 'Get Started',
              className: '',
            }}
          />
        }
        secondaryButton={
          <LinkButton
            href={LINKS.freeTechConsultation}
            className='w-full sm:w-fit'
            buttonProps={{
              variant: 'OUTLINE',
              text: 'Book Free Session',
              className: '',
            }}
            target='BLANK'
          />
        }
        backgroundImageUrl={`${STATIC_FILE_PATH.svg}/hero-image.svg`}
      />
      <CardContainerB
        id={routes.internals.landing.products}
        heading='Our'
        focusText='Products'
        cards={PRODUCTS}
        borderColour={2}
      />
      <CanYouBeAProgrammer />
      <CardContainerA
        heading='What We Do'
        focusText='Differently'
        cards={USP}
      />
      <Testimonials />
    </React.Fragment>
  );
};

export const getServerSideProps = getPreFetchProps;

export default Home;
