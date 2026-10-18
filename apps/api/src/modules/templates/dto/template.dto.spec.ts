import { describe, expect, it } from 'vitest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationQueryDto } from '../../../common';
import { CreateTemplateDto } from './create-template.dto';
import { UpdateTemplateDto } from './update-template.dto';

const CATEGORY_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

const check = async <T extends object>(cls: new () => T, plain: object) => {
  const instance = plainToInstance(cls, plain);
  return { instance, errors: await validate(instance) };
};

describe('CreateTemplateDto', () => {
  it('trims the name', async () => {
    const { instance, errors } = await check(CreateTemplateDto, { name: '  Survey  ' });
    expect(errors).toHaveLength(0);
    expect(instance.name).toBe('Survey');
  });

  it('rejects an empty or too long name', async () => {
    expect((await check(CreateTemplateDto, { name: '   ' })).errors).not.toHaveLength(0);
    expect((await check(CreateTemplateDto, { name: 'a'.repeat(101) })).errors).not.toHaveLength(0);
  });

  it('accepts an optional category id and rejects a non-uuid one', async () => {
    expect((await check(CreateTemplateDto, { name: 'A', categoryId: CATEGORY_ID })).errors).toHaveLength(0);
    expect((await check(CreateTemplateDto, { name: 'A', categoryId: 'abc' })).errors).not.toHaveLength(0);
  });
});

describe('UpdateTemplateDto', () => {
  it('accepts a partial payload', async () => {
    expect((await check(UpdateTemplateDto, { description: 'Intro' })).errors).toHaveLength(0);
  });
});

describe('PaginationQueryDto', () => {
  it('applies default values', async () => {
    const { instance, errors } = await check(PaginationQueryDto, {});
    expect(errors).toHaveLength(0);
    expect(instance).toMatchObject({ page: 1, pageSize: 20 });
  });

  it('coerces strings to numbers', async () => {
    const { instance } = await check(PaginationQueryDto, { page: '2', pageSize: '50' });
    expect(instance).toMatchObject({ page: 2, pageSize: 50 });
  });

  it('rejects pageSize above the limit', async () => {
    expect((await check(PaginationQueryDto, { pageSize: 101 })).errors).not.toHaveLength(0);
  });
});
