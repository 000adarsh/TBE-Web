import { FlexContainer, Text } from '@/components';
import { SectionHeaderProps } from '@/interfaces';

const SectionHeaderContainer = ({
  heading,
  focusText,
  headingLevel = 4,
  className = '',
  flexContainerProps,
  subtext,
}: SectionHeaderProps) => {
  return (
    <FlexContainer
      className={`w-full ${className}`}
      {...flexContainerProps}
      direction='col'
    >
      <Text
        level={`h${headingLevel}`}
        className={`heading-${headingLevel}`}
        textCenter={true}
      >
        {heading}
        <Text
          level='span'
          className={`heading-${headingLevel} text-primary`}
          textCenter={true}
        >
          &nbsp;{focusText}
        </Text>
      </Text>
      {subtext && (
        <Text
          level='span'
          className='strong-text text-greyDark'
          textCenter={true}
        >
          {subtext}
        </Text>
      )}
    </FlexContainer>
  );
};

export default SectionHeaderContainer;
