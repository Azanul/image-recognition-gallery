import { HomeProps } from "../screens/Home";

export const numberOfColumns = 2;

export const rootDir: string = '/storage/emulated/0';

export type RootStackParamList = {
    Home: HomeProps;
    Image: { path: string };
  };
  