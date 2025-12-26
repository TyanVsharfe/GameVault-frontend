import { Grid } from '@mui/joy';
import UserGameCollectionCard from './UserGameCollectionCard';
import UserGameCollectionCreateCard from "./UserGameCollectionCreateCard";
import {useTranslation} from "react-i18next";
import {UserGameList} from "../../../types/user.game.list.types";

const UserGameCollectionsGrid = ({ collections, onCreateClick }) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={10}
              sx={{
                  width: '100%',
                  paddingTop: '1rem'
              }}
        >
            {collections?.map((col: UserGameList) => (
                <Grid key={col.uuid} xs={6} sm={4} md={3} lg={2}>
                    <UserGameCollectionCard collection={col} />
                </Grid>
            ))}

            <Grid xs={6} sm={4} md={3} lg={2}>
                <UserGameCollectionCreateCard onClick={onCreateClick} t={t} />
            </Grid>
        </Grid>
    );
};

export default UserGameCollectionsGrid;
