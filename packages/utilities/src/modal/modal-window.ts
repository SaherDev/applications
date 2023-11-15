export interface IModalWindow {
  group: string;
  id: string;
  props: any;
  className: string;
  resolve: (value: boolean) => void;
  contentFnc: (args: any) => JSX.Element;
  revision: number;
}

export class ModalWindow implements IModalWindow {
  constructor(
    public id: string,
    public revision: number,
    public group: string = 'default',
    public props: any,
    public resolve: (value: boolean) => void,
    public contentFnc: (args: any) => JSX.Element,
    public className: string = ''
  ) {}
}
