import { BadRequestException } from '@nestjs/common';
import { GroupType } from '@tomato/constants';
import { describe, expect, it } from 'vitest';
import { createValidationPipe } from '../../../common';
import { GROUP_LIMIT_MAX_DEPTH } from '../groups.constants';
import { ListGroupsQueryDto } from './list-groups-query.dto';

const UUID = '0190f3a0-0000-7000-8000-000000000000';

function parse(limit?: string): Promise<ListGroupsQueryDto> {
  return createValidationPipe().transform(limit === undefined ? {} : { limit }, {
    type: 'query',
    metatype: ListGroupsQueryDto,
  }) as Promise<ListGroupsQueryDto>;
}

function nest(depth: number): unknown {
  return depth === 1 ? { type: GroupType.USER } : { NOT: nest(depth - 1) };
}

describe('ListGroupsQueryDto', () => {
  it.each([
    [{ OR: [{ type: GroupType.USER }, { type: GroupType.DEPARTMENT, uuid: UUID }] }],
    [{ type: { in: [GroupType.USER, GroupType.DEPARTMENT] } }],
    [{ uuid: { notIn: [UUID] }, type: { not: GroupType.USER } }],
    [{ AND: [{ uuid: { equals: UUID } }], NOT: { type: GroupType.USER } }],
    [{ OR: [] }],
    [{}],
    [nest(GROUP_LIMIT_MAX_DEPTH)],
  ])('accepts %j', async (limit) => {
    await expect(parse(JSON.stringify(limit))).resolves.toMatchObject({ limit });
  });

  it.each([[undefined], ['']])('treats %j as no limit', async (limit) => {
    expect((await parse(limit)).limit).toBeUndefined();
  });

  it('treats null as no limit', async () => {
    expect((await parse('null')).limit).toBeNull();
  });

  it.each([
    ['invalid JSON', '{'],
    ['an array', '[]'],
    ['a scalar', '1'],
    ['an unknown field', JSON.stringify({ label: 'Ada' })],
    ['a relation filter', JSON.stringify({ folder: { name: 'root' } })],
    ['a prototype key', `{"__proto__":{"type":"user"}}`],
    ['an unknown operator', JSON.stringify({ type: { contains: 'user' } })],
    ['an unknown type', JSON.stringify({ type: 'robot' })],
    ['a malformed uuid', JSON.stringify({ uuid: 'abc' })],
    ['a malformed uuid in a list', JSON.stringify({ uuid: { in: [UUID, 'abc'] } })],
    ['a null field', JSON.stringify({ type: null })],
    ['OR that is not a list', JSON.stringify({ OR: { type: GroupType.USER } })],
    ['a filter that is too deep', JSON.stringify(nest(GROUP_LIMIT_MAX_DEPTH + 1))],
  ])('rejects %s', async (_, limit) => {
    await expect(parse(limit)).rejects.toBeInstanceOf(BadRequestException);
  });
});
