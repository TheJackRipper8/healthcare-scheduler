// Import firestore and admin rights for backend
import { db } from "./firebaseAdmin.js";
import admin from "firebase-admin";

// Get authentication from admin
// Verifies Firebase ID tokens (backend authentication)
const auth = admin.auth();
// The handlers (route functions)
const handlers = {};

// Grabs authentication token
// Authenticates a requst
async function requireAuth(req) 
{
  // Checks the Authorization header
  const header = req.headers.authorization || "";
  // Checks if it has a Bearer token and extracts it
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  // If no tokenn, reject
  if (!token) 
    throw new Error("Missing Bearer token");
  // Verify token by decrypting with firebase admin
  const decoded = await auth.verifyIdToken(token);
  // Return user's identity (UID & email)
  return { uid: decoded.uid, email: decoded.email || "" };
}

// Gets user's document from Firestore
async function getUserDoc(uid) 
{
  // Using the UID, fetches the user's document from Firestore
  const doc = await db.collection("users").doc(uid).get();
  // If no document exists, the profile does not exist
  if (!doc.exists) 
    throw new Error("User profile not found");
  // Returns the document's ID and data
  return { id: doc.id, ...doc.data() };
}

// Handler called for authentication, getting email, name, password
// /api/me
handlers.me = async function me(req, res) {
  // Get the user's authentication data
  const user = await requireAuth(req);
  // Get the user's profile
  const profile = await getUserDoc(user.uid);
  // Format all the above data into a JSON request
  // Status, email, id, name, and role
  return res.json({
    ok: true,
    user: {
      id: user.uid,
      email: profile.email || user.email || "",
      name: profile.name || `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
      role: profile.role || "",
    },
  });
};



// StaffProfilePage
// Used by staff and displays basic profile information of staff member
handlers.getStaffProfileBasic = async function getStaffProfileBasic(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);
    // Get staff document from collection via ID
    const doc = await db.collection("users").doc(user.uid).get();
    // Get staff profile data
    const prof = doc.data();
    if (!doc.exists) 
      return res.status(404).json({ ok: false, error: "Staff profile not found" });
    if (prof.role !== "staff") 
      return res.status(403).json({ ok: false, error: "Forbidden" });
    // Return it
    return res.json({ 
      ok: true,
      // Format staff based on
      // id
      // name
      // age
      // gender
      // role
      staff: {
        id: prof.id,
        firstName: prof.firstName || "",
        lastName: prof.lastName || "",
        age: prof.age || "",
        gender: prof.gender || "",
        role: prof.role || "staff"
      }
    });
  } 
  catch (err) 
  {
    // any errors in try
    return res.status(401).json({ ok: false, error: String(err.message || err) });
  }
};



// Displays basic information of provider
// Provider profile
handlers.getProviderProfileBasic = async function getProviderProfileBasic(req, res) 
{
  try 
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Grab users document from collection based on uid
    const doc = await db.collection("users").doc(user.uid).get();
    // if document does not exist, send json error of not finding provider
    if (!doc.exists)
      return res.status(404).json({
        ok: false,
        error: "Provider profile not found"
      });

    // Convert data document data
    const data = doc.data();
    // If data is not provider, send error of forbidden
    if (data.role !== "provider")
      return res.status(403).json({
        ok: false,
        error: "Forbidden"
      });
    // Format json response of OK
    // and provider details
    // id
    // name
    // age
    // gender
    // role
    return res.json({
      ok: true,
      provider: {
        id: data.id,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        age: data.age || "",
        gender: data.gender || "",
        role: data.role || ""
      }
    });
  } 
  catch (err) 
  {
    // Any errors in try
    return res.status(500).json({
      ok: false,
      error: String(err.message || err)
    });
  }
};


// PatientProfile
// Displays basic profile information of patient
handlers.displayPatientInformation = async function displayPatientInformation(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);

    // Get a user's document from the users collection with users id
    const doc = await db.collection("users").doc(user.uid).get();
    // If document does not exist, send JSON error
    if (!doc.exists) 
      return res.status(404).json({ ok: false, error: "User profile not found" });

    // Extract data from document
    const userInfo = doc.data();
    // Return JSON of patient's info
    return res.json({
      ok: true,
      // format patienet as
      // id
      // name
      // age
      // gender
      // birthday
      // preferred clinic
      // preferred provider
      // insurance plan
      // and role
      patient: {
        id: userInfo.id,
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        age: userInfo.age || "",
        gender: userInfo.gender || "",
        birthday: userInfo.birthday || "",
        preferredClinic: userInfo.preferredClinic || "",
        preferredProvider: userInfo.preferredProvider || "",
        insurancePlan: userInfo.insurancePlan || "",
        role: userInfo.role || "patient"
      }
    });
  } 
  catch (err) 
  {
    // any errors in try
    return res.status(401).json({ ok: false, error: String(err.message || err) });
  }
};

// Update patient preferences
// Update insurance, preferred clinic, preferred provider
handlers.updatePatientPreferences = async function updatePatientPreferences(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);

    // Get preferences (clinic, provider, and insurance) from form
    // request body
    const {
      preferredClinic,
      preferredProvider,
      insurancePlan
    } = req.body;

    // Update existing document in users collection given a user id
    // Update pereferences of clinic, provider, and insurance
    await db.collection("users").doc(user.uid).update({
      preferredClinic: preferredClinic ?? "",
      preferredProvider: preferredProvider ?? "",
      insurancePlan: insurancePlan ?? ""
    });
    // Return JSOn response of OK (preferences changed)
    return res.json({ ok: true });
  } 
  catch (err) 
  {
    // Display any error in try
    return res.status(401).json({ ok: false, error: String(err.message || err) });
  }
};

// ProviderSearchPage
// Responsible for searching providers based on queries
// used by patient only
handlers.searchProviders = async function searchProviders(req, res) 
{
  try 
  {
    // Wait for authentication by firebase
    await requireAuth(req);

    // Get the insurance, clinic, and specialization queries from form
    const insuranceType = (req.query.insuranceType || "").trim();
    const clinic = (req.query.clinic || "").trim();
    const specialist = (req.query.specialist || "").trim();

    let providersQuery = db.collection("providers");

    if (specialist) 
      providersQuery = providersQuery.where("specialization", "==", specialist);

    let clinicId = "";

    if (clinic) 
    {
      const clinicSnap = await db
        .collection("clinics")
        .where("name", "==", clinic)
        .limit(1)
        .get();

      if (!clinicSnap.empty) 
        clinicId = clinicSnap.docs[0].data().clinicId;
      else
        return res.json({ ok: true, providers: [] });
    }

    if (clinicId) 
      providersQuery = providersQuery.where("clinicIds", "array-contains", clinicId);
    // Get a limited number of providers
    const limit = await providersQuery.limit(25).get();

    // Create query results based into an array
    // based on id, name, spescialization, gender, age, clinic names, and insurances accepted
    // Join users and providers
    const joined = await Promise.all(
      // For each provider doc
      limit.docs.map(async (providerDoc) => 
      {
        //  For each provider document, search for the user document in users by id
        const providerData = providerDoc.data();
        // Get the user with the matching id
        const userSnap = await db
          .collection("users")
          .where("id", "==", providerData.id)
          .limit(1)
          .get();

        if (userSnap.empty)
          return null;
        const userDoc = userSnap.docs[0];

        // If document does not exist, exit
        if (!userDoc.exists) 
          return null;
        // Otherwise, extract the data
        const userData = userDoc.data();
        // Check it is the provider
        if (userData.role !== "provider") 
          return null;
        // Check it includes the insurance type if insurance type query was inputed
          let matchedClinics = [];

          if (providerData.clinicIds && providerData.clinicIds.length > 0) 
          {
            // Find all cliinics where clinicId matches a clinic id of a provider
            const clinicSnap = await Promise.all(
              // for each clinic id in the array contained in provider
              providerData.clinicIds.map((cid) =>
                db.collection("clinics").where("clinicId", "==", cid).limit(1).get()
              )
            );
            // Convert the documents into an array
            // For each snap, determine if it not empty, if not, than grab the first document, and the data
            const clinics = clinicSnap.filter((snap) => !snap.empty).map((snap) => snap.docs[0].data());

            if (insuranceType && !clinics.some((c) => (c.insurancesAccepted || []).includes(insuranceType))) 
              return null;
            // Store names of clinics
            // for each clinic doc c
            matchedClinics = clinics.map((c) => ({
              clinicId: c.clinicId || "",
              name: c.name || "",
              address: c.address || "",
              hours: c.hours || ""
            }));
          }
        return {
          id: providerData.id,
          providerUserId: providerData.id || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          specialization: providerData.specialization || "",
          gender: userData.gender || "",
          age: userData.age || "",
          insurancesAccepted: userData.insurancesAccepted || [],
          clinicIds: providerData.clinicIds || [],
          // Map out all clinicNames by name
          clinicNames: matchedClinics.map((c) => c.name),
          clinics: matchedClinics,
          hours: providerData.hours || ""
        };
      })
    );
    // Get only results where all elements have valid key and value pairs
    const results = joined.filter(Boolean);
    // JSON response of OK + results
    return res.json({ ok: true, providers: results });
  } 
  catch (err) 
  {
    // Any errors in try
    return res.status(400).json({ ok: false, error: String(err.message || err) });
  }
};


// BookCalendarAppointmentPage && BookAppointment Page

// Handler called when endpoint is called in index.js for book appointments
// Responsible for booking appointments by staff or patients
// Used by BookAppointmentPage and BookCalendarAppointmentPage
handlers.bookAppointment = async function bookAppointment(req, res) 
{
  try 
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Fetch document
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User profile not found" });
    // Get user data from docoument
    const userData = userDoc.data();

    // Converts time into minutes
    function parseTimeToMinutes(value)
    {
      // Determine if HH::MM format
      const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      // if not, return nothing
      if (!match)
        return null;
      // extract hour
      let hour = Number(match[1]);
      // extract minutes
      const minute = Number(match[2]);
      // extract AM or PM
      const meridiem = match[3].toUpperCase();
      // if 12, reset to zero
      if (hour === 12)
        hour = 0;
      // if pm, add + 12
      if (meridiem === "PM")
        hour += 12;
      // return minutes
      return hour * 60 + minute;
    }

    function parseHoursRange(value)
    {
      // Split up value into various parts
      // for each split part s
      const parts = String(value || "").split("-").map((s) => s.trim());
      // if not two parts (hours and minutes), return null
      if (parts.length !== 2)
        return null;
      // calculate start and end minutes
      const startMinutes = parseTimeToMinutes(parts[0]);
      const endMinutes = parseTimeToMinutes(parts[1]);

      if (startMinutes === null || endMinutes === null)
        return null;
      // return
      return {
        startMinutes,
        endMinutes
      };
    }
    // Create book appointment information from form request
    // Name, email, provider and id, appointment type, date, time, clinic and id

    const {
      patientId,
      patientName,
      email,
      providerName,
      providerId,
      appointmentType,
      date,
      time,
      clinic,
      clinicId
    } = req.body;


    // Send error if form missing information from form
    if (!appointmentType || !date || !time || (!clinic && !clinicId) || (!providerName && !providerId))
      return res.status(400).json({ ok: false, error: "Missing required fields" });

    // Create a date based on the form information
    const start = new Date(`${date}T${time}:00`);
     const end = new Date(start.getTime() + 30 * 60 * 1000);
    // If date not invalid, send error
    if (isNaN(start.getTime())) 
      // Send a JSON error if date is invalid
      return res.status(400).json({ ok: false, error: "Invalid date/time" });

    // Determine if logged in role is patient or staff
    let actualPatientId = "";
    if (userData.role === "patient")
      actualPatientId = userData.id;
    else if (userData.role === "staff")
      actualPatientId = patientId || "";

    let actualProviderId = providerId || "";
    let actualProviderName = providerName || "";

    if (!actualProviderId && providerName)
    {
      const providerSnap = await db
        .collection("users")
        .where("role", "==", "provider")
        .where("firstName", "==", providerName.split(" ")[0] || "")
        .limit(1)
        .get();

      if (!providerSnap.empty)
      {
        const p = providerSnap.docs[0].data();
        actualProviderId = p.id || "";
        actualProviderName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
      }
    }

    let actualClinicId = clinicId || "";
    let actualClinicName = clinic || "";
      let clinicData = null;
    let providerData = null;
    // ClinicID does not exist, try to query by name
    if (!actualClinicId && clinic)
    {
      // Query clinic for clinic by name
      const clinicSnap = await db
        .collection("clinics")
        .where("name", "==", clinic)
        .limit(1)
        .get();
      // if query not empty, extract id and name of clinic
      if (!clinicSnap.empty)
      {
        clinicData = clinicSnap.docs[0].data();
        actualClinicId = clinicData.clinicId || "";
        actualClinicName = clinicData.name || clinic;
      }
    }
    // if only clinic id, query cliincs colletion
    else if (actualClinicId)
    {
      const clinicSnap = await db
        .collection("clinics")
        .where("clinicId", "==", Number(actualClinicId))
        .limit(1)
        .get();
      // get clinic name
      if (!clinicSnap.empty)
      {
        clinicData = clinicSnap.docs[0].data();
        actualClinicName = clinicData.name || actualClinicName;
      }
    }
    // Query providesr by provider id
    const providerRecordSnap = await db
      .collection("providers")
      .where("id", "==", String(actualProviderId))
      .limit(1)
      .get();
    // If providery query, not empty, get data
    if (!providerRecordSnap.empty)
      providerData = providerRecordSnap.docs[0].data();    

    // Error handling
    if (!actualPatientId)
      return res.status(400).json({ ok: false, error: "Missing patientId" });
    // Error handling
    if (!actualProviderId)
      return res.status(400).json({ ok: false, error: "Missing providerId" });

    // Get appointment's hours and minutes
    const [bookingHourStr, bookingMinuteStr] = String(time).split(":");
    // Conver them into numbers
    const bookingMinutes = Number(bookingHourStr) * 60 + Number(bookingMinuteStr);
    const bookingEndMinutes = bookingMinutes + 30;
    // if clinci exists and has hours
    if (clinicData && clinicData.hours)
    {
      // Parse the hours of the clinics
      const clinicHours = parseHoursRange(clinicData.hours);
      // Determine if appointment hour is in clinic hours, if not, send error
      

      if (clinicHours && (bookingMinutes < clinicHours.startMinutes || bookingEndMinutes > clinicHours.endMinutes))
        return res.status(400).json({ ok: false, error: "Appointment time is outside clinic hours" });
    }
    // determine if provider exists and has hours
    if (providerData && providerData.hours)
    {
      // Parse provider hours
      const providerHours = parseHoursRange(providerData.hours);
      // Determine if appointment is in provider hours
      if (providerHours && (bookingMinutes < providerHours.startMinutes || bookingEndMinutes > providerHours.endMinutes))
        return res.status(400).json({ ok: false, error: "Appointment time is outside provider hours" });
    }

    const startTs = admin.firestore.Timestamp.fromDate(start);
    const endTs = admin.firestore.Timestamp.fromDate(end);

    // Conflict: same provider already booked at same time
    const providerConflictSnap = await db
      .collection("appointments")
      .where("providerId", "==", actualProviderId)
      .where("date", "==", date)
      .where("status", "==", "scheduled")
      .get();

    // For each from provider conflict query
    const providerConflict = providerConflictSnap.docs.some((doc) =>
    {
      // Get data
      const data = doc.data();
      // Get start date
      const existingStart = data.start?.toDate ? data.start.toDate() : null;
      if (!existingStart)
        return false;
      // Create end of appointment block
      const existingEnd = new Date(existingStart.getTime() + 30 * 60 * 1000);
      // If start before existing end and end after existing start, return true
      return start < existingEnd && end > existingStart;
    });

    if (providerConflict)
      return res.status(409).json({ ok: false, error: "This provider already has an appointment in that time block" });

    // Conflict: same patient already booked at same time
    const patientConflictSnap = await db
      .collection("appointments")
      .where("patientId", "==", actualPatientId)
      .where("date", "==", date)
      .where("status", "==", "scheduled")
      .get();
    // For each doc from patient conflict query
    const patientConflict = patientConflictSnap.docs.some((doc) =>
    {
      // Get the data
      const data = doc.data();
      // Create existing start, if it does not exist, return false
      const existingStart = data.start?.toDate ? data.start.toDate() : null;
      if (!existingStart)
        return false;
      // Create existing end (end of appointment block of half an hour)
      const existingEnd = new Date(existingStart.getTime() + 30 * 60 * 1000);
      // Return true if start  less than block end time and end greater than start block time
      return start < existingEnd && end > existingStart;
    });

    if (patientConflict)
      return res.status(409).json({
        ok: false,
        error: "This patient already has an appointment in that time block"
      });
    // Create a document reference for firebase to add
    // Add to appointments collection with document with the form fields and values
    const docRef = await db.collection("appointments").add({
      patientId: actualPatientId,
      bookedByID: userData.id,
      bookedByUID: user.uid,
      bookedByRole: userData.role,
      patientEmail: user.email || email || "",
      patientFirstName: (patientName || "").trim().split(/\s+/).slice(0, 1).join(""),
      patientLastName: (patientName || "").trim().split(/\s+/).slice(1).join(" "),
      patientName: patientName,
      providerId: actualProviderId,
      providerName: actualProviderName,
      clinicId: actualClinicId,
      clinicName: actualClinicName,
      appointmentType,
      date,
      time,
      start: startTs,
      end: endTs,
      status: "scheduled",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // If current user is staff, send a notification to provider
    // for booked appointment for provider
    if (userData.role === "staff")
    {
      await db.collection("notifications").add({
        endUserId: String(actualProviderId),
        fromUserId: user.uid,
        appointmentId: docRef.id,
        notificationType: "Booked Appointment",
        patientName: patientName || "",
        providerName: actualProviderName,
        clinicName: actualClinicName,
        appointmentType,
        date,
        time,
        message: `Appointment booked for ${patientName || "patient"}`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }    

    // Return JSON response of successfully booking an appointment
    return res.json({ 
      ok: true, 
      id: docRef.id,
      message: "Appointment booked!" 
    });
  } 
  catch (err) 
  {
    // Send error if error in using the form
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// BookCalendarAppointmentPage
// Returns the list of appointments on a day when booking an appointment
handlers.getBookCalendarAppointmentPage = async function getBookCalendarAppointmentPage(req, res) 
{
  try 
  {
    // Get authentication token
    const user = await requireAuth(req);
    // Fetch the user document from users collection
    const userDoc = await db.collection("users").doc(user.uid).get();
    // If doucment does not exist, send error
    if (!userDoc.exists) 
      return res.status(404).json({ ok: false, error: "User not found" });
    // Extract role from document
    const role = userDoc.data().role || "";
    // If role is not patient or staff, send error
    if (role !== "patient" && role !== "staff") 
      return res.status(403).json({ ok: false, error: "Forbidden" });
    // Get date from query
    const { date } = req.query;
    // If date not invalid, send error
    if (!date)
      return res.status(400).json({ ok: false, error: "Missing date" });
    
    // Create start of the day and end of the day
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);
    // Check they are valid dates
    if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime()))
      return res.status(400).json({ ok: false, error: "Invalid date" });
  
    // From appointments collection, get all appointments between
    // startOfDay and endOfDay that are scheduled
    const appointments_of_day = await db
      .collection("appointments")
      .where("date", "==", date)
      .where("status", "==", "scheduled")
      .get();

    // Map appointments of the dya into an area alongside dodcument data
    // Return appointments
    // for each appointment document doc, get the data
    const appointments = appointments_of_day.docs.map((doc) => {
      const data = doc.data();
      // Format the fields for the array
      return {
        id: doc.id,
        provider_name: data.providerName || "",
        appointment_type: data.appointmentType || "",
        date: data.date || date,
        time: data.time || "",
        clinic: data.clinicName
      };
    });

    // Return appointments and OK 
    return res.json({
      ok: true,
      appointments
    });
  } 
  catch (err) 
  {
    // Send error for failures in try
    return res.status(500).json({
      ok: false,
      error: String(err.message || err)
    });
  }
};





// CancelAppointmentPage
// Handler called when endpoint is called in index.js when canceling appointments
// Responisble for canceling appointments by staff or patients
handlers.cancelAppointment = async function cancelAppointment(req, res) 
{
  try
  {
    // Get user information from authentication token
    const user = await requireAuth(req);
    // Get appointment ID
    const id = String(req.body.appointmentId || "");
    // Error handling, if id doesn't exist, send error
    if (!id) 
      return res.status(400).json({ ok: false, error: "Missing appointment id" });

    // Get document reference from firebase based on id
    // Use reference to get the document
    const ref = db.collection("appointments").doc(id);
    // Fetch document using reference based on id
    const doc = await ref.get();

    // If document does not exist, send JSON error, no appointment found
    if (!doc.exists) 
      return res.status(404).json({ ok: false, error: "Appointment not found" });

    // Get document data from doc
    const info = doc.data();
    // User doc
    const userDoc = await db.collection("users").doc(user.uid).get();
    // Check if user doc exists
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User profile not found" });
    // Convert doc into data
    const userData = userDoc.data();
    // get id of current member
    const memberId = String(userData.id || "");
    // Check if patient id of document matches current user
    if (info.patientId !== memberId)
      return res.status(403).json({ ok: false, error: "Not allowed" });

    // If not scheduled, send error 
    if (info.status !== "scheduled")
      return res.status(400).json({ ok: false, error: "Appointment not cancellable" });
    const clinicSnap = await db
      .collection("clinics")
      .where("clinicId", "==", Number(info.clinicId))
      .limit(1)
      .get();
    // Determine if query not empty
    if (!clinicSnap.empty)
    {
      // Get clinic data and cancellation policy days
      const clinicData = clinicSnap.docs[0].data();
      // Get cancellation policy in days
      const cancellationPolicyDays = Number(clinicData.cancellationPolicy);
      // if policy days not number
      if (!Number.isNaN(cancellationPolicyDays))
      {
        // Get start of appointment day
        const appointmentStart = info.start?.toDate ? info.start.toDate() : null;
        // if appointment day exists
        if (appointmentStart)
        {
          // Get today dday
          const now = new Date();
          // Get the difference between two and start of appointment
          const diffMs = appointmentStart.getTime() - now.getTime();
          // calculate the differnce of days
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          // If difference of days less than current policy, send error
          if (diffDays < cancellationPolicyDays)
            return res.status(400).json({
              ok: false,
              error: `Appointments must be cancelled at least ${cancellationPolicyDays} day(s) in advance`
            });
        }
      }
    }
    // Using reference, update the current document's appointment status as "canceeled"
    // Update in firebase by status
    await ref.update({
      status: "cancelled",
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      cancelledBy: user.uid,
    });

    // Send notification to provider by staff an appointment has been cancelled
    await db.collection("notifications").add({
      endUserId: String(info.providerId || ""),
      fromUserId: user.uid,
      appointmentId: id,
      notificationType: "Appointment Cancellation",
      patientName: info.patientName || "",
      providerName: info.providerName || "",
      clinicName: info.clinicName || "",
      appointmentType: info.appointmentType || "",
      date: info.date || "",
      time: info.time || "",
      message: `Appointment cancelled for ${info.patientName || "patient"}`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  
    // OK, cancelled appointment
    return res.json({ ok: true, changed: 1 });
  } 
  catch (err) 
  {
    // Errors in try
    return res.status(401).json({ ok: false, error: String(err.message || err) });
  }
};

// CancelAppointmentPage
// Returns a list of appointments (all)
handlers.getCancelAppointments = async function getCancelAppointments(req, res) 
{
  try 
  {
    // Grab user authentication token
    const user = await requireAuth(req);
    // Get doc by UID
    const userDoc = await db.collection("users").doc(user.uid).get();
    // if doc does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User not found by uid doc id" });
    // Convert doc into data
    const userData = userDoc.data();
    // if role not patient, send error
    if (userData.role !== "patient" && userData.role != "staff")
      return res.status(403).json({ ok: false, error: "Forbidden" });
    // get member id
    const memberId = String(userData.id || "");
    // query 
    let snap;
    // if patient
    if (userData.role === "patient")
    {
      // query appointments for given patient id
      snap = await db
        .collection("appointments")
        .where("status", "==", "scheduled")
        .where("patientId", "==", memberId)
        .get();
    }
    else
    {
      // if staff, query appointments, query staff by member
      const staffSnap = await db
        .collection("staff")
        .where("id", "==", memberId)
        .limit(1)
        .get();
      // if staff query empty, send error
      if (staffSnap.empty)
        return res.status(404).json({ ok: false, error: "Staff record not found" });
      // take staff data and clinic id they work at
      const staffData = staffSnap.docs[0].data();
      const staffClinicId = staffData.clinicId;
      // query all appointments that belong to a specific clinic
      snap = await db
        .collection("appointments")
        .where("status", "==", "scheduled")
        .where("clinicId", "==", staffClinicId)
        .get();
    }
    // map appointments from snap 
    const appointments = snap.docs
      .map((doc) => {
        const data = doc.data();
        // Return appointments as
        // id
        // patientId
        // provider name
        // appointment type
        // date
        // time
        // clinic
        return {
          id: doc.id,
          patientId: String(data.patientId || ""),
          provider_name: data.providerName || "",
          appointment_type: data.appointmentType || "",
          date: data.date || "",
          time: data.time || "",
          clinic: data.clinicName || "",
          patientName: data.patientName || ""
        };
      })
      // Filter only appointments that have patient id
      // For each patient a, check if its id === patientId
      // if so, map each patient id to rest. Rest is the rest of 
      // the patient's document, rest of the data for crafting appointments
      .map(({ patientId, ...rest }) => rest);

    // Return OK and apointments
    return res.json({
      ok: true,
      appointments
    });
  } 
  catch (err) 
  {
    // Return error
    return res.status(500).json({ok: false, error: String(err.message || err)});
  }
};
// Used by CancelCalendarAppointmentPage
// Displays appointments
// cancels appointments of that day
handlers.getCancelCalendarAppointments = async function getCancelCalendarAppointments(req, res) 
{
  try 
  {
    // Get authentication token of user
    const user = await requireAuth(req);
    // Fetch the user's document from users collection by uid
    const userDoc = await db.collection("users").doc(user.uid).get();
    // If document does not exist, send error that user not found
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User not found" });
    // Extract role from document
    const role = userDoc.data().role || "";
    // If role neither patient, or staff, send error of forbidden
    if (role !== "patient" && role !== "staff")
      return res.status(403).json({ ok: false, error: "Forbidden" });
    // Extract date from query
    const { date } = req.query;
    // if date not valid, send JSON error
    if (!date)
      return res.status(400).json({ ok: false, error: "Missing date" });
    
    // Create two times: beginning and end of day based on date
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);
    // If the two times are not valid, send json error
    if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) 
      return res.status(400).json({ ok: false, error: "Invalid date" });
    
    // Get a query of all appointments between startOfDay and endOfDay where scheduled
    let query = db
      .collection("appointments")
      .where("date", "==", date)
      .where("status", "==", "scheduled");
    // if patient, get a ll appointments where patientId equals id
    if (role === "patient")
    {
      query = query.where("patientId", "==", userDoc.data().id);
    }
    // if staff
    else if (role === "staff")
    {
      // get the staff data from doc
      const staffId = String(userDoc.data().id || "");
      // query all staff members from staff collection that equal to staffId
      const staffSnap = await db
        .collection("staff")
        .where("id", "==", staffId)
        .limit(1)
        .get();
      // if query empty, send error
      if (staffSnap.empty)
        return res.status(404).json({ ok: false, error: "Staff record not found" });
      // with staff data, get the clinci id
      const staffData = staffSnap.docs[0].data();
      const staffClinicId = staffData.clinicId;
      // modify query to search for clinci id
      query = query.where("clinicId", "==", staffClinicId);
    }

    // Get appointments via the query
    const appointments_of_day = await query.get();
    // Convert into array through mapping, formatting data into
    // id, provider name, appointment type, date, time, and clinic
    // For each appointment document doc
    const appointments = appointments_of_day.docs.map((doc) => {
      // Get data and format fields for array appointments
      const data = doc.data();
      return {
        id: doc.id,
        provider_name: data.providerName || "",
        appointment_type: data.appointmentType || "",
        date: data.date,
        time: data.time || "",
        clinic: data.clinicName || "",
        patientName: data.patientName || ""
      };
    });
    // Return json response as well as appointments
    return res.json({
      ok: true,
      appointments
    });
  } 
  catch (err) 
  {
    // Any errors in try
    return res.status(500).json({
      ok: false,
      error: String(err.message || err)
    });
  }
};





// ViewCalenderAppointmentPage
// Used in dashboards of staff, patient, and provider
handlers.getAppointmentsByDate = async function getAppointmentsByDate(req, res) 
{
  try 
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Extract date into string
    const dateStr = String(req.query.date || "").trim();
    // Determine scope (patient, clinic, or porivder)
    const scope = String(req.query.scope || "").trim();

    // Return errors if scope or date is not valid
    if (!dateStr)
      return res.status(400).json({ ok: false, error: "Missing date" });

    if (!scope)
      return res.status(400).json({ ok: false, error: "Missing scope" });
    // Query firestore for appointments according to dateStr that are scheduled
    let query = db
      .collection("appointments")
      .where("date", "==", dateStr)
      .where("status", "==", "scheduled");
    // If patient, search appointments by UID
    if (scope === "patient")
    {
      // get user doc of patient
      const userDoc = await db.collection("users").doc(user.uid).get();
      // if doc does not exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // get doc data and patient id
      const userData = userDoc.data();
      const patientId = String(userData.id || "");
      // if patient id does not exist, send error
      if (!patientId)
        return res.status(400).json({ ok: false, error: "User is missing patient id" });
      // modify query to show appointments that have matching patientId
      query = query.where("patientId", "==", patientId);
    }
    // If staff
    else if (scope === "staff-clinic") 
    {
      // Fetch user document of current staff
      const userDoc = await db.collection("users").doc(user.uid).get();
      // If staff doc does not exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // Convert user staff data into JSON
      const userData = userDoc.data();
      // Extract staff id
      const staffId = String(userData.id || "");
      // If staff id does not exist, send error
      if (!staffId)
        return res.status(400).json({ ok: false, error: "User is missing staff id" });
      // Get staff document from staff collections based on staff id
      const staffSnap = await db
        .collection("staff")
        .where("id", "==", staffId)
        .limit(1)
        .get();
      //  if no docs from staff collection, send error
      if (staffSnap.empty)
        return res.status(404).json({ ok: false, error: "Staff record not found" });
      // Convert staff doc into json and extract clinic id
      const staffData = staffSnap.docs[0].data();
      const staffClinicId = staffData.clinicId; 
      // appointments where clinicId == staffClinicId
      query = query.where("clinicId", "==", staffClinicId);
    } 
    // If provider
    else if (scope === "provider") 
    {
      // Get provider users doc
      const userDoc = await db.collection("users").doc(user.uid).get();
      // if doc does not exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // convert provider user doc into json and extract providerId
      const userData = userDoc.data();
      const providerId = String(userData.id || "");
      // If providerId does not exist, send error
      if (!providerId)
        return res.status(400).json({ ok: false, error: "User is missing provider id" });
      // Query only appts where providerId == providerId
      query = query.where("providerId", "==", providerId);
    }
    else
      return res.status(400).json({ ok: false, error: "Invalid scope" });
    // Get the documents based on modified query
    const documents = await query.limit(200).get();
    // Map the documents into an array
    // for each document of query d, get data
    const results = documents.docs.map((d) => {
      const a = d.data();
      // datetime
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // format fields for appointments for a given day
      return {
        id: d.id,
        patient_id: a.patientId || "",
        patient_name: a.patientName || "",
        patient_email: a.patientEmail || "",
        provider_name: a.providerName || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || "",
        clinic_id: a.clinicId ?? "",
        provider_id: a.providerId || ""
      };
    });

    return res.json({ ok: true, appointments: results });
  } 
  catch (err) 
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};
// Handler called when endpoint is called in index.js retrieving notifications
// Responsible for retrieving notifications for patients and staff
handlers.getNotifications = async function getNotifications(req, res) 
{
  try {
    /// Get user authentication
    const user = await requireAuth(req);
    // get user document from collection by uid
    const userDoc = await db.collection("users").doc(user.uid).get();
    // if doc does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // get doc data
    const userData = userDoc.data();
    // take id of member
    const memberId = String(userData.id || "");
    // get role
    const role = String(userData.role || "");
    // Get notifications by limit
    const limit = Number(req.query.limit || 50);

    // Get notiffication documents from collection
    const notificationsQuery = await db
      .collection("notifications")
      .where("endUserId", "==", memberId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const notificationDocs = notificationsQuery.docs;

    // Collect all appointment IDS from the notificationDocuments
    const appointmentIds = [
      // Spread operator, takes values out of a set (new)
      ...new Set(
        // for each doc, get the docs's appointment id only if id is type string and is not empty
        notificationDocs.map((doc) => doc.data().appointmentId).filter((id) => typeof id === "string" && id.trim() !== "")
      )
    ];

    // Use the appointmentIds (UIDS) and fetch the documents 
    // with matching IDS. Store the appointments into an array from
    // appointments collection
    const appointmentSnapshots = await Promise.all(
      // for each appointmentIds id, get the appointments by id
      appointmentIds.map((id) =>
        db.collection("appointments").doc(id).get()
      )
    );

    // Create a map that maps appointment UID + data
    const appointmentMap = new Map();
    // For each document, if it exists, add to the map a set of document id + data
    appointmentSnapshots.forEach((docSnap) => {
      if (docSnap.exists)
        appointmentMap.set(docSnap.id, docSnap.data());
    });

    // Transform the docs into data array , date, and time
    // for each notification document doc, get the data
    const notifications = notificationDocs.map((doc) => {
      const n = doc.data();
      const appt = appointmentMap.get(n.appointmentId) || null;
      // creation of notification 
      const created = n.createdAt?.toDate ? n.createdAt.toDate() : null;
      const start = appt?.start?.toDate ? appt.start.toDate() : null;
      // Format each notificaiton element as id
      // provider name
      // appointment type
      // date
      // clinic
      // notiication type
      // message
      // read (status)
      return {
        id: doc.id,
        role,
        notification_type: n.notificationType || "",
        patientName: n.patientName,
        message: n.message || "",
        read: Boolean(n.read),
        createdAt: created ? created.toISOString() : "",
        appointmentId: n.appointmentId || "",
        provider_name: appt?.providerName || "",
        appointment_type: appt?.appointmentType || "",
        date: appt?.date || (start ? start.toISOString().slice(0, 10) : ""),
        time: appt?.time || (start ? start.toTimeString().slice(0, 5) : ""),
        clinic: appt?.clinicName || ""
      };
    });

    return res.json({ok: true, notifications});
  } 
  catch (err) 
  {
    // Return error in try
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// Handler called when endpoint is called in index.js when getting upcoming appointments
// Responsible for getting upcoming appointments for patient
handlers.getUpcomingAppointments = async function getUpcomingAppointments(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);

    // Limit the number of upcoming appointments
    const limit = Number(req.query.limit || 5);
    // get Timestamp now
    const nowTs = admin.firestore.Timestamp.fromDate(new Date());

    // Get the documents (appointments) for a given patient that are scheduled
    // and upcoming by limit
    // get all upcoming appointments documents
    // for a given patient id
    // where between start and now
    const upcoming_appts_docs = await db
      .collection("appointments")
      .where("bookedByUID", "==", user.uid)
      .where("status", "==", "scheduled")
      .where("start", ">=", nowTs)
      .limit(limit)
      .get();

    // Map appointments into data given data, date, and time
    // for each upcoming appointment doc d, 
    const upcoming_appts = upcoming_appts_docs.docs.map((d) => {
      const a = d.data();
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // format each element in array by provider
      // type
      // date
      // time
      // clinic
      // Return id, provier name, appointment type, date, clinic, and time
      return {
        id: d.id,
        provider_name: a.providerName || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || "",
        patientName: a.patientName || ""
      };
    });

    return res.json({ok: true, upcoming_appts});
  } 
  catch (err) 
  {
    // Any errors in try
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// Handler called when endpoint is called in index.js when getting past appointments
// Responsible for retrieving past appointments froma user
handlers.getPastAppointments = async function getPastAppointments(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);

    // Get a limit of past appointments
    const limit = Number(req.query.limit || 50);
    // Get time now in timestamp
    const nowTs = admin.firestore.Timestamp.fromDate(new Date());

    // Get all past docuemnts (appointments)
    // Get all past appointments for a patient by patient id
    // where appointment is compleleted or cancelled
    // before now
    const pastApptsDocs = await db
      .collection("appointments")
      .where("bookedByUID", "==", user.uid)
      .where("status", "in", ["completed", "cancelled"])
      .where("start", "<", nowTs)
      .limit(limit)
      .get();

    // Transform the documents into an array called data that has info, date, and time
    // for each past appointment document d
    const past_appts = pastApptsDocs.docs.map((d) => {
      const a = d.data();
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // format each element in array
      // id, provider name, appointment type, date, time, clinic
      return {
        id: d.id,
        provider_name: a.providerName || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || ""
      };
    });

    return res.json({ok: true, past_appts});
  } 
  catch (err) 
  {
    // Any errors in try
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};





// Handler called when endpoint is called in index.js when getting daily appointments
// Responsible for gettig daily appointments used by staff and providers
// Provider, staff
handlers.getDailyAppointments = async function getDailyAppointments(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);
console.log("TEST");
    // Determine the role (staff or provider)
    const role = req.query.role;

    // Get today's date
    const now = new Date();
    // Get today's dates in terms of start and end hours (beginning and end)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Convert dates into timestamps from firestore
    const startTs = admin.firestore.Timestamp.fromDate(startOfDay);
    const endTs = admin.firestore.Timestamp.fromDate(endOfDay);

    // Get a collection of appointments that satisfy the criteron of being today
    let query = db.collection("appointments")
      .where("start", ">=", startTs)
      .where("start", "<=", endTs)
      .where("status", "==", "scheduled")
      .orderBy("start", "asc");
    // if provider, check if providerId is in the document
    if (role === "provider") 
    {
      // Grab user document by uid
      const userDoc = await db.collection("users").doc(user.uid).get();
      // if doc doesn't exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // Convert doc into data and get provider id
      const userData = userDoc.data();
      const providerId = String(userData.id || "");
      // if no provider id, send error
      if (!providerId) 
        return res.status(400).json({ ok: false, error: "User is missing provider id" });
      // Modify query to find docs where providerId== providerId
      query = query.where("providerId", "==", providerId);
    }
    else if (role === "staff") 
    {
      // Grab user doc by uid
      const userDoc = await db.collection("users").doc(user.uid).get();
      // if user doc does not exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // Conver doc into data and get staff id
      const userData = userDoc.data();
      const staffId = String(userData.id || "");
      // if staff id does not exist, send error
      if (!staffId)
        return res.status(400).json({ ok: false, error: "User is missing staff id" });
      // Find all docs from staff collection where id == staffId
      const staffSnap = await db
        .collection("staff")
        .where("id", "==", staffId)
        .limit(1)
        .get();
      // if no staff docs, send error
      if (staffSnap.empty)
        return res.status(404).json({ ok: false, error: "Staff record not found" });
      // Extract staff data and get id
      const staffData = staffSnap.docs[0].data();
      const staffClinicId = staffData.clinicId;
      // modify query to find all docs where clinicId==staffClinicId
      query = query.where("clinicId", "==", staffClinicId);
    }
    // Get documents from database
    const apptsDocuments = await query.get();

    // Get the data from the doucments via map
    // data, date, time
    // for each daily appointment document d
    const daily_appts = apptsDocuments.docs.map((d) => {
      const info = d.data();
      const dt = info.start?.toDate ? info.start.toDate() : null;

      // Return id, provider name, appointment type, date, time, ald clinic
      // Format the elements into an array
      return {
        id: d.id,
        provider_name: info.providerName || "",
        appointment_type: info.appointmentType || "",
        date: info.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: info.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: info.clinicName || "",
        patientName: info.patientName || ""
      };
    });
    
    // Return a json response of OK + data of daily appointments
    return res.json({ok: true, daily_appts});
  } 
  catch (err) 
  {
    // Any errors in try
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// Handler called when endpoint is called in index.js when getting weekly appointments
// Responsible for getting weekly appointments used by staff and provdiers
// Used by staff and provider
handlers.getWeeklyAppointments = async function getWeeklyAppointments(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);
    const providerId = req.query.providerId || "";
      const role = String(req.query.role || "");
    // Get the start of the week
    const startStr = String(req.query.start || "");
    // Get the starting day of the week as Date
    const startDate = startStr ? new Date(startStr + "T00:00:00") : new Date();
    // Create new date based on the current year, month, and date
    const startOfDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0, 0, 0
    );
    // Create a new date (end of the week) 7 days from start day
    const endOfWeek = new Date(startOfDay);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    // Create two timestamps of start of week and end of week
    const startTs = admin.firestore.Timestamp.fromDate(startOfDay);
    const endTs = admin.firestore.Timestamp.fromDate(endOfWeek);

    // Get the appointments that satisfy the provider, status, start, and end time
    // Get appointments from collection appointments where it is for provider, scheduled
    // between start and end
    let query = db
      .collection("appointments")
      .where("status", "==", "scheduled")
      .where("start", ">=", startTs)
      .where("start", "<", endTs);

    if (role === "provider") 
    {
      // Grab user document by UID
      const userDoc = await db.collection("users").doc(user.uid).get();
      // if user doc doesn't exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // Convert doc into data and extract provider id
      const userData = userDoc.data();
      const providerId = String(userData.id || "");
      // If id does not exist, send error
      if (!providerId)
        return res.status(400).json({ ok: false, error: "User is missing provider id" });
      // Add condition of matching provider ids
      query = query.where("providerId", "==", providerId);
    } 
    else if (role === "staff") 
    {
      // Grab user document by UID
      const userDoc = await db.collection("users").doc(user.uid).get();
      // If doc doesn't exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // Convert doc into data and extract staff id
      const userData = userDoc.data();
      const staffId = String(userData.id || "");
      // If staff id does not exist, send error
      if (!staffId) {
        return res.status(400).json({ ok: false, error: "User is missing staff id" });
      }
      // query collection 'staff' where id == staffId
      const staffSnap = await db
        .collection("staff")
        .where("id", "==", staffId)
        .limit(1)
        .get();
      // if query result empty, send error
      if (staffSnap.empty)
        return res.status(404).json({ ok: false, error: "Staff record not found" });
      // Convert staff data and get clinic id
      const staffData = staffSnap.docs[0].data();
      const staffClinicId = staffData.clinicId;
      // Add condition where clinicId == staffClinicId
      query = query.where("clinicId", "==", staffClinicId);
    } 
    else 
    {
      return res.status(400).json({ ok: false, error: "Invalid role" });
    }

    query = query.orderBy("start", "asc");
    const documentsAppointments = await query.get();
    // Map the documents into data, date, time
    // for each weekly appointment doc d
    const weekly_appts = documentsAppointments.docs.map((d) => {
      const a = d.data();
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // Return id, provider name, appointment type, date, time, clionic
      // Format the element in weekly_apts as id, provider name, appoitnment type, date, time, clinic
      return {
        id: d.id,
        provider_name: a.providerName || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || "",
        patientName: a.patientName || ""
      };
    });

    return res.json({ok: true, weekly_appts});
  } 
  catch (err) 
  {
    // Any errors in try
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};





// NotificationPatientPage
// Staff sends notifications to patients
handlers.sendPatientNotification = async function sendPatientNotification(req, res) 
{
  try 
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Take the appointmentId, method, and message from form
    const { appointmentId, method, message } = req.body;
    // if appointment does not exist, send error
    if (!appointmentId)
      return res.status(400).json({ ok: false, error: "Missing appointmentId" });
    // Retrieve doc from firestore using token
    const userDoc = await db.collection("users").doc(user.uid).get();
    // If doc does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // Convert doc into json nad extract staffId from userdata
    const userData = userDoc.data();
    const staffId = String(userData.id || "");
    // Return error if no staff id
    if (!staffId)
      return res.status(400).json({ ok: false, error: "User is missing staff id" });
    // Get all staff where id == staffId
    const staffSnap = await db
      .collection("staff")
      .where("id", "==", staffId)
      .limit(1)
      .get();
    // If no staff documents, return error
    if (staffSnap.empty)
      return res.status(404).json({ ok: false, error: "Staff record not found" });
    // Extract staff data + staff clinic id
    const staffData = staffSnap.docs[0].data();
    const staffClinicId = staffData.clinicId;
    // Get the appointment based on appointmentId from firestore
    const apptDoc = await db.collection("appointments").doc(String(appointmentId)).get();
    // If doc does not exist, send error
    if (!apptDoc.exists)
      return res.status(404).json({ ok: false, error: "Appointment not found" });
    // convert appt doc into json
    const appt = apptDoc.data();
    // If appt clinic id does not equal clinic id of staff, return error
    if (appt.clinicId !== staffClinicId) {
      return res.status(403).json({ ok: false, error: "Not authorized for this appointment" });
    }

    const notificationType = method === "text" ? "text" : "email";
    // Create a notification (document) to notifications collection
    // patient id, current user id, appointment id, provider name, appointment type,
    //clinic name, date, time, notification type, and messsage
    const docRef = await db.collection("notifications").add({
      appointmentId: apptDoc.id,
      endUserId: String(appt.patientId || ""),
      fromUserId: user.uid,
      providerName: appt.providerName || "",
      appointmentType: appt.appointmentType || "",
      clinicName: appt.clinicName || "",
      date: appt.date || "",
      time: appt.time || "",
      notificationType: notificationType,
      message: message || "",
      patientEmail: appt.patientEmail || "",
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    // JSON response of OK, notificaiton sent
    return res.json({ ok: true, id: docRef.id });
  } 
  catch (err) 
  {
    // Any errors in try
    return res.status(401).json({ ok: false, error: String(err.message || err) });
  }
};


// NotifyPatinetPage
// Return upcoming appointments for clinics
handlers.getStaffUpcomingAppointments = async function getStaffUpcomingAppointments(req, res) 
{
  try 
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Limit the number of appointments returned
    const limit = Number(req.query.limit || 50);
    // Get time of now
    const nowTs = admin.firestore.Timestamp.fromDate(new Date());
    // Fetch document using token
    const userDoc = await db.collection("users").doc(user.uid).get();
    // If doc, does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // Extract doc into JSON
    const userData = userDoc.data();
    // Extract staff id from doc
    const staffId = String(userData.id || "");
    // If staff id does not exiset, send error
    if (!staffId)
      return res.status(400).json({ ok: false, error: "User is missing staff id" });
    // Get all staff members from staff collection where id == staffId
    const staffSnap = await db
      .collection("staff")
      .where("id", "==", staffId)
      .limit(1)
      .get();
    // if no staff members, return error
    if (staffSnap.empty)
      return res.status(404).json({ ok: false, error: "Staff record not found" });
    // Create staff data and extract staff clinic id
    const staffData = staffSnap.docs[0].data();
    const staffClinicId = staffData.clinicId;
    // Get all appointments where clinicId == staffClinicId
    const snapshot = await db
      .collection("appointments")
      .where("clinicId", "==", staffClinicId)
      .where("status", "==", "scheduled")
      .where("start", ">=", nowTs)
      .orderBy("start", "asc")
      .limit(limit)
      .get();
    // Get all appointments into an array
    // for each appointment (snapshost query of appointments ) d
    const appointments = snapshot.docs.map((d) => {
      const a = d.data();
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // Format element
      return {
        id: d.id,
        patient_id: a.patientId || "",
        patient_email: a.patientEmail || "",
        patient_name: a.patientName || "",
        provider_name: a.providerName || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || ""
      };
    });

    return res.json({ ok: true, appointments });
  } 
  catch (err) 
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};




// NotificationStaffPage
// Provider uses to send a notificaiton to staff
handlers.sendStaffNotification = async function sendStaffNotification(req, res) 
{
  try 
  {
    // Get user from authentication database
    const user = await requireAuth(req);

    // Create notifiction body from provider to staff with staff id, appointment id, and reason
    // req == form
    const 
    {
      appointmentId,
      reason
    } = req.body;
    // if appointment id does not exist, send error
    if (!appointmentId)
      return res.status(400).json({ ok: false, error: "Missing appointmentId" });

    // if reason does not exist or is not a string, send JSON error
    if (!reason || !String(reason).trim()) 
      return res.status(400).json({ ok: false, error: "Missing reason" });

    // Get appointmen document from collection via appointment id
    const apptDoc = await db.collection("appointments").doc(String(appointmentId)).get();
    // if doc does not exist, send error
    if (!apptDoc.exists)
      return res.status(404).json({ ok: false, error: "Appointment not found" });
    // get appointment id and extract clinic id
    const appt = apptDoc.data();
    const clinicId = appt.clinicId;
    // if clinic id does not exist, send error
    if (!clinicId)
      return res.status(400).json({ ok: false, error: "Appointment missing clinicId" });
    // query staff collection for all staff members beloging to a clinic
    const staffSnap = await db
      .collection("staff")
      .where("clinicId", "==", clinicId)
      .get();
    // if staff query empty, send error
    if (staffSnap.empty)
      return res.status(404).json({ ok: false, error: "No staff found for clinic" });
    // perform a batch and a list of staff ids for a clinic
    const batch = db.batch();
    const createdIds = [];
    // for each staff document
    staffSnap.docs.forEach((staffDoc) =>
    {
      // Create a notification doc, push staff id into batch
      const notifRef = db.collection("notifications").doc();
      createdIds.push(notifRef.id);
      // notification request doc
      // clinic id, enduser id, from user id, appointment id, notification type
      // message
      // read or not
      // created at
      batch.set(notifRef, {
        clinicId: clinicId,
        endUserId: String(staffDoc.data().id || ""),
        fromUserId: user.uid,
        patientName: apptDoc.patientName,
        appointmentId: apptDoc.appointmentId,
        notificationType: "Cancel Appointment",
        message: String(reason).trim(),
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    // send batch to firestore
    await batch.commit();
    // Send response JSON of ok and notificaiton sent
    return res.json({ ok: true, ids: createdIds, count: createdIds.length});
  } 
  catch (err) 
  {
    // any errors in try
    return res.status(401).json({ ok: false, error: String(err.message || err) });
  }
};


handlers.getUpcomingProviderAppointments = async function getUpcomingProviderAppointments(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);
    // Set a limit for returned appointments
    const limit = Number(req.query.limit || 50);
    // Get Timestamp now
    const nowTs = admin.firestore.Timestamp.fromDate(new Date());
    // Fetch user document from users colleciton by uid
    const userDoc = await db.collection("users").doc(user.uid).get();
    // If doc does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // Extrat user doc into json and extract provider id
    const userData = userDoc.data();
    const providerId = String(userData.id || "");
    // if provider id does not exist, send error
    if (!providerId)
      return res.status(400).json({ ok: false, error: "User is missing provider id" });
    // Query db from appointments collections of upcoming appointments for providers
    const snapshot = await db
      .collection("appointments")
      .where("providerId", "==", providerId)
      .where("status", "==", "scheduled")
      .where("start", ">=", nowTs)
      .orderBy("start", "asc")
      .limit(limit)
      .get();
    // Map docs into appointments array
    // for each doc of query d
    const appointments = snapshot.docs.map((d) => {
      const a = d.data();
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // Format element
      return {
        id: d.id,
        patient_id: a.patientId || "",
        patient_name: a.patientName || "",
        patient_email: a.patientEmail || "",
        provider_name: a.providerName || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || "",
        clinic_id: a.clinicId ?? ""
      };
    });

    return res.json({ ok: true, appointments });
  } 
  catch (err) 
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};



// ClinicInformationPage
// Gets clinic information from a clinic search page
// From a result
handlers.getClinicInformation = async function getClinicInformation(req, res) 
{
  try 
  {
    // Get authentication from firebase token
    await requireAuth(req);

    // Get clinic ID from query
    const clinicId = String(req.query.clinicId || "");
    // If clinic id does not exist, send JSON error
    if (!clinicId) 
    {
      return res.status(400).json({ ok: false, error: "Missing clinicId" });
    }
    // Use clinic ID to extract clinic document from clinics collection in firebase
    const clinicDoc = await db.collection("clinics").doc(clinicId).get();
    // If clinic document does not exist, send error
    if (!clinicDoc.exists) 
      return res.status(404).json({ ok: false, error: "Clinic not found" });

    // Get clinic information from document
    const info = clinicDoc.data();

    // Get a collection of providers for a given clinic
    const providersSnap = await db
      .collection("users")
      .where("role", "==", "provider")
      .where("clinicIds", "array-contains", clinicId)
      .get();

    // Map providers into an array by ID, name, specialization, and hours 
    // for each provider document d
    const providers = providersSnap.docs.map((d) => {
      const p = d.data();
      // Format data into id, name specialiation, and hours
      return {
        id: d.id,
        name: p.name || "",
        specialization: p.specialization || "",
        hours: p.hours || ""
      };
    });

    // Create a JSON response that returns that clinic information and providers list
    // Return OK
    return res.json({
      ok: true,
      clinic: {
        id: info.id,
        name: info.name || "",
        address: info.address || "",
        hours: info.hours || "",
        appointmentSlots: info.appointmentSlots ?? "",
        cancellationPolicy: info.cancellationPolicy || "",
        insurancesAccepted: Array.isArray(c.insurances) ? info.insurances.join(", ") : (info.insurancesAccepted || ""),
        providers
      }
    });
  } 
  catch (err) 
  {
    return res.status(401).json({ ok: false, error: String(err.message || err) });
  }
};

// ClinicSearchPage
// Search for clinics based on insurance, provider, or rating
// Used by patient
handlers.searchClinics = async function searchClinics(req, res) 
{
  try 
  {
    // Get authentication access
    await requireAuth(req);

    // Get insurance, provider, minimum rating from request form
    const insurance = String(req.body.insuranceType || "").trim();
    const provider = String(req.body.provider || "").trim().toLowerCase();
    const minRatingRaw = req.body.minimumRating;
    const minRating = minRatingRaw === "" || minRatingRaw === undefined ? null : Number(minRatingRaw);

    // An empty list of providerClinicIDs
    let providerClinicIds = null;

    // For a given provider
    if (provider) 
    {
      // Grab all user documents
      const user_documents = await db.collection("users").get();
      // Make a set from user documents such that it comprimises of id
      // and first name and last name
      // However, filter it so fullName is included in provider
      // Map by ID 
      const matchingUserIds = new Set(
        user_documents.docs
          // for each user document d
          .map((d) => {
            const u = d.data();
            const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim().toLowerCase();

            return {
              id: String(u.id || ""),
              fullName
            }; // for each data of document d, if id and full name exists in provider, than map it by id in data
          }).filter((u) => u.id && u.fullName.includes(provider)).map((u) => u.id)
      );

      // Now load providers and keep only those whose provider id matches users.id
      const prov_documents = await db.collection("providers").get();

      // After collecting all provider documents, map them
      // in such a way that provider id in matchingUserIds
      // matches the docs in prov_documents (provider documents)
      const matches = prov_documents.docs
        // map each provider document with new object that contains id of doc + rest of fields of doc
        .map((d) => ({ id: String(d.id), ...d.data() }))
        // such that for each p, the id of p is contained in matchingUserIds
        .filter((p) => matchingUserIds.has(String(p.id || "")));

      providerClinicIds = new Set();

      // Make a set of provider that work at clinics
      for (const p of matches) 
      {
        const ids = Array.isArray(p.clinicIds) ? p.clinicIds : [];
        ids.forEach((id) => providerClinicIds.add(String(id)));
      }
    }

    // Grab all clinic documents
    let clinic_documents = db.collection("clinics");

    // Get clinic documents based on insurance types or minimum rating
    // Clinic documents where insurances match
    console.log(minRating);
    if (insurance)
    { 
      clinic_documents = clinic_documents.where("insurancesAccepted", "array-contains", insurance);
      console.log(true);
    }
    // Clinics where rating is above or equal to minumum
    if (minRating !== null && !Number.isNaN(minRating)) 
      clinic_documents = clinic_documents.where("rating", ">=", minRating);

    // Grab the clinic documents again
    const clinicSnap = await clinic_documents.get();

    // Create an array of clinics with information such as id, name, address, hours, rating, and insurances
    // For each clinic document d
    let clinics = clinicSnap.docs.map((d) => {
      const c = d.data();
      return {
        id: d.id,
        clinicId: c.clinicId ?? "",
        name: c.name || "",
        address: c.address || "",
        hours: c.hours || "",
        rating: typeof c.rating === "number" ? c.rating : null,
        appointmentSlotsPerDay: c.appointmentSlotsPerDay ?? "",
        cancellationPolicy: c.cancellationPolicy ?? "",
        insurancesAccepted: Array.isArray(c.insurancesAccepted) ? c.insurancesAccepted : [],
        remainingAppointments: c.remainingAppointments ?? "",
        providers: []
      };
    });

    // If providerClinicIds exist, filter that into existing clinics array
    // Basically, take the existings clinics array, and remove any clinic
    // that does not have a provider in the query
    if (providerClinicIds) 
      // For each clinic c, check if c clinic id is contained in providerClinicsIds
      clinics = clinics.filter((c) => providerClinicIds.has(String(c.clinicId)));
    if (clinics.length > 0) {
  const prov_documents = await db.collection("providers").get();
  const user_documents = await db.collection("users").get();
  //Map user documents in such a way that it contains first name and last name
  const userMap = new Map(
    // for each user document d
    user_documents.docs.map((d) => {
      const u = d.data();
      return [
        String(u.id || ""),
        {
          firstName: u.firstName || "",
          lastName: u.lastName || ""
        }
      ];
    })
  );

  // From clinics array, ta,ke the matchedProviders
  // map each clinic by getting its id and check whether it 
  // equals clinice id
  // filter in such a way that id is in clinic id
  // Map again such that it stores the full name, specialization, and hours of clinic
  clinics = clinics.map((clinic) => {
    const matchedProviders = prov_documents.docs
      // For each document d, get the id from d data and collect rest of data of document
      .map((d) => ({ id: String(d.data().id || d.id), ...d.data() }))
      // for each doc p, create an array of clinic Ids return a map of clinic ids
      .filter((p) => {
        const ids = Array.isArray(p.clinicIds) ? p.clinicIds : [];
        // map
        return ids.map(String).includes(String(clinic.clinicId));
      })
      // for each document p, get the data using p.id as key to usermap, and retrun
      // name, specialization,and hours of providers
      .map((p) => {
        const u = userMap.get(String(p.id)) || {};
        return {
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
          specialization: p.specialization || "",
          hours: p.hours || ""
        };
      });
    // return clinic information as well as list of providesr that work there
    return {
      ...clinic,
      providers: matchedProviders
    };
  });
}
    // Send response of OK, return list of clinic results
    return res.json({ ok: true, clinics });
  } 
  catch (err) 
  {
    // Error in try
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// ProviderClinicDatabase
// This function returns a list of clinics a provider works at
handlers.getProviderClinics = async function getProviderClinics(req, res) 
{
  try 
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Grab user document using UID
    const userDoc = await db.collection("users").doc(user.uid).get();
    // Send error if doc doesn't exist
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // Convert doc into usable data and extract a provider's id
    const userData = userDoc.data();
    const providerId = String(userData.id || "");
    // If provider id does not exist, send error
    if (!providerId)
      return res.status(400).json({ ok: false, error: "User is missing provider id" });
    // Query a list of providers that match by providerId
    const providerSnap = await db
      .collection("providers")
      .where("id", "==", providerId)
      .limit(1)
      .get();
    // If empty, send error
    if (providerSnap.empty)
      return res.status(404).json({ ok: false, error: "Provider record not found" });
    // Get a provider's data document
    const providerData = providerSnap.docs[0].data();
    // Geta list of clinic ids a provider works at
    const clinicIds = Array.isArray(providerData.clinicIds) ? providerData.clinicIds : [];
    // if no ids, send response
    if (clinicIds.length === 0)
      return res.json({ ok: true, clinics: [] });
    // get a query of clinics 
    const clinicSnap = await db.collection("clinics").get();
    // Get all clinics and format them as id, clinicid, name, address, and hours if 
    // c.clinicId is an id in clinicIds
    const clinics = clinicSnap.docs
      // for each clinic doc d
      .map((d) => {
        // get data, and format array element by the following fields
        const c = d.data();
        return {
          id: d.id,
          clinicId: c.clinicId ?? "",
          name: c.name || "",
          address: c.address || "",
          hours: c.hours || ""
        };
      })
      // for each clinic c, check if clinic id is in the array clinicsIds
      .filter((c) => clinicIds.map(String).includes(String(c.clinicId)));

    return res.json({ ok: true, clinics });
  } 
  catch (err) 
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// ProviderPatientDatabase
// Gets a provider's active patients
handlers.getProviderPatients = async function getProviderPatients(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);
    // Get users document using user's uid
    const userDoc = await db.collection("users").doc(user.uid).get();
    // Check if user documenent exists
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // Convert doc into user data and extract provider id
    const userData = userDoc.data();
    const providerId = String(userData.id || "");
    // If provider id does not exist, send error
    if (!providerId)
      return res.status(400).json({ ok: false, error: "User is missing provider id" });
    // Query a list of appoitnments where providerId==providerId
    const appointmentSnap = await db
      .collection("appointments")
      .where("providerId", "==", providerId)
      .get();
    // Get a list of patient ids from the appointments query
    const patientIds = [
      // Expand the new set
      ...new Set(
        // for each appointment doc d, get the patient id, and check whether patient id is not empty
        appointmentSnap.docs.map((d) => String(d.data().patientId || "")).filter((id) => id !== "")
      )
    ];
    // If patientIds is 0, send response
    if (patientIds.length === 0)
      return res.json({ ok: true, patients: [] });
    // Use patient ids to get all patients from users collections
    const userSnap = await db.collection("users").get();
    // Map out only those user documents in users collections
    // of patients such that it is in patientIds
    const patients = userSnap.docs
      // for each user doc d
      .map((d) => {
        const u = d.data();
        return {
          id: d.id,
          patientId: String(u.id || ""),
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          age: u.age || "",
          gender: u.gender || "",
          role: u.role || ""
        };
      })
      // For each patient doc u, check if role is patient and patietId is contained in patientIds
      .filter((u) => u.role === "patient" && patientIds.includes(u.patientId))
      // sort two docs a and b
      .sort((a, b) => {
        // compare by last names a and b
        const last = a.lastName.localeCompare(b.lastName);
        return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
      });
    // Return
    return res.json({ ok: true, patients });
  } 
  catch (err) 
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// StaffPatientDatabase
// Gets patient of a staff's clinic
handlers.getStaffPatients = async function getStaffPatients(req, res)
{
  try
  {
    // Get user authentication
    const user = await requireAuth(req);
    // Get a user document by uid
    const userDoc = await db.collection("users").doc(user.uid).get();
    // Return error if doc does not exist
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // Convert doc into data and extract staff id
    const userData = userDoc.data();
    const staffId = String(userData.id || "");
    // If id does not exist, send erropr
    if (!staffId)
      return res.status(400).json({ ok: false, error: "User is missing staff id" });
    // Query staff collection for id == staffId
    const staffSnap = await db
      .collection("staff")
      .where("id", "==", staffId)
      .limit(1)
      .get();
    // If query is e mpty, send error
    if (staffSnap.empty)
      return res.status(404).json({ ok: false, error: "Staff record not found" });
    // Extract staff member data and extract the clinciId they work at 
    const staffData = staffSnap.docs[0].data();
    const clinicId = staffData.clinicId;
    // Query appointments collections for clinicId == clinicId
    const appointmentSnap = await db
      .collection("appointments")
      .where("clinicId", "==", clinicId)
      .get();
    // Get a list of patient ids from appointmentSnap
    const patientIds = [
      // Expand a new set
      ...new Set(
        // For each appointment doc d, get the patient d, filter id to ensure it is not empty
        appointmentSnap.docs.map((d) => String(d.data().patientId || "")).filter((id) => id !== "")
      )
    ];
    // If patientIds == 0, send response
    if (patientIds.length === 0)
      return res.json({ ok: true, patients: [] });
    // Get a collection of all userrs
    const userSnap = await db.collection("users").get();
    // Get patinet doucments only for those that are registered at a 
    // a clinic
    const patients = userSnap.docs
      // for each user doc d
      .map((d) =>
      {
        const u = d.data();
        return {
          id: d.id,
          patientId: String(u.id || ""),
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          age: u.age || "",
          gender: u.gender || "",
          role: u.role || ""
        }; // For user doc u, check role is patient and its id is in the array of patientIds
        // sort a, b by last name using localeCompare
      }).filter((u) => u.role === "patient" && patientIds.includes(u.patientId)).sort((a, b) =>
      {
        const last = a.lastName.localeCompare(b.lastName);
        if (last !== 0)
          return last;

        return a.firstName.localeCompare(b.firstName);
      });
      // Return
    return res.json({ ok: true, patients });
  }
  catch (err)
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};
// StaffCompletedAppointments
handlers.getClinicAppointments = async function getClinicAppointments(req, res)
{
  try
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Get the date query and convert into string
    const dateStr = String(req.query.date || "").trim();
    // Determine scope whether patient or staff
    const scope = String(req.query.scope || "").trim();
    // if date missing, send json error
    //if (!dateStr)
      //return res.status(400).json({ ok: false, error: "Missing date" });
    // if not staff, error
    if (scope !== "staff-clinic")
      return res.status(400).json({ ok: false, error: "Invalid scope" });
    // Get user document by uid
    const userDoc = await db.collection("users").doc(user.uid).get();
    // if document does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // Convert doucment into data and get the staff id from userData
    const userData = userDoc.data();
    const staffId = String(userData.id || "");
    // if no staff id, send error
    if (!staffId)
      return res.status(400).json({ ok: false, error: "User is missing staff id" });
    // query staff collection for matching staff ids
    const staffSnap = await db
      .collection("staff")
      .where("id", "==", staffId)
      .limit(1)
      .get();
    // if query empty, send error
    if (staffSnap.empty)
      return res.status(404).json({ ok: false, error: "Staff record not found" });
    // get staff data froms staff document and extract clinic id
    const staffData = staffSnap.docs[0].data();
    const staffClinicId = staffData.clinicId;
    
    // query clinic_completed_appointments for matching clinicIds
    const completedSnap = await db
      .collection("clinic_completed_appointments")
      .where("clinicId", "==", staffClinicId)
      .get();

    // Create a set where it maps each clinic_completed_appointments_doc
    // and give appointment id
    const completedIds = new Set(
      // For each document of completed appointments, get the appointmentId form the doc and check it is not empty
      completedSnap.docs.map((d) => String(d.data().appointmentId || "")).filter((id) => id !== "")
    );
    
    // query appointments collection using clinicId and 
    // status == scheduled
    const appointmentSnap = await db
      .collection("appointments")
      .where("clinicId", "==", staffClinicId)
      //.where("date", "==", dateStr)
      .where("status", "==", "scheduled")
      .get();
    // map out appointments into an array which does not have a completed id
    // return as id, provider name, type, date, time, and clinic
    const appointments = appointmentSnap.docs
      // For each appointment doc, check that appoinment id is not in the list of completed appointments
      .filter((d) => !completedIds.has(d.id))
      // for each d, get the doc data
      .map((d) =>
      {
        const a = d.data();
        const dt = a.start?.toDate ? a.start.toDate() : null;
        // Format clinic appointments by provider name, id , type, date, time, and clinic
        return {
          id: d.id,
          provider_name: a.providerName || "",
          appointment_type: a.appointmentType || "",
          date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
          time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
          patient_name: a.patientName || "",
          clinic: a.clinicName || ""
        };
      });
    
    return res.json({ ok: true, appointments });
  }
  catch (err)
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// StaffCompletedAppointments
handlers.setAppointmentAsComplete = async function setAppointmentAsComplete(req, res)
{
  try
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Get appointment id to mark as complete
    const appointmentId = String(req.body.appointmentId || "").trim();
    // If no appointment id, send json error
    if (!appointmentId)
      return res.status(400).json({ ok: false, error: "Missing appointmentId" });
    // get user document from users collection
    const userDoc = await db.collection("users").doc(user.uid).get();
    // if document does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // get data from doc and get staff id
    const userData = userDoc.data();
    const staffId = String(userData.id || "");
    // if no staff id, send error
    if (!staffId)
      return res.status(400).json({ ok: false, error: "User is missing staff id" });
    // query staff collection for matching id
    const staffSnap = await db
      .collection("staff")
      .where("id", "==", staffId)
      .limit(1)
      .get();
    // if query empty, send error
    if (staffSnap.empty)
      return res.status(404).json({ ok: false, error: "Staff record not found" });
    // get staff doc data and clinci id of staff member
    const staffData = staffSnap.docs[0].data();
    const staffClinicId = staffData.clinicId;
    // get appointment by appointmentid
    const appointmentRef = db.collection("appointments").doc(appointmentId);
    const appointmentDoc = await appointmentRef.get();
    // if document does not exist, send eror
    if (!appointmentDoc.exists)
      return res.status(404).json({ ok: false, error: "Appointment not found" });
    // get document data
    const appointmentData = appointmentDoc.data();
    // if appointment does not belong to clinic, send error
    if (appointmentData.clinicId !== staffClinicId)
      return res.status(403).json({ ok: false, error: "Not authorized for this appointment" });
    // query existing completed appointments for clinic id and appointm ent
    const existingCompleteSnap = await db
      .collection("clinic_completed_appointments")
      .where("clinicId", "==", staffClinicId)
      .where("appointmentId", "==", appointmentId)
      .limit(1)
      .get();
    // if empty, send that marked already
    if (!existingCompleteSnap.empty)
      return res.status(409).json({ ok: false, error: "Appointment already marked complete" });
    // update in appointments collection
    await appointmentRef.update({
      status: "completed"
    });
    // otehrwise add
    await db.collection("clinic_completed_appointments").add({
      clinicId: staffClinicId,
      appointmentId: appointmentId
    });

    return res.json({ ok: true, message: "Appointment marked complete" });
  }
  catch (err)
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// ProviderCompletedAppointments
handlers.getProviderCompletedAppointments = async function getProviderCompletedAppointments(req, res)
{
  try
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Convert date into string and determine scope
    const dateStr = String(req.query.selectedDate || "").trim();
    const scope = String(req.query.scope || "").trim();
    // if date does not exist, send error
    //if (!dateStr)
      //return res.status(400).json({ ok: false, error: "Missing date" });
    // if scope not provider, send error
    if (scope !== "provider")
      return res.status(400).json({ ok: false, error: "Invalid scope" });
    // get user document from collection by uid
    const userDoc = await db.collection("users").doc(user.uid).get();
    // if doc does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // convert doc an data and determine provider id
    const userData = userDoc.data();
    const providerId = String(userData.id || "");
    // if no provider id, send error
    if (!providerId)
      return res.status(400).json({ ok: false, error: "User is missing provider id" });
    // query appointments with completed appointments by provider
    const appointmentSnap = await db
      .collection("appointments")
      .where("providerId", "==", providerId)
      //.where("date", "==", dateStr)
      .where("status", "==", "completed")
      .get();
    // map query into an array
    // for each appointment doc d
    const appointments = appointmentSnap.docs.map((d) =>
    {
      // get data
      const a = d.data();
      // datetime
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // craft appointments with the following fields
      return {
        id: d.id,
        provider_name: a.providerName || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || "",
        patientName: a.patientName
      };
    });

    return res.json({ ok: true, appointments });
  }
  catch (err)
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// PatientVisitedProviders
handlers.getPatientVisitedProviders = async function getPatientVisitedProviders(req, res)
{
  try
  {
    // Get user authentication
    const user = await requireAuth(req);
    // Query appointments collection by uid and completed
    const appointmentSnap = await db
      .collection("appointments")
      .where("bookedByUID", "==", user.uid)
      .where("status", "==", "completed")
      .get();
    // Create an empty map
    const providerMap = new Map();
    // For each appointment
    appointmentSnap.docs.forEach((d) =>
    {
      // Get data, provider id, name, and clinic
      const a = d.data();
      const providerId = String(a.providerId || "");
      const providerName = a.providerName || "";
      const clinic = a.clinicName || "";
      // A key for mapping
      const key = `${providerId}::${clinic}`;
      // If map does nto have key, add it
      if (!providerMap.has(key))
      {
        providerMap.set(key, {
          providerId,
          providerName,
          clinic,
          completedVisits: 0
        });
      }
      // if have key, increment number of visits
      providerMap.get(key).completedVisits += 1;
    });
    // Create an array of providers and sort them in ascending order
    const providers = Array.from(providerMap.values()).sort((a, b) =>
    {
      const nameCompare = a.providerName.localeCompare(b.providerName);
      if (nameCompare !== 0)
        return nameCompare;

      return a.clinic.localeCompare(b.clinic);
    });

    return res.json({ ok: true, providers });
  }
  catch (err)
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// PatientVisitedClinics
handlers.getPatientVisitedClinics = async function getPatientVisitedClinics(req, res)
{
  try
  {
    // Get user authentication
    const user = await requireAuth(req);
    // Query appointments collections for completed appointments
    const appointmentSnap = await db
      .collection("appointments")
      .where("bookedByUID", "==", user.uid)
      .where("status", "==", "completed")
      .get();

    // Create clinic map (empty)
    const clinicMap = new Map();
    // For each appointments, extract clinic id
    appointmentSnap.docs.forEach((d) =>
    {
      const a = d.data();
      const clinicId = String(a.clinicId || "");
      const key = clinicId;
      // if map does not have key, then add map entry
      if (!clinicMap.has(key))
      {
        clinicMap.set(key, {
          clinicId,
          name: a.clinicName || "",
          address: "",
          completedVisits: 0
        });
      }
      // increment clinic visit by one
      clinicMap.get(key).completedVisits += 1;
    });
    // create an array from the keys
    const clinicIds = Array.from(clinicMap.keys());
    // clinic ids exist, query clinics collection
    if (clinicIds.length > 0)
    {
      const clinicSnap = await db.collection("clinics").get();
      // for clinic document, get clinic id, name, and address
      clinicSnap.docs.forEach((d) =>
      {
        const c = d.data();
        const clinicId = String(c.clinicId || "");
        // if clinic map has id alread
        if (clinicMap.has(clinicId))
        {
          // get existing name and dress of clinic
          const existing = clinicMap.get(clinicId);
          existing.address = c.address || "";
          existing.name = existing.name || c.name || "";
        }
      });
    }
    // sort clinics by name a < b
    const clinics = Array.from(clinicMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    // return
    return res.json({ ok: true, clinics });
  }
  catch (err)
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// StaffCompletedAppointments
handlers.getStaffCompletedAppointments = async function getStaffCompletedAppointments(req, res)
{
  try
  {
    // Get user authentication token
    const user = await requireAuth(req);
    // Convert date into string and determine scope
    const dateStr = String(req.query.selectedDate || "").trim();
    const scope = String(req.query.scope || "").trim();
    // if date does not exist, send error
    //if (!dateStr)
      //return res.status(400).json({ ok: false, error: "Missing date" });
    // if scope not provider, send error
    if (scope !== "staff")
      return res.status(400).json({ ok: false, error: "Invalid scope" });
    // get user document from collection by uid
    const userDoc = await db.collection("users").doc(user.uid).get();
    // if doc does not exist, send error
    if (!userDoc.exists)
      return res.status(404).json({ ok: false, error: "User record not found" });
    // convert doc an data and determine provider id
    const userData = userDoc.data();
    // get staff id from doc
    const staffId = String(userData.id || "");
    // if no staff id, send error
    if (!staffId)
      return res.status(400).json({ ok: false, error: "User is missing staff id" });
    // query staff collection for staffId
    const staffSnap = await db
      .collection("staff")
      .where("id", "==", staffId)
      .limit(1)
      .get();
    // if query empty, send error
    if (staffSnap.empty)
      return res.status(404).json({ ok: false, error: "Staff record not found" });
    // get staff member data + clinic id
    const staffData = staffSnap.docs[0].data();
    const staffClinicId = staffData.clinicId;

    // query appointments with completed appointments by provider
    const appointmentSnap = await db
      .collection("appointments")
      .where("clinicId", "==", staffClinicId)
      .where("status", "==", "completed")
      .get();
    // map query into an array
    // for each appointment doc d
    const appointments = appointmentSnap.docs.map((d) =>
    {
      // get data
      const a = d.data();
      // datetime
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // craft appointments with the following fields
      return {
        id: d.id,
        provider_name: a.providerName || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || "",
        patientName: a.patientName
      };
    });

    return res.json({ ok: true, appointments });
  }
  catch (err)
  {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// Gets montly appointments by week and day
handlers.getMonthlyAppointments = async function getMonthlyAppointments(req, res)
{
  try
  {
    // Get user authentication
    const user = await requireAuth(req);
    // Determine string of start of week
    const startStr = String(req.query.start || "").trim();
    // Determine string of end of week
    const endStr = String(req.query.end || "").trim();
    // Current role
    const role = String(req.query.role || "").trim();
    // if date strings missing, send error
    if (!startStr || !endStr)
      return res.status(400).json({ ok: false, error: "Missing start or end" });
    // if role does not exist, send error
    if (!role)
      return res.status(400).json({ ok: false, error: "Missing role" });
    // query appointments (scheduled) for a given week
    let query = db
      .collection("appointments")
      .where("date", ">=", startStr)
      .where("date", "<=", endStr)
      .where("status", "==", "scheduled");
    // if patient
    if (role === "patient")
    {
      // fetch user document by uid
      const userDoc = await db.collection("users").doc(user.uid).get();
      // if doc does not exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // get data from doc and patient id
      const userData = userDoc.data();
      const patientId = String(userData.id || "");
      // if patient id does not exist, send error
      if (!patientId)
        return res.status(400).json({ ok: false, error: "User is missing patient id" });
      // modify query to search for patient id
      query = query.where("patientId", "==", patientId);
    }
    // if staff
    else if (role === "staff")
    {
      // fetch user doc by uid
      const userDoc = await db.collection("users").doc(user.uid).get();
      // if doc does not exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // get user data and staff id
      const userData = userDoc.data();
      const staffId = String(userData.id || "");
      // if staff id does not exist, send error
      if (!staffId)
        return res.status(400).json({ ok: false, error: "User is missing staff id" });
      // query staff collection by staff id
      const staffSnap = await db
        .collection("staff")
        .where("id", "==", staffId)
        .limit(1)
        .get();
      // if query empty, send error
      if (staffSnap.empty)
        return res.status(404).json({ ok: false, error: "Staff record not found" });
      // get member staff plus the clinic id they work at
      const staffData = staffSnap.docs[0].data();
      const staffClinicId = staffData.clinicId;
      // modify query with clinic id
      query = query.where("clinicId", "==", staffClinicId);
    }
    // if provider
    else if (role === "provider")
    {
      // fetch user doc by uid
      const userDoc = await db.collection("users").doc(user.uid).get();
      // if doc does not exist, send error
      if (!userDoc.exists)
        return res.status(404).json({ ok: false, error: "User record not found" });
      // get user data + provider id
      const userData = userDoc.data();
      const providerId = String(userData.id || "");
      // if provider id does not exist, send error
      if (!providerId)
        return res.status(400).json({ ok: false, error: "User is missing provider id" });
      // modify query with provider id
      query = query.where("providerId", "==", providerId);
    }
    else
    {
      // no role matched
      return res.status(400).json({ ok: false, error: "Invalid role" });
    }
    // query firebase with the conditions
    const snap = await query.get();
    // create appointments array where each doc d is mapped
    const appointments = snap.docs.map((d) =>
    {
      const a = d.data();
      const dt = a.start?.toDate ? a.start.toDate() : null;
      // return patient id, patient name, provider name + id, appointment type
      // date, time
      // clinic, clinic id
      return {
        id: d.id,
        patient_id: a.patientId || "",
        patient_name: a.patientName || "",
        provider_name: a.providerName || "",
        provider_id: a.providerId || "",
        appointment_type: a.appointmentType || "",
        date: a.date || (dt ? dt.toISOString().slice(0, 10) : ""),
        time: a.time || (dt ? dt.toTimeString().slice(0, 5) : ""),
        clinic: a.clinicName || "",
        clinic_id: a.clinicId ?? ""
      };
    });
    // return data
    return res.json({ ok: true, appointments });
  }
  catch (err)
  {
    // error handling
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};

// ProviderInformationPage
// page that opens up when clicking on a result from provider search page
handlers.displayProviderInformation = async function displayProviderInformation(req, res) 
{
  try 
  {
    // Get user authentication
    const user = await requireAuth(req);

    // Get provider document from  users collection for a given id
    const providerDoc = await db.collection("users").doc(user.uid).get();
    // If document does not exist, send JSON error
    if (!providerDoc.exists) 
      return res.status(404).json({ ok: false, error: "Provider profile not found" });

    // Get provider info from document
    const providerInfo = providerDoc.data();
    // Get a list of clinics into an array that a provider works at
    const clinicIds = Array.isArray(providerInfo.clinicIds) ? providerInfo.clinicIds : [];

    // Empty array of clinics
    let clinics = [];
    // If clinic IDs has elements, map them 
    if (clinicIds.length > 0) {
      // Gather all of the clinic documents
      // based on clinic ids via the collection "clinics"
      const clinicDocs = await Promise.all(
        clinicIds.slice(0, 10).map((id) => db.collection("clinics").doc(String(id)).get())
      );

      // with the clinicDocs,
      // map a dictionary of id, name, address and hours
      // of clincis into clinics array
      clinics = clinicDocs
        .filter((d) => d.exists)
        .map((d) => {
          const c = d.data();
          return {
            id: d.id,
            name: c.name || "",
            address: c.address || "",
            hours: c.hours || ""
          };
        });
    }

    // Return JSON response of OK, provider details, and clinics
    return res.json({
      ok: true,
      provider: {
        id: user.uid,
        name: (p.firstName + " " + p.lastName) || "",
        specialization: p.specialization || "",
        hours: p.hours || "",
        gender: p.gender || "",
        age: p.age || "",
        insurancesAccepted: p.insurancesAccepted || "",
        clinics
      }
    });
  } 
  catch (err) 
  {
    // Any errors in JSON
    return res.status(401).json({ ok: false, error: String(err.message || err) });
  }
};

export default handlers;
