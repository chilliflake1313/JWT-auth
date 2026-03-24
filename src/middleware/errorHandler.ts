export const errorHandler = (err: any, req: any, res: any, next: any) => {
  const message = err?.message || "Internal server error";
  const lower = String(message).toLowerCase();

  let status = 500;
  if (lower.includes("invalid") || lower.includes("expired") || lower.includes("already exists") || lower.includes("at least 8")) {
    status = 400;
  } else if (lower.includes("unauthorized")) {
    status = 401;
  } else if (lower.includes("failed to send otp email") || lower.includes("authentication required") || lower.includes("mailtrap")) {
    status = 502;
  }

  res.status(status).json({
    error: message,
  });
};
