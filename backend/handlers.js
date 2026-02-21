

const handlers = {};


handlers.login = async function loginHandler(req, res) {
  try {

    return res.json({ ok: true, token: "token-placeholder", user: { id: 1, name: "Demo" } });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.bookAppointment = async function bookAppointment(req, res) {
  try {

    return res.json({ ok: true, id:  123 });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.cancelAppointment = async function cancelAppointment(req, res) {
  try {
    const id = Number(req.params.id);
    return res.json({ ok: true, changed:  1 });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.sendNotification = async function sendNotification(req, res) {
  try {
    const { appointment_id, user_id, email, message, method } = req.body;
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.getDailyAppointments = async function getDailyAppointments(req, res) {
  try {

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.getWeeklyAppointments = async function getWeeklyAppointments(req, res) {
  try {
    const start = req.query.start; // YYYY-MM-DD
    const providerId = req.query.provider_id;

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.getUpcomingAppointments = async function getUpcomingAppointments(req, res) {
  try {
    const patientEmail = req.query.patient_email;
    const limit = Number(req.query.limit || 50);

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.getPastAppointments = async function getPastAppointments(req, res) {
  try {
    const patientEmail = req.query.patient_email;
    const limit = Number(req.query.limit || 50);

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.getNotifications = async function getNotifications(req, res) {
  try {
    const userId = req.query.user_id;
    const patientEmail = req.query.patient_email;

    return res.json([]);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};


handlers.markNotificationRead = async function markNotificationRead(req, res) {
  try {
    const id = Number(req.params.id);

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
};

export default handlers;
