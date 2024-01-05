import message from '../constants/message.constant.js';
import Chat from '../models/chat.schema.js';
import mongoose from 'mongoose';
import { messageStatusEnum } from '../enums/statusType.enum.js';

// create dummy chats
const createDummyChat = async () => {
  try {
    let company = mongoose.Types.ObjectId('64747f8f6489c102988a121e');
    let driver = mongoose.Types.ObjectId('646dd4ca9b8611405887cc65');
    let messages = [
      {
        sender: mongoose.Types.ObjectId('64747f8f6489c102988a121e'),
        message: 'hello, message1 ',
        createdAt: new Date(),
      },
      {
        sender: mongoose.Types.ObjectId('64747f8f6489c102988a121e'),
        message: 'yes, this message message 2',
        createdAt: new Date(),
      },
      {
        sender: mongoose.Types.ObjectId('646dd4ca9b8611405887cc65'),
        message: 'im feeling good',
        createdAt: new Date(),
      },
      {
        sender: mongoose.Types.ObjectId('64747f8f6489c102988a121e'),
        message: 'nice to listen',
        createdAt: new Date(),
      },
    ];

    await Chat.create({ driver, company, messages: messages });
    // return {
    //   status: true,
    //   message: message.MESSAGE_SENT_SUCCESSFULLY,
    //   data: chat,
    // };
  } catch (error) {
    console.log(error);
    // return { status: false, message: error?.message };
  }
};

const createSocketChat = async (data) => {
  try {
    let chat = await Chat.findOne({
      company: mongoose.Types.ObjectId(data.company),
      driver: mongoose.Types.ObjectId(data.driver),
    });
    if (!chat) {
      await Chat.create(data);
    } else {
      if (data.messages && data.messages.length) {
        chat.messages = chat.messages.concat(data.messages);
        chat.save();
      }
    }
  } catch (error) {
    console.log(error);
    // return { status: false, message: error?.message };
  }
};

const getAllChatsByUser = async (req, res) => {
  try {
    // const { id } = req.query;
    // let chats = await Chat.find({
    //   $or: [{ company: id }, { driver: id }],
    // })
    //   .populate([
    //     { path: 'company', select: 'name profilePicture' },
    //     { path: 'driver', select: 'firstName lastName profilePicture' },
    //   ])
    //   .sort({ updatedAt: -1 });
    const { id } = req.query;
    let chats = await Chat.find({
      $or: [{ company: id }, { driver: id }],
    })
      .populate([
        { path: 'company', select: 'name profilePicture' },
        { path: 'driver', select: 'firstName lastName profilePicture' },
      ])
      .sort({ updatedAt: -1 })
      .lean();

    chats = chats.map((chat) => {
      const unreadCount = chat.messages.reduce((count, message) => {
        if (!message.isRead && message.sender != id) {
          return count + 1;
        }
        return count;
      }, 0);
      return { ...chat, unreadCount };
    });

    return {
      status: true,
      message: message.CHAT_LIST,
      data: chats,
    };
  } catch (error) {
    return { status: false, message: error?.message };
  }
};

const getChatById = async (req, res) => {
  try {
    const { id } = req.query;
    let chats = await Chat.findOne({
      _id: mongoose.Types.ObjectId(id),
    });
    return {
      status: true,
      message: message.CHAT_OBJECT,
      data: chats,
    };
  } catch (error) {
    return { status: false, message: error?.message };
  }
};

const getChatByUserIds = async (req, res) => {
  try {
    const { company, driver } = req.query;
    let chat = await Chat.findOne({
      company: mongoose.Types.ObjectId(company),
      driver: mongoose.Types.ObjectId(driver),
    });
    return {
      status: true,
      message: message.CHAT_OBJECT,
      data: chat,
    };
  } catch (error) {
    return { status: false, message: error?.message };
  }
};

const blockUnblock = async (req, res) => {
  try {
    const { id, blockedBy } = req.query;
    let chat = await Chat.findOne({
      _id: mongoose.Types.ObjectId(id),
    });
    chat.status =
      chat.status === messageStatusEnum.ACTIVE
        ? messageStatusEnum.BLOCKED
        : messageStatusEnum.ACTIVE;
    chat.blockedBy = chat.status == messageStatusEnum.BLOCKED ? blockedBy : '';
    await chat.save();
    return {
      status: true,
      message: message.CHAT_STATUS_UPDATED,
      data: chat,
    };
  } catch (error) {
    return { status: false, message: error?.message };
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id, sender } = req.query;
    console.log(id, sender);
    let chat = await Chat.findOne({
      _id: mongoose.Types.ObjectId(id),
    });

    let updatedMsgs = chat.messages.map((e) =>
      e?.sender == sender
        ? {
            isRead: true,
            sender: e.sender,
            message: e.message,
            _id: e._id,
            createdAt: e.createdAt,
          }
        : {
            isRead: e.isRead,
            sender: e.sender,
            message: e.message,
            _id: e._id,
            createdAt: e.createdAt,
          }
    );
    chat.messages = updatedMsgs;
    // console.log(typeofupdatedMsgs)
    await chat.save();
    return {
      status: true,
      message: message.MESSAGES_STATUS_UPDATED,
      data: chat,
    };
  } catch (err) {
    return { status: false, message: err?.message };
  }
};

const allUnreadCount = async (req, res) => {
  try {
    const { id } = req.query;
    let chats = await Chat.find({
      $or: [{ company: id }, { driver: id }],
    });
    let unreadCount = 0;
    chats.forEach((chat) => {
      chat.unreadCount = chat.messages.reduce((count, message) => {
        if (!message.isRead && message.sender != id) {
          return count + 1;
        }
        return count;
      }, 0);
      unreadCount += chat.unreadCount;
    });

    return {
      status: true,
      message: message.Unread,
      data: unreadCount,
    };
  } catch (error) {
    return { status: false, message: error?.message };
  }
};

export {
  getAllChatsByUser,
  getChatById,
  getChatByUserIds,
  createDummyChat,
  blockUnblock,
  createSocketChat,
  markAsRead,
  allUnreadCount,
};
