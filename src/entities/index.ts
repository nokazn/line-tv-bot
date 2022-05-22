export type Program = {
  name: string;
  from: Date;
  to: Date;
  broadcaster: string;
  overview: string;
  description: string;
  url: string;
};

export type Response = {
  statusCode: number;
  body: string;
};
