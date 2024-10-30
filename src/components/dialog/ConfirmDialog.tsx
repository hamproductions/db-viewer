import { useTranslation } from 'react-i18next';
import { FaXmark } from 'react-icons/fa6';
import { Stack } from 'styled-system/jsx';
import { Button } from '~/components/ui/button';
import { Dialog } from '~/components/ui/dialog';
import { IconButton } from '~/components/ui/icon-button';

const createConfirmDialog = (key: 'reset_default') => {
  return function ConfirmDialog(props: Dialog.RootProps & { onConfirm: () => void }) {
    const { onConfirm, ...rest } = props;
    const { t } = useTranslation();
    return (
      <Dialog.Root {...rest}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Stack gap="8" p="6">
              <Stack gap="1">
                <Dialog.Title>{t(`dialog.${key}.title`)}</Dialog.Title>
                <Dialog.Description>{t(`dialog.${key}.description`)}</Dialog.Description>
              </Stack>
              <Stack gap="3" direction="row" width="full">
                <Dialog.CloseTrigger asChild>
                  <Button variant="outline" width="full">
                    {t('dialog.cancel')}
                  </Button>
                </Dialog.CloseTrigger>
                <Button onClick={onConfirm} width="full">
                  {t('dialog.proceed')}
                </Button>
              </Stack>
            </Stack>
            <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
              <IconButton aria-label="Close Dialog" variant="ghost" size="sm">
                <FaXmark />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    );
  };
};

export const ConfirmResetDefaultDialog = createConfirmDialog('reset_default');
