const { useState } = React;

function AttendanceFinalizationApp() {
    const [orderId, setOrderId] = useState("ORD-2026-101");
    const [attendeeName, setAttendeeName] = useState("Brandon Sickler");
    const [email, setEmail] = useState("brandon@example.com");
    const [attendanceType, setAttendanceType] = useState("In-Person");
    const [sessionTrack, setSessionTrack] = useState("Technical Breakout");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);

    const [validationError, setValidationError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError("");
        setResponseMessage(null);
        const orderSkuRegex = /^ORD-\d{4}-\d{3,4}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!orderSkuRegex.test(orderId.trim())) {
            setValidationError("Invalid Order SKU format. Expected format: ORD-YYYY-### (e.g., ORD-2026-101).");
            return;
        }

        if (attendeeName.trim().length < 3) {
            setValidationError("Attendee Full Name must be at least 3 characters in length.");
            return;
        }

        if (!emailRegex.test(email.trim())) {
            setValidationError("Please enter a valid email address (e.g., user@example.com).");
            return;
        }

        const payload = {
            orderId: orderId.trim(),
            attendeeName: attendeeName.trim(),
            email: email.trim(),
            attendanceType: attendanceType,
            sessionTrack: sessionTrack,
            submittedAt: new Date().toISOString()
        };

        setIsSubmitting(true);

        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts",
            type: "POST",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(payload),
            success: function (data) {
                setIsSubmitting(false);
                setResponseMessage({
                    type: "success",
                    text: `RSVP Finalized! Server Record ID: ${data.id}`
                });
            },
            error: function () {
                setIsSubmitting(false);
                setResponseMessage({
                    type: "danger",
                    text: "AJAX Transport Error. Please try again."
                });
            }
        });
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Finalize Attendance Options</h5>
                <span className="badge bg-primary">React Controlled</span>
            </div>
            <div className="card-body">
                {/* Feedback Alert */}
                {responseMessage && (
                    <div className={`alert alert-${responseMessage.type} mb-3`} role="alert">
                        <strong>{responseMessage.text}</strong>
                    </div>
                )}

                {validationError && (
                    <div className="alert alert-danger mb-3" role="alert">
                        <strong>Validation Error:</strong> {validationError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Order / Registration ID <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={orderId} onChange={(e) => setOrderId(e.target.value)}required/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Attendee Full Name <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={attendeeName} onChange={(e) => setAttendeeName(e.target.value)} required/>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirmation Email <span className="text-danger">*</span></label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Participation Type <span className="text-danger">*</span></label>
                            <select className="form-select" value={attendanceType} onChange={(e) => setAttendanceType(e.target.value)}>
                                <option value="In-Person">In-Person</option>
                                <option value="Virtual">Virtual</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Session Track <span className="text-danger">*</span></label>
                            <select className="form-select" value={sessionTrack} onChange={(e) => setSessionTrack(e.target.value)}>
                                <option value="Keynote">Keynote</option>
                                <option value="Technical Breakout">Technical Breakout</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Panel">Panel</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={isSubmitting}>
                        {isSubmitting ? "Transporting via AJAX..." : "Submit Final RSVP (AJAX)"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const container = document.getElementById("react-finalization-root");
const root = ReactDOM.createRoot(container);
root.render(<AttendanceFinalizationApp />);