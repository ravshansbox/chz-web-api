import { HttpError } from '@ravshansbox/mini-app';
import { ZodError, ZodType } from 'zod';

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
