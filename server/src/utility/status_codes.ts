const STATUS_CODES: Record<string, number> = {
  OK: 200,
  CREATED: 201,
  BadRequest: 400,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500
};

export default STATUS_CODES;