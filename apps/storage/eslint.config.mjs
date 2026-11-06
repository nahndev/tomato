import base from '@tomato/eslint-config';
import { globalIgnores } from 'eslint/config';

export default [globalIgnores(['src/generated']), ...base];
