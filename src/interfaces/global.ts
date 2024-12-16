import { FooterLinksContainerProps } from '.';

export interface FooterNavigationDataProps extends FooterLinksContainerProps {
  id: string;
  isShow: boolean;
}

export type GetSEOMetaResponseType = {
  title: string;
  siteName: string;
  description: string;
  url: string;
  type: string;
  robots: string;
  image: string;
};

export type ProductLabelType =
  | 'Roadmaps'
  | 'The Boring Projects'
  | 'Shiksha'
  | 'Interview Prep'
  | 'The Boring Workshops'
  | 'The Boring Open Source'
  | 'Interview Prep';

export interface ProductDataProps {
  [key: string]: {
    label: ProductLabelType;
    slug: string;
    description: string;
  };
}

export interface TopNavbarLinkProps {
  id: string;
  name: string;
  href: string;
  description?: string;
  target?: 'BLANK';
  isDevelopment?: boolean;
}

export interface TopNavbarContainerProps {
  user: TopNavbarLinkProps[];
  products: TopNavbarLinkProps[];
  links: TopNavbarLinkProps[];
}

export interface ServerSessionProp {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: Date;
}

export interface WebinarPageProps {
  webinarId: string;
  hostName: string;
  hostImageUrl: string;
  hostRole: string;
  dateAndTime: string;
  title: string;
  description: string;
  bannerImageUrl: string;
}
