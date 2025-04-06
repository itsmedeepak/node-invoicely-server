
export const apiResponse = (res, status, success, message, data = null) => {
  try {
    return res.status(status).json({
      success,
      message,
      data,
    });
  } catch (err) {
    console.error('Failed to send API response:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      data: null,
    });
  }
};
