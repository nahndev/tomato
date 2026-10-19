import { registerDecorator, type ValidationOptions } from 'class-validator';

export function createValidator(name: string, validate: (value: unknown) => boolean) {
  return (options?: ValidationOptions): PropertyDecorator =>
    (target, propertyKey) =>
      registerDecorator({
        name,
        target: target.constructor,
        propertyName: propertyKey as string,
        options,
        validator: { validate },
      });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
