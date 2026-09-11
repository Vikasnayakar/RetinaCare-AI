const API_URL = "http://127.0.0.1:8000";

async function request(url: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${url}`, options);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Request failed");
  }

  return result;
}

// ============================================================
// AUTH
// ============================================================

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  organization: string;
}) {
  return request("/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function login(data: {
  email: string;
  password: string;
}) {
  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// ============================================================
// PATIENTS
// ============================================================

export async function createPatient(data: {
  name: string;
  age: number;
  gender: string;
  phone: string;
  village: string;
  health_worker_id: number;
}) {
  return request("/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getPatients(
  healthWorkerId: number,
) {
  return request(
    `/patients?health_worker_id=${healthWorkerId}`,
  );
}

export async function getPatient(
  patientId: number,
) {
  return request(`/patients/${patientId}`);
}

// ============================================================
// SCREENINGS
// ============================================================

export async function createScreening(
  patientId: number,
  image: File,
) {
  const formData = new FormData();

  formData.append("image", image);

  return request(`/screenings/${patientId}`, {
    method: "POST",
    body: formData,
  });
}

export async function getPatientScreenings(
  patientId: number,
) {
  return request(
    `/screenings/patient/${patientId}`,
  );
}

// ============================================================
// REFERRALS
// ============================================================

export async function createReferral(
  screeningId: number,
  data?: {
    reason?: string;
    priority?: string;
    referred_by?: number;
  },
) {
  const params = new URLSearchParams();

  if (data?.reason) {
    params.append("reason", data.reason);
  }

  if (data?.priority) {
    params.append("priority", data.priority);
  }

  if (data?.referred_by !== undefined) {
    params.append(
      "referred_by",
      String(data.referred_by),
    );
  }

  const query = params.toString();

  return request(
    `/referrals/screenings/${screeningId}${
      query ? `?${query}` : ""
    }`,
    {
      method: "POST",
    },
  );
}

export async function getReferrals(
  status?: string,
) {
  const query = status
    ? `?status=${encodeURIComponent(status)}`
    : "";

  return request(`/referrals/${query}`);
}

export async function getPatientReferrals(
  patientId: number,
) {
  return request(
    `/referrals/patient/${patientId}`,
  );
}

export async function getReferral(
  referralId: number,
) {
  return request(`/referrals/${referralId}`);
}

// ============================================================
// DOCTOR REVIEWS
// ============================================================

export async function submitDoctorReview(
  referralId: number,
  data: {
    doctor_id: number;
    decision: string;
    final_grade?: number | null;
    clinical_notes?: string | null;
  },
) {
  return request(
    `/doctor-reviews/referrals/${referralId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
}

export async function getDoctorReview(
  referralId: number,
) {
  return request(
    `/doctor-reviews/referrals/${referralId}`,
  );
}

export async function getDoctorReviews() {
  return request("/doctor-reviews/");
}

export async function downloadScreeningReport(
  screeningId: number
): Promise<Blob> {
  const response = await fetch(
    `${API_URL}/reports/screening/${screeningId}`
  );

  if (!response.ok) {
    let message = "Failed to download screening report";

    try {
      const result = await response.json();
      message = result.detail || message;
    } catch {
      // Keep default error message
    }

    throw new Error(message);
  }

  return response.blob();
}