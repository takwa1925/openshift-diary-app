const mongoose = require("mongoose");

const DiarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    customization: {
      paperColor: [
        {
          name: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          isActive: {
            type: Boolean,
            required: true,
            default: true,
          },
        },
      ],
      coverTheme: [
        {
          name: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          isActive: {
            type: Boolean,
            required: true,
            default: true,
          },
        },
      ],
      paperType: [
        {
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          isActive: {
            type: Boolean,
            required: true,
            default: true,
          }
        },
      ],
      hasCoverText: {
        type: Boolean,
        required: true,
      },
    },
  },
  {
    versionKey: false,
  },
  { collection: "diaries" }
);

module.exports = mongoose.model("Diary", DiarySchema, "diaries");
