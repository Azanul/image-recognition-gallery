import { HomeProps } from "../screens/Home";

export const numberOfColumns = 2;

export const rootDir: string = '/storage/emulated/0';

export type GeneralStackParamList = {
    Home: HomeProps;
    Image: { fileName: string, path: string };
  };
  