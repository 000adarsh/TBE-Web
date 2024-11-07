import {
  AddInterviewSheetRequestPayloadProps,
  AddInterviewQuestionRequestPayloadProps,
  DatabaseQueryResponseType,
  SheetEnrollmentRequestProps,
  BaseInterviewSheetResponseProps,
} from '@/interfaces';
import { InterviewSheet, UserSheet } from '@/database';
import { modelSelectParams } from '@/constant';

const addAInterviewSheetToDB = async (
  sheetPayload: AddInterviewSheetRequestPayloadProps
): Promise<DatabaseQueryResponseType> => {
  try {
    const sheet = new InterviewSheet(sheetPayload);
    await sheet.save();
    return { data: sheet };
  } catch (error) {
    return { error };
  }
};

const getAllInterviewSheetsFromDB =
  async (): Promise<DatabaseQueryResponseType> => {
    try {
      const course = await InterviewSheet.find()
        .select(modelSelectParams.coursePreview)
        .exec();

      if (!course) {
        return { error: 'InterviewSheet not found' };
      }

      return { data: course };
    } catch (error) {
      return { error };
    }
  };

const getInterviewSheetBySlugFromDB = async (
  slug: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const course = await InterviewSheet.findOne({ slug });

    if (!course) {
      return { error: 'Course not found' };
    }

    return { data: course };
  } catch (error) {
    return { error };
  }
};

const addQuestionToInterviewSheetInDB = async (
  sheetId: string,
  question: AddInterviewQuestionRequestPayloadProps
): Promise<DatabaseQueryResponseType> => {
  try {
    const updatedSheet = await InterviewSheet.findOneAndUpdate(
      { _id: sheetId },
      { $push: { questions: question } },
      { new: true }
    );

    if (!updatedSheet) {
      return { error: 'Interview sheet not found' };
    }

    return { data: updatedSheet };
  } catch (error) {
    return { error: 'Failed to add question to interview sheet' };
  }
};

const enrollInASheet = async ({
  userId,
  sheetId,
}: SheetEnrollmentRequestProps): Promise<DatabaseQueryResponseType> => {
  try {
    const userSheet = await UserSheet.create({ userId, sheetId });
    return { data: userSheet };
  } catch (error) {
    return { error: 'Failed while enrolling in a sheet' };
  }
};

const getEnrolledSheetFromDB = async ({
  userId,
  sheetId,
}: SheetEnrollmentRequestProps): Promise<DatabaseQueryResponseType> => {
  try {
    const enrolledSheet = await UserSheet.findOne({ userId, sheetId });
    return { data: enrolledSheet };
  } catch (error) {
    return { error: 'Failed while fetching enrolled sheet' };
  }
};

const getAllEnrolledSheetsFromDB = async (
  userId: string
): Promise<DatabaseQueryResponseType> => {
  try {
    console.log('getting sheets');
    console.log('userId ', userId);
    const enrolledSheets = await UserSheet.find({ userId })
      .populate({
        path: 'sheet',
        select: modelSelectParams.coursePreview,
      })
      .exec();

    console.log('sheets: ', enrolledSheets);

    return {
      data: enrolledSheets.map((sheet) => sheet.sheet),
    };
  } catch (error) {
    return { error: 'Failed while fetching enrolled sheets' };
  }
};

const markQuestionCompletedByUser = async (
  userId: string,
  sheetId: string,
  questionId: string,
  isCompleted: boolean
): Promise<DatabaseQueryResponseType> => {
  try {
    const updatedSheet = await UserSheet.findOneAndUpdate(
      { userId, sheetId, 'questions.questionId': questionId },
      { $set: { 'questions.$.isCompleted': isCompleted } },
      { new: true }
    );

    if (!updatedSheet) {
      return { error: 'User or question not found' };
    }

    return { data: updatedSheet };
  } catch (error) {
    return { error: 'Failed to mark question as completed' };
  }
};

const getAllQuestionsByUser = async (userId: string) => {
  try {
    const userSheets = await UserSheet.find({ userId }).populate(
      'questions.questionId'
    );

    if (!userSheets.length) {
      return { data: [], error: 'No questions found for this user' };
    }

    const allQuestions = userSheets.flatMap((sheet) => sheet.questions);

    return { data: allQuestions, error: null };
  } catch (error) {
    return { data: null, error: 'Error fetching questions from the database' };
  }
};

const getASheetFromDBById = async (
  sheetId: string,
  userId?: string
): Promise<DatabaseQueryResponseType> => {
  try {
    const sheet = await InterviewSheet.findById(sheetId);

    if (!sheet) {
      return { error: 'Sheet not found' };
    }

    if (userId) {
      const { data } = await getEnrolledSheetFromDB({ userId, sheetId });

      return {
        data: {
          ...sheet.toObject(),
          isEnrolled: !!data,
        } as BaseInterviewSheetResponseProps,
      };
    }

    return { data: sheet };
  } catch (error) {
    return { error: `Failed while fetching a course ${error}` };
  }
};

const getASheetForUserFromDB = async (userId: string, sheetId: string) => {
  try {
    const userSheet = await UserSheet.findOne({ userId, sheetId })
      .populate({
        path: 'sheet',
      })
      .exec();

    if (!userSheet) {
      const { data: sheet } = await getASheetFromDBById(sheetId);
      return { data: { ...sheet.toObject(), isEnrolled: false } };
    }

    const mappedQuestions = userSheet.sheet.questions.map((question) => {
      const isCompleted = userSheet.questions.find(
        (uc) => uc.questionId.toString() === question._id.toString()
      )?.isCompleted;

      return {
        ...question.toObject(),
        isCompleted,
      };
    });

    const updatedSheetResponse = {
      ...userSheet.sheet.toObject(),
      chapters: mappedQuestions,
    };

    return {
      data: {
        ...updatedSheetResponse,
        isEnrolled: true,
      } as BaseInterviewSheetResponseProps,
    };
  } catch (error) {
    return { error: 'Failed to fetch courses with chapter status' };
  }
};

export {
  addAInterviewSheetToDB,
  getAllInterviewSheetsFromDB,
  getInterviewSheetBySlugFromDB,
  addQuestionToInterviewSheetInDB,
  enrollInASheet,
  getEnrolledSheetFromDB,
  markQuestionCompletedByUser,
  getAllQuestionsByUser,
  getASheetForUserFromDB,
  getAllEnrolledSheetsFromDB,
};
