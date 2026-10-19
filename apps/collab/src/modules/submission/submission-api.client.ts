import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SubmissionValueEntries } from '@tomato/types';
import type { Env } from '../../config.schema';
import { SUBMISSION_VALUES_PATH } from './submission.constants';

@Injectable()
export class SubmissionApiClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService<Env, true>) {
    this.baseUrl = config.get('API_URL', { infer: true }).replace(/\/$/, '');
  }

  async putValues(submissionId: string, values: SubmissionValueEntries): Promise<void> {
    const response = await fetch(`${this.baseUrl}/submissions/${submissionId}/${SUBMISSION_VALUES_PATH}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });
    if (!response.ok) throw new Error(`${response.status}`);
  }
}
