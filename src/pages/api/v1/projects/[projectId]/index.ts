import { apiStatusCodes } from '@/constant';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendAPIResponse } from '@/utils';
import { connectDB } from '@/middlewares';
import {
  deleteProjectFromDB,
  getProjectByIDFromDB,
  getAProjectForUserFromDB,
  updateProjectInDB,
} from '@/database';
import { UpdateProjectRequestPayloadProps } from '@/interfaces';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const { query } = req;
  const { projectId, userId } = query as { projectId: string; userId: string };

  switch (req.method) {
    case 'GET':
      return handleGetProjectById(req, res, userId, projectId);
    case 'PATCH':
      return handleUpdateProject(req, res, projectId as string);
    case 'DELETE':
      return handleDeleteProject(req, res, projectId as string);
    default:
      return res.status(apiStatusCodes.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: `Method ${req.method} Not Allowed`,
        })
      );
  }
};

const handleGetProjectById = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  projectId: string
) => {
  if (!projectId) {
    return res.status(apiStatusCodes.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: 'Project ID is required',
      })
    );
  }

  const { data, error } = await getAProjectForUserFromDB(userId, projectId);

  if (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error fetching project',
        error: error.message,
      })
    );
  }

  if (!data) {
    return res.status(apiStatusCodes.NOT_FOUND).json(
      sendAPIResponse({
        status: false,
        message: 'Project not found',
      })
    );
  }

  return res.status(apiStatusCodes.OKAY).json(
    sendAPIResponse({
      status: true,
      message: 'Project fetched successfully',
      data,
    })
  );
};

const handleUpdateProject = async (
  req: NextApiRequest,
  res: NextApiResponse,
  projectId: string
) => {
  const { updatedData } = req.body as UpdateProjectRequestPayloadProps;

  const { error: projectNotFound } = await getProjectByIDFromDB(projectId);

  if (projectNotFound) {
    return res.status(apiStatusCodes.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: "Project doesn't exists",
      })
    );
  }

  const { data, error } = await updateProjectInDB({ projectId, updatedData });

  if (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error updating project',
        error: error.message,
      })
    );
  }

  return res.status(apiStatusCodes.OKAY).json(
    sendAPIResponse({
      status: true,
      message: 'Project updated successfully',
      data,
    })
  );
};

const handleDeleteProject = async (
  req: NextApiRequest,
  res: NextApiResponse,
  projectId: string
) => {
  const { data, error } = await deleteProjectFromDB(projectId);

  if (error) {
    return res.status(apiStatusCodes.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        message: 'Error deleting project',
        error: error.message,
      })
    );
  }

  return res.status(apiStatusCodes.OKAY).json(
    sendAPIResponse({
      status: true,
      message: 'Project deleted successfully',
      data,
    })
  );
};

export default handler;
