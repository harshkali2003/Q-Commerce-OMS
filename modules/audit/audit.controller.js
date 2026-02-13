const Audit = require("./audit.schema");

exports.getAudit = async (req, resp) => {
  try {
    const { entityType, entityId, action, performedBy, startDate, endDate } =
      req.query;

    const filter = {};

    if (entityType) filter.entityType = entityType;
    if (entityId) filter.entityId = entityId;
    if (action) filter.action = action;
    if (performedBy) filter.performedBy = performedBy;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const data = await Audit.find(filter).sort({ createdAt: -1 }).limit(100);
    if (data.length === 0) {
      return resp.status(404).json({ message: "No Audit record found" });
    }

    resp.status(200).json({ data });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};
