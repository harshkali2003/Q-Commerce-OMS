const Audit = require("../modules/audit/audit.schema");

exports.recordAudit = async ({
  action,
  entityType,
  entityId,
  performedBy,
  performedById,
  oldValue,
  newValue,
  reason,
  ipAddress,
  requestId,
}) => {
  try {
    await Audit.create({
      action,
      entityType,
      entityId,
      performedBy,
      performedById,
      oldValue,
      newValue,
      reason,
      ipAddress,
      requestId,
    });
  } catch (err) {
    console.error("Audit logging failed:", error.message);
  }
};
