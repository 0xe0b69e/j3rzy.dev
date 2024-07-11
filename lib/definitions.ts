export type Full<T> = {
  [K in keyof T]: NonNullable<T[K]>;
}

export interface UserData
{
  avatar: string | null;
  username: string;
  global_name: string | null;
}
