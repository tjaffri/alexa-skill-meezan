
import requestpromise from 'request-promise';

export default async function getTestAccessToken() {
  const Auth0AccessTokenUri = process.env.AUTH0_ACCESS_TOKEN_URI;
  const Auth0ClientId = process.env.AUTH0_CLIENT_ID;
  const Auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
  const TestAccountRefreshToken = process.env.TEST_ACCOUNT_REFRESH_TOKEN;

  if (!Auth0AccessTokenUri || !Auth0ClientId || !Auth0ClientSecret || !TestAccountRefreshToken) {
    throw new Error('Auth0 Access Token Uri, Client Credentials or Test Account Credential Environment Variables not set.');
  }

  const postBody = {
    client_id: Auth0ClientId,
    client_secret: Auth0ClientSecret,
    refresh_token: TestAccountRefreshToken,
    grant_type: 'refresh_token',
  };

  const options = {
    method: 'POST',
    uri: Auth0AccessTokenUri,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: postBody,
    json: true,
    followAllRedirects: true,
  };

  const tokenResponse = await requestpromise(options);

  if (!tokenResponse || !tokenResponse.access_token) {
    throw new Error(`Invalid token response:  ${JSON.stringify(tokenResponse)}`);
  }

  return tokenResponse.access_token;
}
