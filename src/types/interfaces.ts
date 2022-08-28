export interface IConfig {
  /**
   * The port the server listens on for requests.
   */
  PORT: number;
  /**
   * The specific environment where the server is running.
   */
  NODE_ENV: string;
  /**
   *  The root path of the app.
   */
  ROOTPATH?: string;
  /**
   *  The host name for DB.
   */
  REDIS_URL: string;

  /**
   *  The api key in BASE 64.
   */
  API_KEY?: string;
}
