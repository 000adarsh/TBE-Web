import {
  AddChapterRequestPayloadProps,
  AddProjectRequestPayloadProps,
  AddSectionRequestPayloadProps,
  DatabaseQueryResponseType,
  DeleteSectionRequestPayloadProps,
  UpateSectionRequestPayloadProps,
  UpdateChapterDBRequestProps,
  UpdateProjectRequestPayloadProps,
  UpdateUserChapterInProjectRequestProps,
  EnrollProjectInDBRequestProps,
  ProjectPickedPageProps,
  BaseProjectResponseProps,
} from '@/interfaces';

import { Project, UserProject } from '@/database';
import { modelSelectParams } from '@/constant';

const addAProjectToDB = async ({
  name,
  slug,
  description,
  coverImageURL,
  requiredSkills,
  roadmap,
  difficultyLevel,
}: AddProjectRequestPayloadProps): Promise<DatabaseQueryResponseType> => {
  try {
    const project = new Project({
      name,
      slug,
      description,
      coverImageURL,
      requiredSkills,
      roadmap,
      difficultyLevel,
    });

    try {
      await project.save();
    } catch (error) {
      return { error };
    }

    return { data: project };
  } catch (error) {
    return { error };
  }
};

const getProjectsFromDB = async (): Promise<DatabaseQueryResponseType> => {
  try {
    const projects = await Project.find();
    return { data: projects };
  } catch (error) {
    return { error };
  }
};

const getProjectBySlugFromDB = async (
  slug: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findOne({ slug });

    if (!project) {
      return { error: 'Project not found' };
    }

    return { data: project };
  } catch (error) {
    return { error };
  }
};

const getProjectByIDFromDB = async (
  projectId: string,
  userId?: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return { error: 'Project not found' };
    }

    // Check if user is enrolled in the project if userId is provided
    if (userId) {
      const { data } = await getEnrolledProjectFromDB({ userId, projectId });

      return {
        data: {
          ...project.toObject(),
          isEnrolled: !!data, // Set isEnrolled to true if data exists, otherwise false
        } as ProjectPickedPageProps,
      };
    }

    return { data: project };
  } catch (error) {
    return { error: `Failed while fetching a project: ${error}` };
  }
};

const updateProjectInDB = async ({
  projectId,
  updatedData,
}: UpdateProjectRequestPayloadProps): Promise<DatabaseQueryResponseType> => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedProject) {
      return { error: 'Project not found' };
    }

    return { data: updatedProject };
  } catch (error) {
    return { error };
  }
};

const deleteProjectFromDB = async (
  projectId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const deletedProject = await Project.findOneAndDelete({ _id: projectId });
    if (!deletedProject) {
      return { error: 'Project not found' };
    }
    return { data: deletedProject };
  } catch (error) {
    return { error };
  }
};

const addSectionToProjectInDB = async (
  projectId: string,
  sectionData: AddSectionRequestPayloadProps
): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return { error: 'Project not found' };
    }

    project.sections.push(sectionData);

    await project.save();

    return { data: project };
  } catch (error) {
    return { error: 'Section not added' };
  }
};

const getSectionsFromProjectInDB = async (
  projectId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return { error: 'Project not found' };
    }

    return { data: project.sections };
  } catch (error) {
    return { error: 'Section not fetched' };
  }
};

const updateSectionInProjectInDB = async ({
  projectId,
  sectionId,
  updatedSectionName,
}: UpateSectionRequestPayloadProps): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return { error: 'Project not found' };
    }

    const section = project.sections.find(
      (section) => section.sectionId === sectionId
    );

    if (!section) {
      return { error: 'Section not found' };
    }

    section.sectionName = updatedSectionName;

    await project.save();

    const updatedSectionIndex = project.sections.findIndex(
      (section) => section.sectionId === sectionId
    );

    return { data: project.sections[updatedSectionIndex] };
  } catch (error) {
    return { error: 'Error updating section' };
  }
};

const deleteSectionFromProjectInDB = async ({
  projectId,
  sectionId,
}: DeleteSectionRequestPayloadProps): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return { error: 'Project not found' };
    }

    const sectionIndex = project.sections.findIndex(
      (section) => section.sectionId === sectionId
    );

    if (sectionIndex === -1) {
      return { error: 'Section not found' };
    }

    project.sections.splice(sectionIndex, 1);

    await project.save();

    return {};
  } catch (error) {
    return { error: 'Error deleting section' };
  }
};

const addChapterToSectionInDB = async (
  projectId: string,
  sectionId: string,
  chapterData: AddChapterRequestPayloadProps
): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return { error: 'Project not found' };
    }

    const section = project.sections.find(
      (section) => section.sectionId.toString() === sectionId
    );

    if (!section) {
      return { error: 'Section not found' };
    }

    section.chapters.push(chapterData);

    await project.save();

    return { data: project };
  } catch (error) {
    return { error: 'Chapter not added' };
  }
};

const getChaptersFromSectionInDB = async (
  projectId: string,
  sectionId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return { error: 'Project not found' };
    }

    const section = project.sections.find(
      (section) => section.sectionId.toString() === sectionId
    );

    if (!section) {
      return { error: 'Section not found' };
    }

    return { data: section.chapters };
  } catch (error) {
    return { error: 'Error fetching chapters' };
  }
};

const getChapterFromSectionInDB = async (
  projectId: string,
  sectionId: string,
  chapterId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return { error: 'Project not found' };
    }

    const section = project.sections.find(
      (section) => section.sectionId.toString() === sectionId
    );

    if (!section) {
      return { error: 'Section not found' };
    }

    const chapter = section.chapters.find(
      (chapter) => chapter.chapterId.toString() === chapterId
    );

    if (!chapter) {
      return { error: 'Chapter not found' };
    }

    return { data: chapter };
  } catch (error) {
    return { error: 'Error fetching chapter' };
  }
};

const updateChapterInSectionInDB = async ({
  projectId,
  sectionId,
  chapterId,
  updatedChapterName,
  updatedChapterContent,
  updatedIsOptional,
}: UpdateChapterDBRequestProps): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return { error: 'Project not found' };
    }

    const section = project.sections.find(
      (section) => section.sectionId.toString() === sectionId
    );

    if (!section) {
      return { error: 'Section not found' };
    }

    const chapter = section.chapters.find(
      (chapter) => chapter.chapterId.toString() === chapterId
    );

    if (!chapter) {
      return { error: 'Chapter not found' };
    }

    if (updatedChapterName) chapter.chapterName = updatedChapterName;
    if (updatedChapterContent) chapter.content = updatedChapterContent;
    if (updatedIsOptional !== undefined && updatedIsOptional !== null)
      chapter.isOptional = updatedIsOptional;

    await project.save();

    return { data: project };
  } catch (error) {
    return { error: 'Chapter not updated' };
  }
};

const deleteChapterFromSectionInDB = async ({
  projectId,
  sectionId,
  chapterId,
}: {
  projectId: string;
  sectionId: string;
  chapterId: string;
}): Promise<DatabaseQueryResponseType> => {
  try {
    // Find the project by projectId
    const project = await Project.findById(projectId);

    // If project not found, return error
    if (!project) {
      return { error: 'Project not found' };
    }

    // Find the section by sectionId
    const section = project.sections.find(
      (section) => section.sectionId.toString() === sectionId
    );

    // If section not found, return error
    if (!section) {
      return { error: 'Section not found' };
    }

    // Find the index of the chapter to delete
    const chapterIndex = section.chapters.findIndex(
      (chapter) => chapter.chapterId.toString() === chapterId
    );

    // If chapter not found, return error
    if (chapterIndex === -1) {
      return { error: 'Chapter not found' };
    }

    // Remove the chapter from the section
    section.chapters.splice(chapterIndex, 1);

    // Save the updated project
    await project.save();

    return { data: 'Chapter deleted successfully' };
  } catch (error) {
    return { error: 'Error deleting chapter' };
  }
};

const updateUserProjectChapterInDB = async ({
  userId,
  projectId,
  sectionId,
  chapterId,
  isCompleted,
}: UpdateUserChapterInProjectRequestProps) => {
  try {
    // Find the UserProject document
    const userProject = await UserProject.findOne({ userId, projectId });

    if (!userProject) {
      return { error: 'User project not found' };
    }

    // Find the specific section in the sections array
    const sectionIndex = userProject.sections.findIndex(
      (section) => section.sectionId.toString() === sectionId.toString()
    );

    if (sectionIndex === -1) {
      return { error: 'Section not found in user project' };
    }

    // Find the specific chapter in the chapters array within the section
    const chapterIndex = userProject.sections[sectionIndex].chapters.findIndex(
      (chapter) => chapter.chapterId.toString() === chapterId.toString()
    );

    if (chapterIndex === -1) {
      // If chapter is not found, add it with the given status
      userProject.sections[sectionIndex].chapters.push({
        chapterId: chapterId,
        isCompleted: isCompleted,
      });
    } else {
      // If chapter is found, update the isCompleted status and update timestamp
      userProject.sections[sectionIndex].chapters[chapterIndex].isCompleted =
        isCompleted;
      userProject.sections[sectionIndex].chapters[chapterIndex].updatedAt =
        new Date();
    }

    // Save the updated document
    await userProject.save();

    return { data: userProject };
  } catch (error) {
    return { error: 'Failed to update chapter in user project' };
  }
};

const enrollInAProject = async ({
  userId,
  projectId,
}: EnrollProjectInDBRequestProps): Promise<DatabaseQueryResponseType> => {
  try {
    const project = await Project.findById(projectId).lean();
    if (!project) {
      return { error: 'Project not found' };
    }

    const sections = project.sections.map((section: any) => ({
      sectionId: section.sectionId,
      chapters: section.chapters.map((chapter: any) => ({
        chapterId: chapter.chapterId,
        isCompleted: false,
      })),
    }));

    // Create user project data with the initialized sections
    const userProject = await UserProject.create({
      userId,
      projectId,
      sections,
    });

    return { data: userProject };
  } catch (error) {
    console.error('Error enrolling in project:', error);
    return { error: 'Failed while enrolling in a project' };
  }
};

const getAllEnrolledProjectsFromDB = async (
  userId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const enrolledProjects = await UserProject.find({ userId })
      .populate({
        path: 'project',
        select: modelSelectParams.projectPreview,
      })
      .exec();

    return {
      data: enrolledProjects.map((project) => project.project),
    };
  } catch (error) {
    return { error: 'Failed while fetching enrolled projects' };
  }
};

const getEnrolledProjectFromDB = async ({
  userId,
  projectId,
}: EnrollProjectInDBRequestProps): Promise<DatabaseQueryResponseType> => {
  try {
    const enrolledProject = await UserProject.findOne({ userId, projectId });
    return { data: enrolledProject };
  } catch (error) {
    return { error: 'Failed while fetching enrolled project' };
  }
};

const getAProjectForUserFromDB = async (userId: string, projectId: string) => {
  try {
    const userProject = await UserProject.findOne({ userId, projectId })
      .populate({
        path: 'project',
      })
      .exec();

    if (!userProject) {
      const project = await Project.findById(projectId).exec();
      if (!project) {
        return { error: 'Project not found' };
      }
      return {
        data: {
          ...project.toObject(),
          sections: project.sections || [],
          isEnrolled: false,
        },
      };
    }

    const mappedSections = userProject.sections.map((userSection) => {
      const correspondingProjectSection = userProject.project.sections.find(
        (section) => section.sectionId === userSection.sectionId
      );

      const chapters = correspondingProjectSection.chapters.map((chapter) => {
        const isCompleted = userSection.chapters.some(
          (userChapter) =>
            userChapter.chapterId === chapter.chapterId &&
            userChapter.isCompleted
        );

        return {
          ...chapter.toObject(),
          isCompleted: !!isCompleted,
        };
      });

      return {
        ...correspondingProjectSection.toObject(),
        chapters,
      };
    });

    const updatedProjectResponse = {
      ...userProject.project.toObject(),
      sections: mappedSections,
      isEnrolled: true,
    };

    return { data: updatedProjectResponse };
  } catch (error) {
    console.error('Error fetching project for user:', error);
    return { error: 'Failed to fetch project with task status' };
  }
};

export {
  addAProjectToDB,
  getProjectsFromDB,
  getProjectBySlugFromDB,
  updateProjectInDB,
  deleteProjectFromDB,
  getProjectByIDFromDB,
  addSectionToProjectInDB,
  getSectionsFromProjectInDB,
  updateSectionInProjectInDB,
  deleteSectionFromProjectInDB,
  addChapterToSectionInDB,
  getChaptersFromSectionInDB,
  updateChapterInSectionInDB,
  deleteChapterFromSectionInDB,
  getChapterFromSectionInDB,
  updateUserProjectChapterInDB,
  enrollInAProject,
  getEnrolledProjectFromDB,
  getAllEnrolledProjectsFromDB,
  getAProjectForUserFromDB,
};
