import { Card, Typography, Box } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';

const UserGameCollectionCreateCard = ({ onClick, t }) => (
    <Card
        variant="outlined"
        onClick={onClick}
        sx={{
            height: '14rem',
            width: '10rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'lg',
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': {
                backgroundColor: 'neutral.softBg',
                transform: 'scale(1.03)',
            },
        }}
    >
        <Box textAlign="center">
            <AddIcon fontSize="large" />
            <Typography level="title-md" mt={1}>
                {t('create_list')}
            </Typography>
        </Box>
    </Card>
);

export default UserGameCollectionCreateCard;
