export interface IBaseModal {
  id: string;
  onSubmit: (value: boolean) => void;
}

export interface IModalService {
  closeModal(modalId: string): void;
  openModal<T extends IBaseModal>(
    modalProps: Partial<T>,
    contentFnc: (args: T) => JSX.Element
  ): Promise<boolean>;
}
