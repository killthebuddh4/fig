export type Feedback<T> =
  | {
      ok: true;
      data: T;
      code?: undefined;
      reason?: undefined;
    }
  | {
      ok: false;
      code: string;
      data?: undefined;
      reason: string;
    };
