import { Webinar } from '@/database';
import {
  AddWebinarRequestPayloadProps,
  UpdateEnrolledUsersRequestPayloadProps,
} from '@/interfaces';

// Add A Webinar
const addAWebinarToDB = async (
  webinarPayload: AddWebinarRequestPayloadProps
) => {
  try {
    const newWebinar = new Webinar(webinarPayload);
    const savedWebinar = await newWebinar.save();
    return { data: savedWebinar };
  } catch (error) {
    return { error };
  }
};

const getAllWebinarsFromDB = async () => {
  try {
    const webinars = await Webinar.find();
    return { data: webinars };
  } catch (error) {
    return { data: null, error };
  }
};

const updateWebinarInDB = async (
  slug: string,
  updatedWebinar: UpdateEnrolledUsersRequestPayloadProps
) => {
  try {
    const { users, ...otherUpdates } = updatedWebinar;

    const updatedWebinarData = await Webinar.findOneAndUpdate(
      { slug },
      { $set: otherUpdates },
      { new: true }
    );

    if (!updatedWebinarData) {
      return { data: null, error: 'Webinar not found' };
    }

    // Push users into enrolledUsersList without duplicates
    if (users && users.length > 0) {
      await Webinar.updateOne(
        { slug },
        {
          $addToSet: {
            enrolledUsersList: { $each: users },
          },
        }
      );
    }

    // Fetch the updated webinar data
    const finalUpdatedWebinar = await Webinar.findOne({ slug });

    return { data: finalUpdatedWebinar };
  } catch (error) {
    return { data: null, error };
  }
};

const checkUserRegistrationInWebinarDB = async (
  slug: string,
  email: string
) => {
  try {
    const webinar = await Webinar.findOne({ slug });

    if (!webinar) {
      return { data: false, error: 'Webinar not found' };
    }

    const isRegistered = webinar.enrolledUsersList.some(
      (user: { email: string }) => user.email === email
    );

    return { data: isRegistered };
  } catch (error) {
    return { data: null, error };
  }
};

const getWebinarDetailsFromDB = async (slug: string) => {
  try {
    const webinarDetails = await Webinar.findOne({ slug }).select(
      '-enrolledUsersList'
    );

    if (!webinarDetails) {
      return {
        data: null,
        error: 'Webinar not found',
      };
    }

    return {
      data: webinarDetails,
    };
  } catch (error) {
    return {
      data: null,
      error: 'Failed to fetch webinar details from the database',
    };
  }
};

const getWebinarBySlugFromDB = async (slug: string) => {
  try {
    const webinar = await Webinar.findOne({ slug });
    if (!webinar) {
      return { data: null, error: 'Webinar not found' };
    }

    return { data: webinar };
  } catch (error) {
    return { data: null, error };
  }
};

const deleteAWebinarFromDB = async (slug: string) => {
  try {
    const webinar = await Webinar.findOne({}).where('slug').equals(slug);
    if (!webinar) {
      return { data: null, error: 'Webinar not found' };
    }

    await webinar.deleteOne();

    return {};
  } catch (error) {
    return { error };
  }
};

export {
  getAllWebinarsFromDB,
  updateWebinarInDB,
  checkUserRegistrationInWebinarDB,
  getWebinarDetailsFromDB,
  getWebinarBySlugFromDB,
  addAWebinarToDB,
  deleteAWebinarFromDB,
};
