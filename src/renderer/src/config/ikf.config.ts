export const IKF_CONFIG = {
  FSI_BASE_URL: 'https://api.fightsportsinsider.com/api/0.9/',
  FSI_BASE_URL2: 'https://api2.fightsportsinsider.com/api/0.9/',
  PROMOTER_IDS: [94, 89, 152, 144],
  DATE_FROM: '01/01/2023',
  IS_DRAFT: -1,
  RESPONSE_COUNT: 100,
  FIREBASE_DATABASE_URL: 'https://ikfpkb-midwest.firebaseio.com',
  // Data paths
  DATA_FILE_PATH: '/Users/nazeerholmes/Desktop/Development/nhe-cli/data/',
  // Auth - should be moved to environment variables in production
  AUTH_REQUEST_BODY: {
    email: 'ikfmidwest.api@ikffightplatform.com',
    password: 'yR$<l!_}09uBakR4]',
  },
  FSI_ACCESS_TOKEN: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNjU1ODYwLCJpYXQiOjE3NjE3OTE4NjAsImp0aSI6IjQyMGI1ODdkNDQ3ZjQ3ODQ5ODIyM2UyNjE0MTYyMWM1IiwidXNlcl9pZCI6Mjc2OCwiaXNfcHJlbWl1bSI6bnVsbCwicGVyc29uX2lkIjoyNzY4LCJpc19zdGFmZiI6ZmFsc2UsImlzX3Byb21vdGVycmVwIjp0cnVlLCJpc19wcm9tb3RlciI6dHJ1ZSwicHJvbW90ZXJfb3JnX2lkcyI6Wzk0LDg5LDE1MiwxNDRdLCJ0cmFpbmluZ19mYWNpbGl0eV9vcmdfaWRzIjpbMF0sImlzX3N1cGVydXNlciI6ZmFsc2V9.NrIha6bWYSDXFNrmOhqkkiT3Xt7uvuhZ5ks56TquOg8`,
};

export const getOptions: RequestInit = {
  method: 'GET',
  headers: {
    Accept: 'application/json, text/plain, */*',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  },
};

export const postOptions: RequestInit = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  mode: 'cors',
};
