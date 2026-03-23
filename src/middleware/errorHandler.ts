export const errorHandler = (err: any, req: any, res: any, next: any) => {
  res.status(500).json({
    error: err.message || "Internal server error",
  });
};
