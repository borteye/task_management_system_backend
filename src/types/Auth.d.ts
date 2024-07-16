interface IJwtPayload {
  id?: number;
  email?: string;
  username?: string;
  role?: string;
}

interface IMailOptions {
  email: string;
  verificationCode: string;
}

interface IEmailVerification {
  id: number;
  code: string;
  email: string;
}

export { IJwtPayload, IMailOptions, IEmailVerification };
