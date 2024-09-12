import {
  FlexContainer,
  Text,
  PageHeroMetaContainer,
  LoginWithGoogleButton,
  Button,
  LinkButton,
} from '@/components';
import { routes } from '@/constant';
import { useUser } from '@/hooks';
import useApi from '@/hooks/useApi';
import { CourseHeroContainerProps } from '@/interfaces';
import { IoChevronBack } from 'react-icons/io5';

const CourseHeroContainer = ({
  id,
  name,
  isEnrolled,
}: CourseHeroContainerProps) => {
  const { user, isAuth } = useUser();

  const { makeRequest, loading } = useApi('shiksha/enrollCourse');

  const enrollCourse = () => {
    makeRequest({
      method: 'POST',
      url: routes.api.enrollCourse,
      body: {
        userId: user?.id,
        courseId: id,
      },
    })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        // TODO: Handle error
        console.error('Failed to enroll', error);
      });
  };

  let headerActionButton;

  if (!isAuth) {
    headerActionButton = (
      <FlexContainer>
        <LoginWithGoogleButton text='Login to Get Started' />
      </FlexContainer>
    );
  } else if (isAuth && !isEnrolled) {
    headerActionButton = (
      <FlexContainer>
        <Button
          variant='PRIMARY'
          text='Enroll to Course'
          onClick={enrollCourse}
        />
      </FlexContainer>
    );
  }

  if (loading) {
    headerActionButton = (
      <Button variant='PRIMARY' text='Enrolling...' isLoading={true} />
    );
  }

  return (
    <FlexContainer>
      <FlexContainer className='border md:w-4/5 gap-4 w-full p-2 justify-between rounded'>
        <FlexContainer className='gap-4'>
          <FlexContainer justifyCenter={false} itemCenter={false}>
            <LinkButton
              buttonProps={{
                variant: 'OUTLINE',
                text: '',
                icon: (
                  <IoChevronBack
                    className='h-3 w-3'
                    aria-hidden='true'
                    color='grey'
                  />
                ),
              }}
              href={isAuth ? routes.shikshaEnrolled : routes.shikshaExplore}
            />
          </FlexContainer>
          <FlexContainer
            itemCenter={false}
            direction='col'
            className='items-start gap-1'
          >
            <Text level='h4' className='heading-4'>
              Hello {user?.name ?? 'there'}!
            </Text>
            <Text level='p' className='paragraph text-greyDark'>
              Let's Learn Something Today.
            </Text>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer
          justifyCenter={false}
          itemCenter={false}
          className='justify-start items-start gap-3'
        >
          <PageHeroMetaContainer subtitle="YOU'RE LEARNING" title={name} />
        </FlexContainer>

        {headerActionButton}
      </FlexContainer>
    </FlexContainer>
  );
};

export default CourseHeroContainer;
