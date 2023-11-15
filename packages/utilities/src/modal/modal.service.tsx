import { IBaseModal, IModalService } from './modal-service.interface';
import { IModalConfig, IModalGroupConfig } from './modal-config.interface';
import { IModalWindow, ModalWindow } from './modal-window';

import React from 'react';
import { render } from 'react-dom';

export class ModalService implements IModalService {
  private readonly _modalRoot: HTMLElement;
  private readonly _modalsMap: Map<string, IModalWindow>;
  private readonly _modalIdsConfig: Map<string, IModalGroupConfig>;
  private readonly _modalId: string;
  private _wrapperClassName: string;
  private _revision: number;
  constructor(config: IModalConfig) {
    this._revision = 0;
    this._modalId = config.rootId;
    this._wrapperClassName = config.className ?? '';
    this._modalRoot = this._getModalRoot();
    this._modalsMap = new Map();
    this._modalIdsConfig = new Map();
    this._prepareConfig(config);
    window.addEventListener('popstate', () => this._resetModals());
    document.addEventListener(
      'keydown',
      (e) => e.key === 'Escape' && this._goBackBrowserProtection()
    );
  }

  private _prepareConfig(config: IModalConfig) {
    config.groups.flatMap((config) =>
      config.modalIds.forEach((modalId) =>
        this._modalIdsConfig.set(modalId, config)
      )
    );
  }

  private _goBackBrowserProtection() {
    let openedModal = Array.from(this._modalsMap.values()).sort(
      (a, b) => b.revision - a.revision
    )?.[0];
    if (!openedModal || this._modalIdsConfig.get(openedModal.id)?.unClosable)
      return;
    const config = this._modalIdsConfig.get(openedModal?.id);
    this._deleteAndResolveModals(
      config?.closeAllGroupOnEsc
        ? [...this._findModalByGroup(config?.group)]
        : [openedModal?.id],
      false
    );
  }
  private _resetModals() {
    this._deleteAndResolveModals(Array.from(this._modalsMap.keys()));
  }

  private _deleteAndResolveModals(modalIds: string[], value: boolean = false) {
    modalIds.forEach((modalId) => {
      const modal = this._modalsMap.get(modalId);
      if (modal) {
        modal?.resolve(value);
        this._modalsMap.delete(modalId);
      }
    });
    modalIds.length && this._render();
  }

  closeModal(modalIds: string, value: boolean = false) {
    this._deleteAndResolveModals([modalIds], value);
  }

  private _findModalByGroup(group: string): string[] {
    return Array.from(this._modalsMap.values())
      .filter((modal) => modal.group === group)
      .map((modal) => modal.id);
  }

  private _beforeOpenModal(modalId: string) {
    const config = this._modalIdsConfig.get(modalId);
    if (!config) return;
    if (config.closeAllModalsOnOpen) {
      this._resetModals();
    } else if (config.closeOldWithNewOne) {
      this._deleteAndResolveModals(this._findModalByGroup(config.group), false);
    }
  }

  openModal<T extends IBaseModal>(
    modalProps: Partial<T>,
    contentFnc: (args: T) => JSX.Element
  ): Promise<boolean> {
    const modalId = modalProps?.id ?? '';
    const config = this._modalIdsConfig.get(modalId);
    this._beforeOpenModal(modalId);

    return new Promise<boolean>((resolve) => {
      const newModalProps = {
        ...modalProps,
        onSubmit: (value: boolean) => {
          modalProps.onSubmit && modalProps.onSubmit(value);
          this.closeModal(modalId, value);
        },
      };

      this._modalsMap.set(
        modalId,
        new ModalWindow(
          modalId,
          this._revision++,
          config?.group,
          newModalProps,
          resolve,
          contentFnc
        )
      );
      this._render();
    });
  }

  private _render() {
    const modals = [];
    for (const element of this._modalsMap.values()) {
      const Component = element.contentFnc;
      modals.push(
        <Component
          {...element.props}
          key={element.id}
          className={element.className}
        />
      );
    }
    render(
      modals.length ? (
        <div
          className={this._wrapperClassName}
          onClick={() => this._goBackBrowserProtection()}
        >
          {modals}
        </div>
      ) : null,
      this._modalRoot
    );
  }

  private _getModalRoot() {
    const modalRoot = document.getElementById(this._modalId) as HTMLElement;
    if (!modalRoot) throw new Error('Modal root not found');
    return modalRoot;
  }
}
