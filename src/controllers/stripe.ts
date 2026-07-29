import type { Request, Response } from "express";
import { stripe } from "../config/stripe.js";
import { sendError, sendSuccess } from "../utils/api-response.js";

async function createCheckoutSession(req: Request, res: Response) {
  const { priceId } = req.body as { priceId?: unknown };
  const clientUrl = process.env.CLIENT_URL;
  const allowedPriceIds = new Set(
    (process.env.STRIPE_ALLOWED_PRICE_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );

  if (!clientUrl || allowedPriceIds.size === 0) {
    return sendError({
      res,
      statusCode: 500,
      message: "StripeNotConfigured",
    });
  }

  if (
    typeof priceId !== "string" ||
    !priceId.startsWith("price_") ||
    !allowedPriceIds.has(priceId)
  ) {
    return sendError({
      res,
      statusCode: 400,
      message: "InvalidStripePriceId",
    });
  }

  try {
    const price = await stripe.prices.retrieve(priceId);

    if (!price.active || !price.recurring) {
      return sendError({
        res,
        statusCode: 400,
        message: "StripePriceIsNotAnActiveSubscription",
      });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "elements",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      return_url: `${clientUrl}/complete?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return sendError({
        res,
        statusCode: 502,
        message: "StripeClientSecretMissing",
      });
    }

    return sendSuccess({
      res,
      statusCode: 201,
      data: { clientSecret: session.client_secret },
    });
  } catch (error) {
    console.error("Unable to create Stripe Checkout Session", error);
    return sendError({ res, message: "StripeCheckoutSessionError" });
  }
}

async function getSessionStatus(req: Request, res: Response) {
  const sessionId = req.query.session_id;

  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return sendError({
      res,
      statusCode: 400,
      message: "InvalidStripeSessionId",
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "subscription"],
    });
    const paymentIntent =
      typeof session.payment_intent === "object"
        ? session.payment_intent
        : null;
    const subscription =
      typeof session.subscription === "object" ? session.subscription : null;

    return sendSuccess({
      res,
      data: {
        status: session.status,
        payment_status: session.payment_status,
        payment_intent_id: paymentIntent?.id ?? null,
        payment_intent_status: paymentIntent?.status ?? null,
        subscription_id: paymentIntent ? null : (subscription?.id ?? null),
        subscription_status: paymentIntent
          ? null
          : (subscription?.status ?? null),
      },
    });
  } catch (error) {
    console.error("Unable to retrieve Stripe Checkout Session", error);
    return sendError({
      res,
      statusCode: 404,
      message: "StripeCheckoutSessionNotFound",
    });
  }
}

export default { createCheckoutSession, getSessionStatus };
