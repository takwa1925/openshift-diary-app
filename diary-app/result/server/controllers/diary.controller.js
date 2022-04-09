const Joi = require("joi");
const Diary = require("../models/diary.model");
const defaultDiary = require("../../defaultDiary.json")

module.exports = {
  getDiaryConfig,
  updateDiaryConfig,
  checkDiaryConfig
};

const paperColorSchema = Joi.object().keys({
  name: Joi.string().required(),
  value: Joi.string().required(),
  price: Joi.number().required(),
  isActive: Joi.bool().required(),
  _id: Joi.string().optional(),
})
const coverThemeSchema = Joi.object().keys({
  name: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().required(),
  isActive: Joi.bool().required(),
  _id: Joi.string().optional(),
})
const paperTypeSchema = Joi.object().keys({
  name: Joi.string().required(),
  price: Joi.number().required(),
  isActive: Joi.bool().required(),
  _id: Joi.string().optional(),
})

const customizationSchema = Joi.object().keys({
  paperColor: Joi.array().items(paperColorSchema).min(1),
  coverTheme: Joi.array().items(coverThemeSchema).min(1),
  paperType:Joi.array().items(paperTypeSchema).min(1),
  hasCoverText: Joi.bool().required(),
  _id: Joi.string().optional(),
})

const diarySchema = Joi.object({
  name: Joi.string().required(),
  basePrice: Joi.number().required(),
  customization: customizationSchema.required(),
  _id: Joi.string().optional(),
})

/**
 * Returns the entries in diary collection
 * At the moment only returning 1 Diary - can later update to support many types of diaries
 */
async function getDiaryConfig()
{
  await checkDiaryConfig();
  return await Diary.find({ name: "Diary" });
}

async function updateDiaryConfig(diary)
{
  try{
    await checkDiaryConfig();
    diary = await Joi.validate(diary, diarySchema,{ abortEarly: false })
    return await Diary.replaceOne({ name: diary.name }, diary)
  }
  catch(error)
  {
    return error;
  }
}

async function checkDiaryConfig()
{
  let diaryConfig = await Diary.find({ name: "Diary" })
  if(diaryConfig.length == 0)
  {
    diaryConfig = await Diary.create(defaultDiary);
  }
  return diaryConfig.length;
}
