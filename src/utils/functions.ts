import { MICROCAMPS, WORKSHOPS, localStorageKeys } from '@/constant';
// import workshops from '@/data/workshop';
import {
  AuthUserType,
  NextAuthUserType,
  PageSlug,
  UserInLocalStorage,
} from '@/interfaces';
import { BuiltInProviderType } from 'next-auth/providers';
import { signIn } from 'next-auth/react';

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
};

const formatTime = (time: number) => time.toString().padStart(2, '0');

// Get Workshop Page data
const getWorkshopPageData = (slug: PageSlug) =>
  WORKSHOPS.find((workshop) => workshop.meta.slug === slug);

// Get Microcamp Page data
const getMicrocampPageData = (slug: PageSlug) =>
  MICROCAMPS.find((microcamp) => microcamp.slug === slug);

// Get % of Discount on Program
const getDiscountPercentage = (basePrice: number, sellingPrice: number) =>
  Math.floor(((basePrice - sellingPrice) / basePrice) * 100);

// Sign in User
const signInUser = (provider: BuiltInProviderType) => signIn(provider);

// Store data in Local Storage
const setLocalStorageItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data in local storage:', error);
  }
};

// Get data from Local Storage
const getLocalStorageItem = (key: string): any | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error fetching data from local storage:', error);
    return;
  }
};

const setUserInLocalStorage = (
  key: string,
  user: NextAuthUserType,
  type: AuthUserType
) => {
  const payload: UserInLocalStorage = {
    user,
    type,
  };

  setLocalStorageItem(key, payload);

  return payload;
};

const getetUserFromLocalStorage = (key: string) => {
  const user = getLocalStorageItem(key) as UserInLocalStorage;

  return user;
};

export {
  formatDate,
  formatTime,
  getWorkshopPageData,
  getMicrocampPageData,
  getDiscountPercentage,
  signInUser,
  setLocalStorageItem,
  getLocalStorageItem,
  setUserInLocalStorage,
  getetUserFromLocalStorage,
};
