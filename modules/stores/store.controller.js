const Store = require("./store.schema");
const User = require("../user/user.schema");
const Inventory = require("../inventory/inventory.schema");

exports.CreateStore = async (req, resp) => {
  try {
    const { name, pincodes, managerId } = req.body;
    if (!name || !pincodes?.length || !managerId) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    const manager = await User.findById(managerId);
    if (!manager) {
      return resp.status(404).json({ message: "No manager found" });
    }

    if (manager.role !== "STORE MANAGER") {
      throw new Error("User is not a store manager");
    }

    const existingStore = await Store.findOne({ managerId });

    if (existingStore) {
      throw new Error("Manager already assigned to a store");
    }

    const data = await Store.create({
      name,
      pincodes,
      isActive: true,
      managerId: managerId,
    });

    await User.findByIdAndUpdate(managerId, {
      storeId: data._id,
    });

    resp.status(201).json({ message: "Store created successfully", data });
  } catch (err) {
    console.log(err);
  }
};

exports.UpdateStore = async (req, resp) => {
  try {
    const { _id } = req.params;
    const { name, pincode, managerId } = req.body;
    if (!name || !pincode || !managerId) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    const manager = await User.findById(managerId);
    if (!manager) {
      return resp.status(404).json({ message: "No manager found" });
    }

    if (manager.role !== "STORE MANAGER") {
      throw new Error("User is not a store manager");
    }

    const existingStore = await Store.findOne({
      managerId,
      _id: { $ne: _id },
    });

    if (existingStore) {
      throw new Error("Manager already assigned to a store");
    }

    const updatedData = { name, pincode, managerId };

    const data = await Store.findByIdAndUpdate(
      _id,
      { $set: updatedData },
      { new: true },
    );

    if (!data) {
      return resp.status(404).json({ message: "No Store found" });
    }

    resp.status(200).json({ message: "Store info updated successfully", data });
  } catch (err) {
    console.log(err);
  }
};

exports.GetAllStores = async (req, resp) => {
  try {
    const data = await Store.find();
    if (data.length === 0) {
      return resp.status(200).json({ message: "No Store found" });
    }

    resp.status(200).json({ message: "success", data });
  } catch (err) {
    console.log(err);
  }
};

exports.ActivateStore = async (req, resp) => {
  try {
    const { _id } = req.params;
    const store = await Store.findById(_id);
    if (!store) {
      return resp.status(404).json({ message: "No Store found" });
    }

    store.isActive = true;
    await store.save();

    resp.status(200).json({ message: "Store is active now" });
  } catch (err) {
    console.log(err);
  }
};

exports.DeActivateStore = async (req, resp) => {
  try {
    const { _id } = req.params;
    const store = await Store.findById(_id);
    if (!store) {
      return resp.status(404).json({ message: "No Store found" });
    }

    store.isActive = false;
    await store.save();

    resp.status(200).json({ message: "Store is unactive now" });
  } catch (err) {
    console.log(err);
  }
};

exports.getStoreByPincode = async (req, resp) => {
  try {
    const { pincode } = req.query;
    const data = await Store.findOne({
      pincodes: pincode,
      isActive: true,
    });

    if (!data) {
      return resp
        .status(404)
        .json({ message: "Service not available at your location" });
    }

    resp.status(200).json({ message: "success", data });
  } catch (err) {
    console.log(err);
  }
};

exports.AllocateStore = async (req, resp) => {
  try {
    const { pincode, items } = req.body;
    if (!pincode || items.length < 1) {
      return resp.status(400).json({ message: "All fields are required" });
    }

    const stores = await Store.find({
      isActive: true,
      pincodes: { $in: [pincode] },
    }).sort({ storePriority: 1 });

    if (stores.length < 1) {
      return (resp.status(404), json({ message: "No Store is serviceable" }));
    }

    let selectedStore = null;

    for (const store of stores) {
      let isEligibleStore = true;
      for (const item of items) {
        const { skuId, quantity } = item;
        const inventory = await Inventory.findOne({
          StoreId: store._id,
          SkuId: skuId,
        });

        if (!inventory || inventory.quantity < quantity) {
          isEligibleStore = false;
          break;
        }

        if (isEligibleStore) {
          selectedStore = store;
          break;
        }

        if (!selectedStore) {
          return resp.status(400).json({
            message: "No store has sufficient inventory for all items",
          });
        }
      }
    }

    resp.status(200).json({
      storeId: selectedStore._id,
      storeName: selectedStore.name,
      allocationType: "FULL",
      strategy: "PINCODE_PRIORITY_WITH_FALLBACK",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Internal server error" });
  }
};
