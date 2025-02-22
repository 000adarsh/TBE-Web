import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Fragment, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { PopoverContainerProps } from '@/interfaces';
import { useRouter } from 'next/router';

const PopoverContainer = ({
  label,
  children,
  panelClasses,
  isOpen: open,
  onToggle,
}: PopoverContainerProps) => {
  const router = useRouter();
  const popoverButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleRouteChange = () => {
      if (open) onToggle();
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, open, onToggle]);

  return (
    <Popover className='relative'>
      {({ open }) => (
        <Fragment>
          <PopoverButton
            ref={popoverButtonRef}
            className='inline-flex items-center text-base text-black outline-none'
            onClick={onToggle}
          >
            <span>{label}</span>
            <ChevronDownIcon className='h-3 w-3' aria-hidden='true' />
          </PopoverButton>

          <Transition
            as={Fragment}
            show={open}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <PopoverPanel
              className={`absolute z-10 mt-2 flex w-screen max-w-max -translate-x-1/2 ${panelClasses}`}
            >
              <div className='overflow-hidden rounded-2 bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                {children}
              </div>
            </PopoverPanel>
          </Transition>
        </Fragment>
      )}
    </Popover>
  );
};

export default PopoverContainer;
