import {
  FlexContainer,
  LinkButton,
  MicroCampBGGradientContainer,
  Section,
  SectionHeaderContainer,
  Text,
} from '@/components';
import { LINKS, generateSectionPath, routes } from '@/constant';
import { useRouter } from 'next/router';

const MicroCampLandingHeader = () => {
  const router = useRouter();

  return (
    <Section>
      <MicroCampBGGradientContainer>
        <FlexContainer className='p-4 md:px-12 md:py-8' direction='col'>
          <FlexContainer itemCenter={true} justifyCenter={true}>
            <SectionHeaderContainer
              heading='The Boring'
              focusText='Micro-camp'
              headingLevel={5}
              className='text-dark'
            />
          </FlexContainer>
          <FlexContainer direction='col' itemCenter={true} className='pt-5'>
            <FlexContainer
              direction='col'
              justifyCenter={true}
              className='w-full'
            >
              <Text
                level='h2'
                className='heading-2 text-dark'
                textCenter={true}
              >
                Junior in{' '}
                <Text level='span' className='heading-2 text-primary'>
                  Web Engineering{' '}
                </Text>
                {/* <Text level='span' className='heading-2 text-dark'>
                  Master
                </Text> */}
              </Text>
              <Text
                level='p'
                className='strong-text pt-1 text-dark'
                textCenter={true}
              >
                Learn Fundamentals of Web dev with industry experts in live sessions.
              </Text>
            </FlexContainer>
            <FlexContainer justifyCenter={true} className='w-full gap-2 pt-4'>
              <LinkButton
                href={LINKS.juniorInWebEngineeringRegistrationLink}
                target='BLANK'
                buttonProps={{ variant: 'PRIMARY', text: 'Join waitlist' }}
                className='w-full md:w-auto'
              />
              <LinkButton
                href={generateSectionPath({
                  basePath: router.basePath,
                  sectionID: routes.internals.microCampLanding.explore,
                })}
                buttonProps={{ variant: 'OUTLINE', text: 'Explore' }}
                className='w-full md:w-auto bg-white'
              />
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </MicroCampBGGradientContainer>
    </Section>
  );
};

export default MicroCampLandingHeader;
