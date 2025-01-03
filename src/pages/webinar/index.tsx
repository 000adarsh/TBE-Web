import React from 'react';
import {
  LandingPageHero,
  SEO,
  LinkButton,
  Section,
  Text,
  FlexContainer,
  Image,
  Button,
} from '@/components';
import { PageProps } from '@/interfaces';
import { getPreFetchProps } from '@/utils';
import { STATIC_FILE_PATH, routes } from '@/constant';

const Home = ({ seoMeta }: PageProps) => {
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
            href={routes.internals.landing.webinar}
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
      <Section>
        <FlexContainer direction='col' className='gap-4'>
          <Text level='h4' className='heading-4' textCenter={true}>
            Our Workshops
          </Text>
          <div className='p-3 bg-dark rounded-lg border shadow-lg flex-col justify-center items-center gap-2.5 flex'>
            <Image
              className=''
              src={`${STATIC_FILE_PATH.svg}/webinar-2-hour-design-netflix.svg`}
              alt='2 Hour Design: Design Netflix'
            />
            <FlexContainer direction='col' itemCenter={false} className='gap-2'>
              <FlexContainer
                direction='col'
                itemCenter={false}
                className='gap-3'
              >
                <FlexContainer
                  direction='col'
                  itemCenter={false}
                  className='gap-1'
                >
                  <Text level='h5' className='heading-5 text-contentDark'>
                    2 Hour Design: Design Netflix
                  </Text>
                  <Text level='p' className='pre-title text-grey'>
                    Learn Basics of Figma & Design Netflix UI in 2 Hours.
                  </Text>
                </FlexContainer>
                <Text level='span' className='strong-text text-secondary'>
                  3 Jan, Saturday 11 AM
                </Text>
              </FlexContainer>
              <Button variant='PRIMARY' text='Register Now' />
            </FlexContainer>
          </div>
        </FlexContainer>
      </Section>
    </React.Fragment>
  );
};

export const getServerSideProps = getPreFetchProps;

export default Home;
