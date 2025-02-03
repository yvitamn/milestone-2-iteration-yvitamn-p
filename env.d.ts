declare namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET_KEY: string | undefined;
      EXTERNAL_API_URL: string;
      DATABASE_URL: string;
      // Add other environment variables here
    }
  }