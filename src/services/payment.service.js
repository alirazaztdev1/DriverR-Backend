import mongoose from 'mongoose';
import _stripe from 'stripe';

import { Plan } from '../models/payment.schema.js';
import message from '../constants/message.constant.js';
import { ProductsNameEnum } from '../enums/productsName.enum.js';
import { paymentPlans } from '../constants/paymentPlans.constant.js';
import Company from '../models/company.schema.js';
import { addons } from '../constants/addons.constant.js';
import { Addon } from '../models/addons.schema.js';
import { Subscription } from '../models/subscription.schema.js';
import { subscriptionTypeEnum } from '../enums/subscriptionType.enum.js';

const stripe = _stripe(process.env.STRIPE_SECRET_KEY);

// initialize - create stripe all products
const createStripeProducts = async (req) => {
  try {
    paymentPlans.map(async (el) => {
      let product = await Plan.findOne({
        name: el.name,
      });
      if (!product) {
        let newPlan = new Plan({
          stripeProductId: el.stripeProductId,
          stripePriceId: el.stripePriceId,
          name: el.name,
          price: el.unit_amount,
          currency: el.currency,
          interval: el.interval,
          planType: subscriptionTypeEnum.PRODUCT,
        });
        newPlan = await newPlan.save();
      } else {
        product.stripeProductId = el.stripeProductId;
        product.stripePriceId = el.stripePriceId;
        product.currency = el.currency;
        product.planType = subscriptionTypeEnum.PRODUCT;
        await product.save();
      }
    });
  } catch (error) {
    return {
      status: false,
      message: message.PAYMENT_PLAN_NOT_ADDED,
    };
  }
};

// initialize - create stripe all add-ons
const createStripeAddons = async (req) => {
  try {
    addons.map(async (el) => {
      let addon = await Plan.findOne({
        name: el.name,
      });
      if (!addon) {
        let newAddon = new Plan({
          stripeProductId: el.stripeProductId,
          stripePriceId: el.stripePriceId,
          name: el.name,
          price: el.unit_amount,
          currency: el.currency,
          planType: subscriptionTypeEnum.ADDON,
        });
        newAddon = await newAddon.save();
      } else {
        addon.stripeProductId = el.stripeProductId;
        addon.stripePriceId = el.stripePriceId;
        addon.planType = subscriptionTypeEnum.ADDON;
        await addon.save();
      }
    });
  } catch (error) {
    return {
      status: false,
      message: message.ADDON_NOT_ADDED,
    };
  }
};

// update a stripe product
const updateProduct = async (req) => {
  const planId = req.params.id;
  const { name, price, interval, currency } = req.body;

  try {
    const plan = await findById(planId);
    if (!plan) {
      return {
        status: false,
        message: message.PAYMENT_PLAN_NOT_FOUND,
      };
    }

    // Update the product name on Stripe
    if (name) {
      await stripe.products.update(plan.stripeProductId, {
        name: name,
      });
      plan.name = name;
    }

    let prodId = plan.stripeProductId;

    const productSubscriptions = await Subscription.find({
      stripeProductId: prodId,
    });

    productSubscriptions.map(async (e) => {
      await updateCompany(
        e.companyId,
        req.body.numberPostsAllowed,
        req.body.numberProfilesAllowed,
        req.body.numberApplicantsAllowed
      );
    });

    // previous approach
    // let updatedPrice = await stripe.prices.create({
    //   unit_amount: price * 100,
    //   currency: currency,
    //   recurring: {
    //     interval: interval,
    //   },
    //   product: plan.stripeProductId,
    // });

    // new approach. update only when no subscription of this plan
    // stripe error of cannot update
    // try {
    //   await stripe.prices.update(plan.stripePriceId, {
    //     unit_amount: price,
    //     // currency: currency,
    //     // recurring: { interval },
    //   });
    //   console.log('Product updated');
    // } catch (err) {
    //   console.error(
    //     'Error updating price information:',
    //     err?.message ? err?.message : err
    //   );
    // }

    // plan.stripePriceId = updatedPrice.id;
    // plan.price = price;
    // plan.interval = interval;
    // plan.currency = currency;
    plan.numberPostsAllowed = req.body.numberPostsAllowed;
    plan.numberProfilesAllowed = req.body.numberProfilesAllowed;
    plan.numberApplicantsAllowed = req.body.numberApplicantsAllowed;
    await plan.save();

    if (plan.price != price) {
      if (productSubscriptions.length) {
        return {
          status: true,
          message:
            'Plan internal settings updated. But price cannot be updated because someone has already subscribed this plan.',
        };
      }
    }

    return {
      status: true,
      data: plan,
      message: message.PAYMENT_PLAN_UPDATED_SUCCESSFULLY,
    };
  } catch (error) {
    console.log('Error in updating product:', error);
    return {
      status: false,
      message: message.PAYMENT_PLAN_NOT_UPDATED,
    };
  }
};

const updateCompany = async (
  id,
  newJobsAllowed,
  newProfilesAllowed,
  newJobAppsAllowed
) => {
  let company = await Company.findOne({
    _id: mongoose.Types.ObjectId(id),
  });

  company.totalJobsAllowed =
    company.totalJobsAllowed + newJobsAllowed;
  company.totalProfilesAllowed =
    company.totalProfilesAllowed + newProfilesAllowed;
  company.totalJobApplicationsAllowed =
    company.totalJobApplicationsAllowed + newJobAppsAllowed;
  await company.save();
};

// view all stripe products
const viewAllProducts = async (req) => {
  try {
    const data = await Plan.find();

    // const data = await stripe.prices.list({
    //   active: true,
    // });
    return {
      status: true,
      data,
      message: message.ALL_PAYMENT_PLANS,
    };
  } catch (error) {
    return {
      status: false,
      message: message.PAYMENT_PLANS_NOT_FOUND,
    };
  }
};

// view all stripe add-ons
const viewAllAddons = async (req) => {
  // const { name, price, interval, currency } = req.body;

  try {
    const data = await Addon.find();
    return {
      status: true,
      data,
      message: message.ALL_ADDONS,
    };
  } catch (error) {
    return {
      status: false,
      message: message.ADDONS_NOT_FOUND,
    };
  }
};

// Get current stripe subscription of customer
const getCustomerSubscription = async (req) => {
  const customerId = req.query.id;
  try {
    let customer = await Company.findOne({
      _id: mongoose.Types.ObjectId(customerId),
    });
    if (!customer) {
      return {
        status: false,
        message: 'Company not found',
      };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripeCustomerId,
    });

    const sub = subscriptions.data[0];

    if (!sub) {
      return {
        status: false,
        message: 'Subscription not found',
      };
    }

    return {
      status: true,
      data: sub,
      message: 'Subscription plan',
    };
  } catch (err) {
    return {
      status: false,
      message: `Error in getting customer subscription: ${err}`,
    };
  }
};

// find payment plan by ID
const findById = async (planId) => {
  return await Plan.findOne({
    _id: mongoose.Types.ObjectId(planId),
  });
};

// function to create customer on stripe
const createStripeCustomer = async (customer) => {
  try {
    const stripeCustomer = await stripe.customers.create({
      name: customer.name,
      email: customer.email,
      phone: customer.phoneNumber,
      description: customer.aboutInfo,
    });
    await Company.updateOne(
      { userId: customer.userId },
      { stripeCustomerId: stripeCustomer.id }
    );
  } catch (error) {
    return {
      status: false,
      message: message.PAYMENT_PLAN_NOT_ADDED,
    };
  }
};

// stripe checkout session for plan subscription
const createCheckoutSession = async (req) => {
  try {
    const {
      userId,
      priceId,
      mode,
      isAddon,
      quantity,
      successUrl,
      cancelUrl,
      allowPromotionCodes,
    } = req.body;

    const user = await Company.findOne({
      _id: mongoose.Types.ObjectId(userId),
    });
    if (!user) {
      return {
        status: false,
        message: message.CUSTOMER_NOT_FOUND,
      };
    }

    const customer = user.stripeCustomerId;
    const product = await Plan.findOne({
      stripePriceId: priceId,
    });
    const stripePrice = await stripe.prices.retrieve(priceId);

    if (!isAddon) {
      const session = await stripe.checkout.sessions.create({
        ...(allowPromotionCodes
          ? {
              allow_promotion_codes: allowPromotionCodes,
            }
          : {}),
        customer,
        mode,
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(mode !== 'setup'
          ? isAddon
            ? {
                line_items: [
                  {
                    price_data: {
                      currency: product.currency,
                      product_data: {
                        name: product.name,
                      },
                      unit_amount: stripePrice.unit_amount,
                    },
                    quantity: quantity,
                  },
                ],
              }
            : {
                line_items: [{ price: priceId, quantity: quantity }],
              }
          : { payment_method_types: ['card'] }),
      });
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: stripePrice.unit_amount,
        currency: product.currency,
      });
      console.log('paymentIntent:', paymentIntent);
      return {
        status: true,
        data: { clientSecret: paymentIntent.client_secret },
        message: message.STRIPE_SESSION_CHECKOUT,
      };
    }
    return {
      status: true,
      data: session,
      message: message.STRIPE_SESSION_CHECKOUT,
    };
  } catch (err) {
    console.log('error creating checkout session', err);
    return {
      status: false,
      message:
        message.ERROR_SESSION_CHECKOUT +
        (err.message ? err.message : err),
    };
  }
};

// Get all transactions list
const transactionList = async (req) => {
  try {
    const trxs = await Subscription.find({ isActive: true }).populate(
      'companyId'
    );

    return {
      status: true,
      data: trxs,
      message: message.TRANSACTIONS_DATA,
    };
  } catch (err) {
    console.log(
      'Error getting transactions:',
      err?.message ? err?.message : err
    );
    return {
      status: false,
      message: message.TRANSACTIONS_ERROR,
    };
  }
};

// Webhook to listen for stripe events
const webhook = async (req, res) => {
  let event;

  try {
    const eventId = req.body.id;
    event = await stripe.events.retrieve(eventId);
    if (!event) {
      return {
        status: false,
        message: `Webhook Error: event not found`,
      };
    }

    // Handle the event
    switch (event.type) {
      case 'invoice.paid':
        try {
          let session = event.data.object;
          console.log('session:', session);
          let company = await Company.findOne({
            stripeCustomerId: session?.customer,
          });
          if (company) {
            const subscriptions = await stripe.subscriptions.list({
              customer: session?.customer,
            });

            const priceId =
              subscriptions.data[0].items.data[0].plan.id;
            const productId =
              subscriptions.data[0].items.data[0].plan.product;
            const productDbDetails = await Plan.findOne({
              stripeProductId: productId,
            });
            const subExist = await Subscription.findOne({
              stripeSubscrpitionId: subscriptions?.data[0]?.id,
            });
            // insert subscription if not already exist
            if (!subExist) {
              // product plans ids, not addons plans ids
              const planIds = paymentPlans.map(
                (e) => e.stripeProductId
              );

              // check if subscribed item is a product or an addon
              let isProdSubs =
                planIds.find((e) => e === productId) != undefined;

              await Subscription.create({
                stripeSubscrpitionId: subscriptions?.data[0]?.id,
                companyId: company?._id,
                stripeCustomerId: session?.customer,
                stripeProductId: productId,
                stripePriceId: priceId,
                isActive: true,
                stripeSubscriptionDetails: subscriptions.data[0],
                subscriptionType: isProdSubs
                  ? subscriptionTypeEnum.PRODUCT
                  : subscriptionTypeEnum.ADDON,
                planName: productDbDetails.name,
              });

              // update the current company's allowed job posts, profile views and other entries
              await updateCompany(
                company._id,
                productDbDetails.numberPostsAllowed,
                productDbDetails.numberProfilesAllowed,
                productDbDetails.numberApplicantsAllowed
              );

              // if it's product subscription, not the addon
              if (isProdSubs) {
                // cancel previous active subscriptions on stripe and in system
                subscriptions.data.map(async (i) => {
                  // check for all other subsciptions in the subsciptions array, except the current one, and cancel them
                  if (i.id !== subscriptions?.data[0]?.id) {
                    const subsExist = await Subscription.findOne({
                      stripeSubscrpitionId: i?.id,
                      isActive: true,
                    });

                    // cancel only product subscriptions, not addon subscriptions
                    if (
                      subsExist.subscriptionType ==
                      subscriptionTypeEnum.PRODUCT
                    ) {
                      // cancel on stripe
                      await stripe.subscriptions.cancel(i.id);
                      // cancel in system database
                      await Subscription.updateOne(
                        {
                          stripeSubscrpitionId: i?.id,
                        },
                        { isActive: false }
                      );
                    }
                  }
                });
              }
            }
          }
        } catch (err) {
          console.error(`Error handling invoice.paid: `, err);
        }
      case 'invoice.payment_failed':
        try {
          console.log('payment failed');
        } catch (err) {
          console.error(`Error invoice.payment_failed: `, err);
        }
      //     try {
      //       const object = event.data.object;
      //       const subscriptionId = object.subscription;
      //       const subscription = await this.stripe.subscriptions.retrieve(
      //         subscriptionId
      //       );
      //       const status = subscription.status;
      //       const customer = object.customer;
      //       console.log('invoice.payment_failed try:', customer);
      //       // const org = await this.orgRepo.findOne({ where: { stripeCustomerId: customer } });
      //       if (org) {
      //         // await this.orgRepo.update(org.orgId, { stripePaymentStatus: status });
      //       }
      //       console.log(`Subscription status is ${status}.`);
      //     } catch (e) {
      //       console.log('invoice.payment_failed catch:', JSON.stringify(e));

      //       response.status(400).send(`Webhook Error: ${e.message}`);
      //     }
      //     break;
      // }
      case 'payment_method.attached':
        try {
          console.log('payment_method.attached');
        } catch (err) {
          console.error(`Error payment_method.attached: `, err);
        }
      //     try {
      //       // await this.payPastDueInvoices(event.data.object );
      //     } catch (e) {
      //       response.status(400).send(`Webhook Error: ${e.message}`);
      //     }
      //     break;
      case 'customer.subscription.deleted':
        try {
          console.log('customer.subscription.deleted');
        } catch (err) {
          console.error(`Error customer.subscription.deleted: `, err);
        }
      //     let subscription = event.data.object;
      //     const customer = subscription.customer;
      //     const subs = await this.stripe.subscriptions.list({
      //       customer,
      //       status: 'active',
      //     });
      //     if (!subs.data.length) {
      //       // const org = await this.orgRepo.findOne({ where: { stripeCustomerId: customer } });
      //       // await this.orgRepo.update(org.orgId, { stripePaymentStatus: subscription.status });
      //     }
      //     break;
      case 'customer.subscription.updated':
        try {
          console.log('customer.subscription.updated');
        } catch (err) {
          console.error(`Error customer.subscription.updated: `, err);
        }
      case 'customer.subscription.created':
        try {
          console.log('customer.subscription.created');
        } catch (err) {
          console.error(`Error customer.subscription.created: `, err);
        }
      //   //   subscription = event.data.object as Stripe.Subscription;
      //   //   console.log(`customer.subscription.updated ${subscription}`);
      //   //   console.log(`Subscription is updated. Status is ${subscription.status}.`);
      //   //   // Then define and call a method to handle the subscription update.
      //   //   // handleSubscriptionUpdated(subscription);
      //   //   break;
      //   // case 'checkout.session.completed':
      //   //   console.log(`checkout.session.completed`);
      //   //   const session = event.data.object;
      //   //   console.log(`checkout.session.completed ${session}`);
      //   //   break;
      // default:
      //   console.log(`Unhandled event type ${event.type}`);
    }

    // // Return a 200 response to acknowledge receipt of the event
    // response.send();
    return { status: true, message: 'Stripe webhook success' };
  } catch (err) {
    return { status: false, message: `Webhook Error: ${err}` };
  }
};

const paymentSuccess = async (req) => {
  return { status: true, message: 'Stripe webhook success url hit' };
};

const paymentFailed = async (req) => {
  return { status: false, message: 'Stripe webhook failed url hit' };
};

export {
  createStripeProducts,
  createStripeAddons,
  updateProduct,
  viewAllProducts,
  viewAllAddons,
  createStripeCustomer,
  getCustomerSubscription,
  createCheckoutSession,
  transactionList,
  webhook,
  paymentSuccess,
  paymentFailed,
};
