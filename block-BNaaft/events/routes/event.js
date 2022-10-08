const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Remark = require("../models/remark");
const moment = require("moment");

//event add form
router.get("/add", function (req, res, next) {
  res.render("addEvent");
});

//saving a event in db
router.post("/", (req, res, next) => {
  req.body.category = req.body.category
    .trim()
    .split(",")
    .reduce((acc, elm) => {
      acc.push(elm.trim());
      return acc;
    }, []);

  req.body.start_date = moment(req.body.start_date).format("YYYY-MM-DD");
  req.body.end_date = moment(req.body.end_date).format("YYYY-MM-DD");

  Event.create(req.body, (err, event) => {
    if (err) return next(err);
    res.redirect("/events");
  });
});

//listing all events
router.get("/", (req, res, next) => {
  Event.find({}, (err, eventsList) => {
    if (err) return next(err);
    let categoryArr = [],
      locationArr = [];
    eventsList.forEach((event) => {
      locationArr.push(event.location);
      event.category.forEach((category) => {
        categoryArr.push(category);
      });
    });

    res.render("eventList", {
      eventsList,
      uniqueCategory: res.locals.lodash.uniq(categoryArr),
      locationArr,
    });
  });
});

//get edit form
router.get("/:eventId/edit", (req, res, next) => {
  Event.findById(req.params.eventId, (err, event) => {
    if (err) return next(err);
    let start_date = moment(event.start_date).format("YYYY-MM-DD");
    let end_date = moment(event.end_date).format("YYYY-MM-DD");
    res.render("editEvent", { event, start_date, end_date });
  });
});

//post a remark
router.post("/:eventId/remark", (req, res, next) => {
  req.body.eventId = req.params.eventId;
  Remark.create(req.body, (err, remark) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      req.params.eventId,
      { $push: { remarks: remark._id } },
      (err, event) => {
        if (err) return next(err);
        res.redirect("/events/" + req.params.eventId);
      }
    );
  });
});

//deleting a event
router.get("/:eventId/delete", (req, res, next) => {
  Event.findByIdAndDelete(req.params.eventId, (err, deletedEvent) => {
    if (err) return next(err);
    Remark.deleteMany({ eventId: req.params.eventId }, (err, success) => {
      if (err) return next(err);
      res.redirect("/events");
    });
  });
});

//like a event
router.get("/:eventId/like", (req, res, next) => {
  Event.findByIdAndUpdate(
    req.params.eventId,
    { $inc: { likes: 1 } },
    (err, event) => {
      if (err) return next(err);
      res.redirect("/events/" + req.params.eventId);
    }
  );
});

//dislike a event
router.get("/:eventId/dislike", (req, res, next) => {
  Event.findByIdAndUpdate(
    req.params.eventId,
    { $inc: { likes: -1 } },
    (err, event) => {
      if (err) return next(err);
      res.redirect("/events/" + req.params.eventId);
    }
  );
});

//filter events by category
router.get("/category/:category", (req, res, next) => {
  Event.find({ category: req.params.category }, (err, eventsList) => {
    if (err) return next(err);

    //to display all categories irrespective of current category
    Event.find({}, (err, allEvents) => {
      if (err) return next(err);
      let categoryArr = [],
        locationArr = [];

      allEvents.forEach((event) => {
        locationArr.push(event.location);
        event.category.forEach((category) => {
          categoryArr.push(category);
        });
      });
      res.render("eventList", {
        eventsList,
        uniqueCategory: res.locals.lodash.uniq(categoryArr),
        locationArr,
      });
    });
  });
});

//filter events by location
router.get("/location/:location", (req, res, next) => {
  Event.find({ location: req.params.location }, (err, eventsList) => {
    if (err) return next(err);

    //to display all categories irrespective of current location
    Event.find({}, (err, allEvents) => {
      if (err) return next(err);
      let categoryArr = [],
        locationArr = [];

      allEvents.forEach((event) => {
        locationArr.push(event.location);
        event.category.forEach((category) => {
          categoryArr.push(category);
        });
      });
      res.render("eventList", {
        eventsList,
        uniqueCategory: res.locals.lodash.uniq(categoryArr),
        locationArr,
      });
    });
  });
});

//filter by latest date
router.get("/latest", (req, res, next) => {
  Event.find({})
    .sort({ start_date: 1 })
    .exec((err, eventsList) => {
      if (err) return next(err);
      let categoryArr = [],
        locationArr = [];
      eventsList.forEach((event) => {
        locationArr.push(event.location);
        event.category.forEach((category) => {
          categoryArr.push(category);
        });
      });
      res.render("eventList", {
        eventsList,
        uniqueCategory: res.locals.lodash.uniq(categoryArr),
        locationArr,
      });
    });
});

//filter by oldest date
router.get("/oldest", (req, res, next) => {
  Event.find({})
    .sort({ start_date: -1 })
    .exec((err, eventsList) => {
      if (err) return next(err);
      let categoryArr = [],
        locationArr = [];
      eventsList.forEach((event) => {
        locationArr.push(event.location);
        event.category.forEach((category) => {
          categoryArr.push(category);
        });
      });
      res.render("eventList", {
        eventsList,
        uniqueCategory: res.locals.lodash.uniq(categoryArr),
        locationArr,
      });
    });
});

//getting a single event with populating remarks
router.get("/:eventId", (req, res, next) => {
  Event.findById(req.params.eventId)
    .populate("remarks")
    .exec((err, event) => {
      if (err) return next(err);
      res.render("singleEvent", { event });
    });
});
module.exports = router;

//submit edit event
router.post("/:eventId", (req, res, next) => {
  req.body.category = req.body.category
    .trim()
    .split(",")
    .reduce((acc, elm) => {
      acc.push(elm.trim());
      return acc;
    }, []);
  Event.findByIdAndUpdate(req.params.eventId, req.body, (err, event) => {
    if (err) return next(err);
    res.redirect("/events/" + req.params.eventId);
  });
});
