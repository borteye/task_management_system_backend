interface IUser {
  id: number;
  email: string;
  username: string;
  role: string;
  password: string;
  flagged: boolean;
  status: string;
}

export { IUser };
