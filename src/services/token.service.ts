import jwt from "jsonwebtoken";

function getJwtSecrets() {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error("JWT secrets are not configured");
  }

  return { jwtSecret, jwtRefreshSecret };
}

export const generateAccessToken = (userId: string) => {
  const { jwtSecret } = getJwtSecrets();
  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string) => {
  const { jwtRefreshSecret } = getJwtSecrets();
  return jwt.sign({ id: userId }, jwtRefreshSecret, {
    expiresIn: "7d",
  });
};
