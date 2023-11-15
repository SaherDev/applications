export interface IModalGroupConfig {
    className?: string;
    group: string;
    priority: number;
    modalIds: string[];
    zIndex?: number;
    closeOldWithNewOne?: boolean;
    closeAllModalsOnOpen?: boolean;
    closeAllGroupOnEsc?: boolean;
    unClosable?: boolean;
  }

  export interface IModalConfig {
    groups: IModalGroupConfig[];
    rootId: string;
    className?: string;
  }