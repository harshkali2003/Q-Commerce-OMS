const slotBookingSchema = require("../modules/delivery/deliverySlot.schema");

exports.SlotBooking = async (req, resp) => {
  try {
    const { slotId } = req.body;

    const slot = await slotBookingSchema.findOne({ slotId, isActive: true });

    if (!slot) {
      return resp.status(404).json({
        message: "Slot not found or inactive",
      });
    }

    if (new Date() > slot.cutoff_time) {
      throw new Error("Booking not allowed after cutoff time");
    }

    const updatedSlot = await slotBookingSchema.findOneAndUpdate(
      { _id: slotId, availableCapacity: { $gt: 0 } },
      { $inc: { availableCapacity: -1 } },
      { new: true },
    );

    if (!updatedSlot) {
      return resp.status(404).json({ message: "Slot full / unavailable" });
    }

    resp.status(200).json({ message: "Slot booked", updatedSlot });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Internal server error" });
  }
};
