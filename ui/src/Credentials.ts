import { encode } from 'jwt-simple';
import Credentials from '@daml/react/credentials';

export const LEDGER_ID: string = 'create-daml-app-sandbox';

export const APPLICATION_ID: string = 'create-daml-app';

export const SECRET_KEY: string = 'secret';

export function computeToken(party: string): string {
  const payload = {
    ledgerId: LEDGER_ID,
    applicationId: APPLICATION_ID,
    party,
  };
  return encode(payload, SECRET_KEY, 'HS256');
}

export const computeCredentials = (party: string): Credentials => {
  const token = computeToken(party);
  return {party, token, ledgerId: LEDGER_ID};
}

export function makeCredentials(party: string, token: string): Credentials {
  return {party, token, ledgerId: LEDGER_ID};
}

export default Credentials;
