import SupportQueries from '../models/supportQueries.schema.js';
import SuperAdmin from '../models/superAdmin.schema.js';
import { queryStatusType } from '../enums/statusType.enum.js';
import message from '../constants/message.constant.js';
import { userTypeEnum } from '../enums/userType.enum.js';
import Company from '../models/company.schema.js';
import Driver from '../models/driver.schema.js';
import {
  companyNotificationText,
  driverNotificationText,
  generateAdminNotification,
  generateCompanyNotification,
  generateDriverNotification,
  superAdminNotificationText,
} from '../constants/notification.constant.js';

const send = async (req, res) => {
  try {
    const { message, adminReply, queryId } = req.body;
    const admin = await SuperAdmin.find();
    const adminId = admin[0]._id;

    console.log(admin);

    // admin._id
    let query = await SupportQueries.findOne({ _id: queryId });
    let currentUser = query?.companyId ? 'companyId' : 'driverId';
    if (!query) {
      return {
        status: false,
        message: message.QUERY_TICKET_NOT_FOUND,
      };
    }
    if (adminReply) {
      if (query?.status === queryStatusType.CLOSED) {
        console.log('RUNINGOOOO');
        return {
          status: false,
          message: 'Query ticket is closed, cannot send message',
        };
      }
      query.status = queryStatusType.IN_PROGRESS;
      query.queries = [
        ...query.queries,
        {
          sender: adminId,
          text: message,
          createdAt: new Date(),
        },
      ];
      await query.save();
      query = await SupportQueries.findOne({ _id: queryId });
      if (query.userType === userTypeEnum.COMPANY) {
        const company = await Company.findOne({ _id: query.companyId });

        generateCompanyNotification(
          companyNotificationText.WHEN_THE_SUPER_ADMIN_REPLIES_TO_SUPPORT_QUERIES_TITLE,
          companyNotificationText.WHEN_THE_SUPER_ADMIN_REPLIES_TO_SUPPORT_QUERIES_MESSAGE(
            queryId
          ),
          company._id
        );
      }
      if (query.userType === userTypeEnum.DRIVER) {
        const driver = await Driver.findOne({ _id: query.driverId });

        generateDriverNotification(
          driverNotificationText.WHEN_THE_SUPER_ADMIN_REPLIES_TO_SUPPORT_QUERIES_TITLE,
          driverNotificationText.WHEN_THE_SUPER_ADMIN_REPLIES_TO_SUPPORT_QUERIES_MESSAGE(
            queryId
          ),
          driver._id
        );
      }

      await query.save();
    } else {
      if (
        query.status === queryStatusType.PENDING ||
        query.status === queryStatusType.CLOSED
      ) {
        return {
          status: false,
          message: `Cannot send message , this query is in ${query.status} state`,
        };
      }
      query.queries = [
        ...query.queries,
        {
          sender: query[currentUser],
          text: message,
          createdAt: new Date(),
        },
      ];
      await query.save();
    }
    query = await SupportQueries.findOne({ _id: queryId });
    console.log({ query });
    if (query.userType === userTypeEnum.DRIVER && !adminReply) {
      const driver = await Driver.findOne({ _id: query.driverId });
      console.log({ driver });
      generateAdminNotification(
        superAdminNotificationText.WHEN_THE_DRIVER_SENDS_SUPPORT_QUERY_TITLE,
        superAdminNotificationText.WHEN_THE_DRIVER_SENDS_SUPPORT_QUERY_MESSAGE(
          `${driver.firstName} ${driver.lastName}`
        )
      );
    } else if (query.userType === userTypeEnum.COMPANY && !adminReply) {
      const company = await Company.findOne({ _id: query.companyId });
      console.log({ company });
      generateAdminNotification(
        superAdminNotificationText.WHEN_THE_COMPANY_SENDS_SUPPORT_QUERY_TITLE,
        superAdminNotificationText.WHEN_THE_COMPANY_SENDS_SUPPORT_QUERY_MESSAGE(
          `${company.name}`
        )
      );
    }
    console.log('THIS RANNNNNNNNNNN');

    console.log('QUORAAA', query);
    return {
      status: true,
      message: message.MESSAGE_SENT_SUCCESSFULLY,
      data: query,
    };
  } catch (error) {
    console.log('running');
    return { status: false, message: error?.message };
  }
};

const viewAllSupportQueries = async (req) => {
  const { userType } = req.query;

  let senderType = userType === 'DRIVER' ? 'driverId' : 'companyId';

  try {
    const supportQueries = await SupportQueries.find({ userType }).populate(
      senderType
    );
    if (supportQueries.length !== 0) {
      return {
        status: true,
        data: supportQueries,
        message: message.FETCH_ALL_SUPPORT_QUERIES_SUCCESS,
      };
    } else {
      return { status: true, message: message.SUPPORT_QUERY_DOES_NOT_EXIST };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const createTicket = async (req) => {
  try {
    const { user, subject, description, userType } = req.body;

    let senderType = '';
    let findUser = '';
    if (userType === userTypeEnum.COMPANY) {
      senderType = 'companyId';
      findUser = await Company.findOne({ _id: user });
    } else if (userType === userTypeEnum.DRIVER) {
      senderType = 'driverId';
      findUser = await Driver.findOne({ _id: user });
    }
    if (!findUser) {
      return { status: false, message: message.USER_NOT_FOUND };
    }
    console.log('user:', user);
    const supportQuery = await SupportQueries.create({
      [senderType]: user,
      subject,
      description,
      userType,
      createdAt: new Date(),
    });
    return {
      status: true,
      message: message.QUERY_CREATED_SUCCESSFULLY,
      data: supportQuery,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const allUserQueries = async (req) => {
  try {
    const { userType, id } = req.params;

    let senderType = userType === 'DRIVER' ? 'driverId' : 'companyId';

    const allQueries = await SupportQueries.find({ [senderType]: id }).populate(
      senderType
    );
    console.log({ allQueries });
    if (!allQueries) {
      return { status: false, message: `Couldn't find` };
    }
    if (allQueries.length === 0) {
      return {
        status: false,
        message: 'No queries were found',
      };
    }
    return {
      status: true,
      message: 'All queries were found',
      data: allQueries,
    };
  } catch (error) {}
};

const updateStatus = async (req) => {
  try {
    const { queryId } = req.body;
    const query = await SupportQueries.find({ _id: queryId });
    if (!query) {
      return { status: false, message: message.QUERY_TICKET_NOT_FOUND };
    }
    await SupportQueries.updateOne(
      { _id: queryId },
      { $set: { status: queryStatusType.CLOSED } }
    );
    return { status: true, message: message.QUERY_CLOSED_SUCCESSFULLY };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const queryConversation = async (req) => {
  try {
    const { queryId } = req.params;
    const query = await SupportQueries.findOne({ _id: queryId });

    if (!query) {
      return { status: false, message: message.QUERY_TICKET_NOT_FOUND };
    }
    const conversationData = query.queries;
    console.log(query.queries);
    if (conversationData.length === 0) {
      return { status: false, message: 'There are no conversations' };
    }
    return {
      status: true,
      message: 'Successfully fetch all conversation',
      data: conversationData,
    };
  } catch (error) {}
};

export {
  send,
  viewAllSupportQueries,
  createTicket,
  allUserQueries,
  updateStatus,
  queryConversation,
};
