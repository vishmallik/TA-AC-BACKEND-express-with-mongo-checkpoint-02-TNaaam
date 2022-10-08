const express = require("express");
const Event = require("../models/event");
const Remark = require("../models/remark");
const router = express.Router();

//deleting a remark
router.get("/:remarkId/delete", (req, res, next) => {
  Remark.findByIdAndDelete(req.params.remarkId, (err, deletedRemark) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      deletedRemark.eventId,
      { $pull: { remarks: deletedRemark._id } },
      (err, event) => {
        if (err) return next(err);
        res.redirect("/events/" + event._id);
      }
    );
  });
});

//like a remark
router.get("/:remarkId/like", (req, res, next) => {
  Remark.findByIdAndUpdate(
    req.params.remarkId,
    { $inc: { likes: 1 } },
    (err, remark) => {
      if (err) return next(err);
      res.redirect("/events/" + remark.eventId);
    }
  );
});

//dislike a remark
router.get("/:remarkId/dislike", (req, res, next) => {
  Remark.findByIdAndUpdate(
    req.params.remarkId,
    { $inc: { likes: -1 } },
    (err, remark) => {
      if (err) return next(err);
      res.redirect("/events/" + remark.eventId);
    }
  );
});

//get edit remark form
router.get("/:remarkId", (req, res, next) => {
  Remark.findById(req.params.remarkId, (err, remark) => {
    if (err) return next(err);
    res.render("editRemark", { remark });
  });
});

//posting edited remark
router.post("/:remarkId", (req, res, next) => {
  Remark.findByIdAndUpdate(req.params.remarkId, req.body, (err, remark) => {
    if (err) return next(err);
    res.redirect("/events/" + remark.eventId);
  });
});

module.exports = router;
