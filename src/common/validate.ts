import { ZodError, ZodType } from 'zod';
import { HttpError } from './HttpError';

export const validate = <T>(schema: ZodType<T>, value: unknown) => {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError(error.errors, 400);
    } else {
      throw error;
    }
  }
};
