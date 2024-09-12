import { envConfig, getSEOMeta, routes } from '@/constant';
import {
  BaseShikshaCourseResponseProps,
  PageSlug,
  ProjectPickedPageProps,
} from '@/interfaces';
import {
  getSelectedCourseChapterMeta,
  getSelectedProjectChapterMeta,
  isUserAuthenticated,
} from '.';

const getPreFetchProps = async ({ query, resolvedUrl }: any) => {
  const { projectSlug } = query;
  let slug = '/';

  if (resolvedUrl) {
    slug = resolvedUrl;
  }

  if (projectSlug) {
    slug = `/projects/${projectSlug}`;
  }

  const seoMeta = getSEOMeta(slug as PageSlug);

  const redirect = !seoMeta && {
    destination: '/404',
  };

  return {
    props: { slug, seoMeta },
    redirect,
  };
};

const getProjectPageProps = async ({ query }: any) => {
  const { projectSlug, projectId, sectionId, chapterId } = query;

  let slug = '/';

  if (projectSlug) {
    slug = '/projects/' + projectSlug;
  }

  if (projectId) {
    try {
      const seoMeta = getSEOMeta(slug as PageSlug);

      const { status, data } = await fetchAPIData(`projects/${projectId}`);

      // If the project data is not found, return the message
      if (!status) {
        return {
          redirect: {
            destination: '/404',
          },
          props: { slug },
        };
      }

      const project: ProjectPickedPageProps = data;
      let { meta } = project;

      if (sectionId && chapterId) {
        const selectedChapterMeta = getSelectedProjectChapterMeta(
          project,
          sectionId,
          chapterId
        );

        if (selectedChapterMeta) meta = selectedChapterMeta;
      }

      return {
        props: {
          slug,
          seoMeta,
          project,
          meta,
        },
      };
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  }

  return {
    redirect: {
      destination: '/404',
    },
    props: { slug },
  };
};

const getCoursePageProps = async (context: any) => {
  const { req, query } = context;
  const { courseSlug, courseId, chapterId } = query;

  let slug = '/';

  if (courseSlug) {
    slug = '/shiksha/' + courseSlug;
  }

  const seoMeta = getSEOMeta(slug as PageSlug);

  if (courseId && seoMeta) {
    try {
      const user = await isUserAuthenticated(req);

      const { status, data } = await fetchAPIData(
        routes.api.courseByIdWithUser(courseId, user?.id)
      );

      // If the project data is not found, return the message
      if (!status) {
        return {
          redirect: {
            destination: '/404',
          },
          props: { slug },
        };
      }

      const course: BaseShikshaCourseResponseProps = data;
      let { meta } = course;
      let currentChapterId = '';

      if (chapterId) {
        currentChapterId = chapterId;

        const selectedChapterMeta = getSelectedCourseChapterMeta(
          course,
          chapterId
        );

        if (selectedChapterMeta) meta = selectedChapterMeta;
      }

      return {
        props: {
          slug,
          seoMeta,
          course,
          meta,
          currentChapterId,
        },
      };
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  }

  return {
    redirect: {
      destination: '/404',
    },
    props: { slug },
  };
};

const getMyCoursesPageProps = async (context: any) => {
  const { req } = context;

  const slug = routes.shikshaEnrolled;

  const seoMeta = getSEOMeta(slug as PageSlug);

  if (seoMeta) {
    try {
      const user = await isUserAuthenticated(req);

      // If the project data is not found, return the message
      if (!user) {
        return {
          redirect: {
            destination: routes.shikshaExplore,
          },
          props: { slug },
        };
      }

      const { status, data } = await fetchAPIData(
        routes.api.allCoursesForUser(user.id)
      );

      if (!status) {
        return {
          redirect: {
            destination: '/404',
          },
          props: { slug },
        };
      }

      const courses: BaseShikshaCourseResponseProps[] = data;

      return {
        props: {
          slug,
          seoMeta,
          courses,
        },
      };
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  }

  return {
    redirect: {
      destination: '/404',
    },
    props: { slug },
  };
};

const fetchAPIData = async (url: string) => {
  const response = await fetch(`${envConfig.BASE_API_URL}/${url}`);

  return await response.json();
};

export {
  getPreFetchProps,
  getProjectPageProps,
  getCoursePageProps,
  getMyCoursesPageProps,
};
