import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Image, Link } from '@/components';
import { TOP_NAVIGATION } from '@/constant';

const UserAvatar = () => {
  const session = useSession();

  if (session.status === 'loading') return null;
  if (session.status !== 'authenticated') return null;

  return (
    <div>
      <Popover className='relative p-0 w-[40px] h-[40px] rounded-[50%] border-[2px]'>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? 'text-white' : 'text-white/90'}
                outline-none p-0 w-full`}
            >
              <Image
                src={session.data.user?.image || ''}
                alt={session.data.user?.name || ''}
                className='rounded-[50%] '
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel
                className={`absolute z-10 mt-1 flex w-screen max-w-max -translate-x-2/3 `}
              >
                <div className='overflow-hidden rounded-2 bg-white text-sm shadow-lg ring-1 ring-gray-900/5 min-w-[200px]'>
                  <div className='flex flex-col p-1'>
                    {TOP_NAVIGATION.user.map(({ id, name, href, target }) => (
                      <Link
                        key={id}
                        href={href}
                        target={target}
                        className='text-base text-left font-semibold text-gray-600 p-1 hover:bg-gray-100 rounded-md'
                      >
                        {name}
                      </Link>
                    ))}
                    <button
                      className='text-base text-left font-bold text-gray-500 p-1 hover:bg-gray-100 rounded-md'
                      onClick={() => {
                        signOut();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default UserAvatar;
