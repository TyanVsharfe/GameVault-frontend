import {
    Modal,
    ModalDialog,
    DialogTitle,
    Input,
    Textarea,
    Button,
    Stack, Switch
} from '@mui/joy';
import React, {useState} from "react";
import {useTranslation} from "react-i18next";

const UserGameCollectionCreateModal = ({ open, onClose, onSubmit, isSubmitting }) => {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog variant="soft" sx={{ minWidth: 400 }}>
                <DialogTitle>{t('create_new_list')}</DialogTitle>

                <Stack spacing={2} mt={2}>
                    <Input
                        placeholder={t('list_title')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Textarea
                        minRows={2}
                        placeholder={t('list_description_init')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Switch
                        checked={isPublic}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsPublic(event.target.checked)}
                        color={isPublic ? 'success' : 'neutral'}
                        variant={isPublic ? 'solid' : 'outlined'}
                        endDecorator={isPublic ? t('public') : t('private')}
                        slotProps={{
                            endDecorator: {
                                sx: {
                                    minWidth: 24,
                                },
                            },
                        }}
                    />

                    <Button onClick={() => onSubmit({ name, description, isPublic })}>
                        {isSubmitting ? `t('adding')...` : t('add')}
                    </Button>
                </Stack>
            </ModalDialog>
        </Modal>
    );
};

export default UserGameCollectionCreateModal;
