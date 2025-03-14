export interface Route {
  path: string;
  component?: React.ReactNode;
  name?: string;
  hidden?: boolean;
}
