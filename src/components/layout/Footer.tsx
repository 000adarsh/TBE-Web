import { FlexContainer, FooterLinksContainer, Logo, Text } from '@/components';
import { FOOTER_NAVIGATION } from '@/constant';

const Footer = () => {
  return (
    <footer className='bg-dark'>
      <FlexContainer className='px-8 py-12'>
        <FlexContainer
          direction='col'
          itemCenter={false}
          className='flex-1 items-baseline'
        >
          <Logo />
          <Text level='p' className='subtitle pt-2'>
            The Boring{' '}
            <Text level='span' className='subtitle text-primary'>
              Education
            </Text>
          </Text>
          <Text level='p' className='paragraph pt-1 text-grey'>
            Learn Tech Skills & Prepare yourself for a Tech Job.
          </Text>
        </FlexContainer>
        <FlexContainer
          className='w-full flex-1 flex-wrap items-baseline justify-between'
          itemCenter={false}
        >
          {FOOTER_NAVIGATION.map((item) => {
            const { isShow, id, title, urls } = item;

            if (isShow)
              return (
                <FooterLinksContainer key={id} title={title} urls={urls} />
              );
          })}
        </FlexContainer>
      </FlexContainer>
      <FlexContainer className='border-t border-grey py-2' itemCenter={true}>
        <Text level='p' className='pre-title'>
          © {new Date().getFullYear()}, The Boring Education
        </Text>
      </FlexContainer>
    </footer>
  );
};

export default Footer;
