import { apiStatusCodes } from '@/constant';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middlewares';
import { getAllEnrolledSheetsFromDB } from '@/database';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    const { method, query } = req;
    const { userId } = query;

    switch (method) {
      case 'GET':
        return handleGetAllUserSheets(req, res, userId as string);
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

const handleGetAllUserSheets = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  try {
    const { data: allInterviewSheets, error: fetchEnrolledSheetsError } =
      await getAllEnrolledSheetsFromDB(userId);

    if (fetchEnrolledSheetsError)
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Failed while fetching enrolled sheets',
        })
      );

    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        data: allInterviewSheets,
      })
    );
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Failed while fetching enrolled sheets',
        error: error,
      })
    );
  }
};

export default handler;
