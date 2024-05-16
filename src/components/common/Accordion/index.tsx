import { Disclosure } from '@headlessui/react';
import { FlexContainer, Text } from '@/components';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { AccordionProps } from '@/interfaces';

const Accordion = ({ title, children, open = false }: AccordionProps) => {
  return (
    <Disclosure defaultOpen={open}>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex w-full justify-between items-center rounded border px-2 py-1 strong-text hover:bg-gray-200'>
            <Text level='span' className='paragraph text-greyDark text-left'>
              {title}
            </Text>
            <ChevronUpIcon
              className={`transition text-greyDark ${
                !open ? 'rotate-180 transform' : ''
              } h-5 w-5`}
            />
          </Disclosure.Button>
          <FlexContainer justifyCenter={false} className='my-1 w-full'>
            {children}
          </FlexContainer>
        </>
      )}
    </Disclosure>
  );
};

export default Accordion;
