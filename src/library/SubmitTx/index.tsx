// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPenToSquare, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Default } from './Default';
import { ManualSign } from './ManualSign';
import { Wrapper } from './Wrappers';
import type { SubmitTxProps } from './types';

export const SubmitTx = ({
  onSubmit,
  submitText,
  buttons = [],
  valid = false,
  noMargin = false,
  submitting = false,
  fromController = false,
}: SubmitTxProps) => {
  const { t } = useTranslation('library');
  const { unit } = useApi().network;
  const { notEnoughFunds, sender } = useTxMeta();
  const { requiresManualSign } = useConnect();
  const { setResize } = useModal();

  const displayNote = notEnoughFunds || fromController;
  submitText = submitText || `${submitting ? t('submitting') : t('submit')}`;

  useEffect(() => {
    setResize();
  }, [notEnoughFunds, fromController]);

  return (
    <Wrapper noMargin={noMargin}>
      <div className="inner">
        {displayNote ? (
          <p className="sign">
            {fromController ? (
              <>
                <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                {t('signedByController')}
              </>
            ) : null}
            {notEnoughFunds ? (
              <>
                {fromController ? ' / ' : null}
                <FontAwesomeIcon
                  icon={faWarning}
                  className="danger"
                  transform="shrink-1"
                />{' '}
                <span className="danger">
                  {t('notEnough')} {unit}
                </span>
              </>
            ) : null}
          </p>
        ) : null}
        <section className="foot">
          {requiresManualSign(sender) ? (
            <ManualSign
              onSubmit={onSubmit}
              submitting={submitting}
              valid={valid}
              submitText={submitText}
              buttons={buttons}
            />
          ) : (
            <Default
              onSubmit={onSubmit}
              submitting={submitting}
              valid={valid}
              submitText={submitText}
              buttons={buttons}
            />
          )}
        </section>
      </div>
    </Wrapper>
  );
};
