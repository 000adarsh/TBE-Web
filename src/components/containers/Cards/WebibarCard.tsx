import { FlexContainer, Image, LinkButton, Text } from '@/components';
import { WebinarCardProps } from '@/interfaces';

const WebibarCard = ({
  name,
  description,
  coverImageURL,
  dateAndTime,
  registrationUrl,
}: WebinarCardProps) => {
  return (
    <FlexContainer
      direction='col'
      className='p-3 max-w-md bg-dark rounded-lg shadow-lg gap-2'
    >
      <Image src={coverImageURL} alt={`${name} | The Boring Workshops`} />
      <FlexContainer direction='col' itemCenter={false} className='gap-2'>
        <FlexContainer direction='col' itemCenter={false} className='gap-3'>
          <FlexContainer direction='col' itemCenter={false} className='gap-1'>
            <Text level='h5' className='heading-5 text-contentDark'>
              {name}
            </Text>
            <Text level='p' className='pre-title text-grey'>
              {description}
            </Text>
          </FlexContainer>
          <Text level='span' className='strong-text text-secondary'>
            {dateAndTime}
          </Text>
        </FlexContainer>
        <LinkButton
          className='w-full'
          buttonProps={{
            variant: 'PRIMARY',
            text: 'Register Now',
            className: 'w-full',
          }}
          href={registrationUrl}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default WebibarCard;
