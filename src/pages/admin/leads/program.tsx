import {
  FlexContainer,
  LinkButton,
  ProgramLeadsCard,
  SEO,
  Section,
  SectionHeaderContainer,
  SelectInput,
  Text,
  withAuth,
} from '@/components';
import { CohortLeadStatus, PageSlug, ProgramLeadCard } from '@/interfaces';
import { formatDate, getPreFetchProps } from '@/utils';
import {
  apiUrls,
  authHOCConfig,
  getSEOMeta,
  programLeadStatusList,
  sendMessageToWhatsappURL,
} from '@/constant';
import { useApi } from '@/hooks';
import { ChangeEvent, ReactEventHandler } from 'react';

const AdminProgramLeadsDashboard = () => {
  const slug: PageSlug = '/admin';
  const seoMeta = getSEOMeta(slug as PageSlug);
  const { data, loading } = useApi({
    method: 'GET',
    url: apiUrls.leadCohort,
  });

  if (loading || !data) return;

  const programLeads: ProgramLeadCard[] = data;

  // console.log('HERE', programLeads);

  return (
    <Section>
      <SEO seoMeta={seoMeta} />
      <FlexContainer justifyCenter={true} className='py-6' direction='col'>
        <FlexContainer direction='col' className='gap-3'>
          <FlexContainer direction='col'>
            <SectionHeaderContainer
              headingLevel={2}
              heading='Program'
              focusText='Leads'
            />
            <Text level='p' className='paragraph mt-1' textCenter={true}>
              The list of all program leads.
            </Text>
          </FlexContainer>
          <FlexContainer direction='col'>
            <FlexContainer className='flex-wrap gap-4 py-6'>
              {programLeads.map((programLead, key) => {
                return <ProgramLeadsCard key={key} {...programLead} />;
              })}
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </Section>
  );
};

export const getServerSideProps = getPreFetchProps;

export default withAuth(AdminProgramLeadsDashboard, authHOCConfig.admin);
