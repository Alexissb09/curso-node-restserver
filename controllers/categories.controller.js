import { Category } from "../models/category.js";

// get categories - paginated - populate
export const getCategories = async (req, res) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [categories, count] = await Promise.all([
      Category.find(query)
        .limit(Number(limit))
        .skip(Number(from))
        .populate("user")
        .exec(),
      Category.countDocuments(),
    ]);

    if (!categories) {
      return res.status(400).json({
        message: "Not categories in db yet :(",
      });
    }

    res.status(200).json({
      count,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

// get category - {populate}

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryDB = await Category.findById(id).populate("user").exec();

    res.status(200).json(categoryDB);
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async (req, res) => {
  try {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    // Verify if category exist
    if (categoryDB) {
      return res.status(500).json({
        message: `The category ${categoryDB.name} is already registered in db`,
      });
    }

    // Data to save
    const data = {
      name,
      user: req.userAuth._id,
    };

    const category = new Category(data);

    // Save in DB
    await category.save();

    res.status(201).json({
      category,
    });
  } catch (error) {
    console.log(error);
  }
};

// update category

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();

    data.user = req.userAuth.id;

    const categoryUpdated = await Category.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("user")
      .exec();

    res.status(200).json({
      categoryUpdated,
    });
  } catch (error) {
    console.log(error);
  }
};

// delete categorie

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryDeleted = await Category.findByIdAndUpdate(
      id,
      { status: false },
      {
        new: true,
      }
    )
      .populate("user")
      .exec();

    res.status(200).json({
      categoryDeleted,
    });
  } catch (error) {
    console.log(error);
  }
};
