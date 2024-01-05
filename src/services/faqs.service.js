import SuperAdmin from '../models/superAdmin.schema.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
import message from '../constants/message.constant.js';

import FAQ from '../models/faq.schema.js';

const addFaq = async (req) => {
  try {
    const { question, answer, targetedUser } = req.body;
    if (!question || !answer) {
      return {
        status: false,
        message: '“Fill the required fields',
      };
    }
    const findFaq = await FAQ.findOne({ question });
    if (findFaq) {
      return {
        status: false,
        message: message.FAQ_ALREADY_EXIST,
      };
    }
    const faq = await FAQ.create({ question, answer, targetedUser });
    faq.save();
    return { status: true, data: faq, message: message.FAQ_ADDED_SUCCESS };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const updateFAQ = async (req) => {
  try {
    const faqId = req.params.id;

    const { question, answer, isActive, targetedUser } = req.body;
    const faq = await FAQ.findOne({ _id: faqId });
    console.log({ faq });

    if (!faq) {
      return { status: false, message: message.FAQ_DOES_NOT_EXIST };
    }
    await faq.updateOne({ question, answer, isActive, targetedUser });
    faq.save();

    return { status: true, data: faq, message: message.FAQ_UPDATED_SUCCESS };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const viewAllFaqs = async (req) => {
  const { targetedUser } = req.query;
  try {
    const faqs = await FAQ.find({ targetedUser });
    if (faqs.length !== 0) {
      return {
        status: true,
        data: faqs,
        message: message.FETCH_ALL_FAQ_SUCCESS,
      };
    } else {
      return { status: true, message: message.FAQ_DOES_NOT_EXIST };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const removeFaq = async (req) => {
  try {
    const { faqId } = req.body;

    const faq = await FAQ.findOne({ _id: faqId });
    if (faq) {
      await FAQ.remove({ _id: faqId });
      return { status: true, data: faq, message: message.FAQ_REMOVED_SUCCESS };
    } else {
      return { status: false, message: message.FAQ_DOES_NOT_EXIST };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export { addFaq, updateFAQ, viewAllFaqs, removeFaq };
