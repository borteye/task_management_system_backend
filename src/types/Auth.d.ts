interface IJwtPayload {
  userid?: number;
  email?: string;
  username?: string;
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
