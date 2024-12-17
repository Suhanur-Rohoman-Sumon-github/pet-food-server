import Stripe from 'stripe';
import config from '../../config';


const createPaymentIntentInDb = async (price: number) => {
  if (!config.stripe_secret) {
    throw new Error(
      'Stripe secret key is not set in the environment variables',
    );
  }
  const stripe = new Stripe(config?.stripe_secret);
  const amount = Math.round(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });


  return {
    clientSecret: paymentIntent.client_secret,
  };
};

export const paymentService = {
  createPaymentIntentInDb,
 
};