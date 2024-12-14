const databaseModels = {
  PROJECT: 'Project',
  USER: 'User',
  USER_PROJECT: 'UserProject',
  COURSE: 'Course',
  INTERVIEW_SHEET: 'InterviewSheet',
  COURSE_SECTION: 'CourseSection',
  COURSE_CHAPTER: 'CourseChapter',
  USER_COURSE: 'UserCourse',
  USER_SHEET: 'UserSheet',
  WEBINAR: 'Webinar',
};

const modelSelectParams = {
  coursePreview: '_id name slug coverImageURL description liveOn',
  projectPreview: '_id name slug coverImageURL description isActive',
};

export { databaseModels, modelSelectParams };
