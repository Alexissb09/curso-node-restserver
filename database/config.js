import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected");
  } catch (error) {
    console.log(error);
    throw new Error("Database connection error");
  }
};
