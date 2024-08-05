import { apiStatusCodes } from '@/constant';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middlewares';
import { enrollInACourse, getEnrolledCourse } from '@/database';
import { CourseEnrollmentRequestProps } from '@/interfaces';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB(res);

    switch (req.method) {
      case 'POST':
        return handleCourseEnrollment(req, res);
      default:
        return res.status(apiStatusCodes.BAD_REQUEST).json(
          sendAPIResponse({
            status: false,
            message: `Method ${req.method} Not Allowed`,
          })
        );
    }
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: `Something went wrong`,
        error,
      })
    );
  }
};

const handleCourseEnrollment = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { userId, courseId } = req.body as CourseEnrollmentRequestProps;

  try {
    const { data: alreadyExists, error: fetchEnrolledCourseError } =
      await getEnrolledCourse({ courseId, userId });

    if (fetchEnrolledCourseError)
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed while enrolling course',
        })
      );
    if (alreadyExists)
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Already enrolled in course',
        })
      );

    const { data, error } = await enrollInACourse({ userId, courseId });

    if (error)
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed while enrolling course',
        })
      );

    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        data,
        message: 'Successfully enrolled in course',
      })
    );
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Failed while enrolling course',
        error: error,
      })
    );
  }
};

export default handler;
