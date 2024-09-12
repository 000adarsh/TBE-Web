import React, { Fragment } from 'react';
import { MyCoursesPageProps, PrimaryCardWithCTAProps } from '@/interfaces';
import {
  SEO,
  CardContainerB,
  FlexContainer,
  Text,
  LinkButton,
} from '@/components';
import { useAPIResponseMapper } from '@/hooks';
import { getMyCoursesPageProps, mapCourseResponseToCard } from '@/utils';
import { routes } from '@/constant';

const Home = ({ seoMeta, courses: response }: MyCoursesPageProps) => {
  const courses: PrimaryCardWithCTAProps[] = useAPIResponseMapper(
    response,
    mapCourseResponseToCard
  );

  console.log('HERE', courses);

  const noCourseFoundUI = (!courses || courses.length === 0) && (
    <FlexContainer
      justifyCenter={true}
      className='item-center justify-center flex-col'
    >
      <Text level='p' className='strong-text mb-3'>
        Oops! No Enrolled Courses found.
      </Text>
      <LinkButton
        buttonProps={{
          variant: 'PRIMARY',
          text: 'Start Learning',
        }}
        href={routes.shikshaExplore}
      ></LinkButton>
    </FlexContainer>
  );

  return (
    <Fragment>
      <SEO seoMeta={seoMeta} />
      <CardContainerB
        heading='My'
        focusText='Courses'
        cards={courses}
        borderColour={2}
        subtext='Continue Learning from where you left'
        sectionClassName='px-2 py-4'
      />
      {noCourseFoundUI}
    </Fragment>
  );
};

export const getServerSideProps = getMyCoursesPageProps;

export default Home;
