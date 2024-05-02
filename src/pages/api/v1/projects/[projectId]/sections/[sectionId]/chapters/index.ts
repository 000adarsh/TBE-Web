// Add Chapter API
import { NextApiRequest, NextApiResponse } from 'next';
import { apiStatusCodes } from '@/constant';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middlewares';
import {
  addChapterToSectionInDB,
  getChaptersFromSectionInDB,
} from '@/database';
import { AddChapterRequestPayloadProps } from '@/interfaces';
import { v4 } from 'uuid';
import { getMDXContent } from '@/utils/mdx';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB(res);

  const { method, query } = req;
  const { projectId, sectionId } = query as {
    projectId: string;
    sectionId: string;
  };

  switch (method) {
    case 'POST':
      return handleAddChapter(req, res, projectId, sectionId);
    case 'GET':
      return handleGetChapters(req, res, projectId, sectionId);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: `Method ${method} Not Allowed`,
        })
      );
  }
};

const handleAddChapter = async (
  req: NextApiRequest,
  res: NextApiResponse,
  projectId: string,
  sectionId: string
) => {
  let chapterData: AddChapterRequestPayloadProps = req.body;

  chapterData = {
    ...chapterData,
    chapterId: v4().replace(/-/g, ''),
    content: getMDXContent(),
  };

  try {
    const { data, error } = await addChapterToSectionInDB(
      projectId,
      sectionId,
      chapterData
    );

    if (error) {
      return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: 'Error adding chapter',
          error,
        })
      );
    }

    return res.status(apiStatusCodes.RESOURCE_CREATED).json(
      sendAPIResponse({
        status: true,
        message: 'Chapter Added Successfully',
        data,
      })
    );
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error adding chapter',
        error,
      })
    );
  }
};

const handleGetChapters = async (
  req: NextApiRequest,
  res: NextApiResponse,
  projectId: string,
  sectionId: string
) => {
  try {
    const { data, error } = await getChaptersFromSectionInDB(
      projectId,
      sectionId
    );

    if (error) {
      return res.status(apiStatusCodes.NOT_FOUND).json(
        sendAPIResponse({
          status: false,
          message: 'Error fetching chapters',
          error,
        })
      );
    }

    return res.status(apiStatusCodes.OKAY).json(
      sendAPIResponse({
        status: true,
        message: 'Chapters Fetched Successfully',
        data,
      })
    );
  } catch (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error fetching chapters',
        error,
      })
    );
  }
};

export default handler;
