export const numberOfColumns = 2;

export const rootDir: string = '/storage/emulated/0';
export const rootTag: string = '';

interface HomeProps {
  dirPath: string,
  selector: (arg0: string) => any,
}

export type GeneralStackParamList = {
  General: HomeProps;
  Image: { fileName: string, path: string };
};

export type PeopleStackParamList = {
  People: HomeProps;
  Image: { fileName: string, path: string };
};
