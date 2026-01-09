const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../model/orderSchema");
const Cart = require("../model/cartSchema");
const User = require("../model/userSchema");
const Lecturer = require("../model/lecturerSchema")
// Create checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { courses } = req.body;
    // Handle both Firebase (uid) and JWT (userId) token formats
    const userId = req.user?.userId || req.user?._id || req.user?.uid;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    console.log("Creating checkout session for userId:", userId);
    console.log("Courses received:", JSON.stringify(courses, null, 2));

    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ message: "Invalid products in cart" });
    }

    let totalAmount = 0;

    const courseItems = courses.map((course) => {
      // Ensure price is a number
      const price = parseFloat(course.price) || 0;
      if (isNaN(price)) {
        throw new Error(
          `Invalid price for course ${course.title}: ${course.price}`
        );
      }

      console.log(`Course: ${course.title}, Price: ${price}`);

      const amount = Math.round(price * 100);
      totalAmount += amount * (course.quantity || 1);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.title,
            images: course.courseImg ? [course.courseImg] : [],
          },
          unit_amount: amount,
        },
        quantity: course.quantity || 1,
      };
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: courseItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId: userId.toString(),
        courses: JSON.stringify(
          courses.map((c) => ({
            courseId: c._id,
            quantity: c.quantity || 1,
            price: c.price,
          }))
        ),
      },
    });

    console.log("Stripe session created:", session.id);
    console.log(
      "Success URL:",
      `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`
    );

    // Create order record
    const order = new Order({
      userId,
      courses: courses.map((c) => ({
        courseId: c._id,
        quantity: c.quantity || 1,
        price: c.price,
      })),
      totalAmount: totalAmount / 100,
      stripeSessionId: session.id,
      paymentStatus: "pending",
    });

    await order.save();

    res.status(200).json({ url: session.url, id: session.id, orderId: order._id });
  } catch (error) {
    console.error("Error processing checkout", error);
    res.status(500).json({
      message: "Error checkout server",
      error: error.message,
    });
  }
};
