import { Card, Typography, Box, AspectRatio, Link } from '@mui/joy';
import LockIcon from '@mui/icons-material/Lock';
import {UserGameList} from "../../../types/user.game.list.types";

const UserGameCollectionCard = ({collection}: {collection: UserGameList}) => {
    console.log(collection);

    const getAllCoverUrls = (listData: any): string[] => {
        if (!listData.items || listData.items.length === 0) {
            return [];
        }

        return listData.items
            .map((item: any) => item.game?.coverUrl)
            .filter((url: string | undefined) => url != null);
    };

    const getRandomCovers = (listData: any): string[] => {
        const allCovers = getAllCoverUrls(listData);

        if (allCovers.length <= 4) {
            return allCovers;
        }

        return [...allCovers]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
    };

    const coverUrls = getRandomCovers(collection);

    return (
        <Card
            variant="soft"
            sx={{
                height: '14rem',
                width: '10rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 1.5,
                paddingTop: 0,
                borderRadius: 'lg',
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': {
                    backgroundColor: 'neutral.softBg',
                    transform: 'scale(1.03)',
                },
            }}
        >
            <Link
                overlay
                href={`/account/lists/${collection.uuid}`}
                underline="none"
            />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: 0.5,
                    height: 120,
                }}
            >
                {coverUrls.map((url, index) => (
                    <AspectRatio key={index} ratio="1">
                        <img src={url} alt="" style={{ objectFit: 'cover' }} />
                    </AspectRatio>
                ))}
            </Box>

            <Box
                sx={{
                    paddingTop: '0.5rem'
                }}
            >
                <Typography level="title-md">{collection.name}</Typography>
                <Typography level="body-sm" sx={{display: "flex", justifyContent: "space-between", opacity: 0.7}}>
                    Игр: {collection?.items?.length ?? 0}
                    {!collection?.public && (<LockIcon/>)}
                </Typography>
            </Box>
        </Card>
    );
};

export default UserGameCollectionCard;
