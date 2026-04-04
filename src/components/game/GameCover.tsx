import React from 'react';
import { Box } from '@mui/joy';

type Props = {
    coverUrl: string;
    gameName: string;
};

function GameCover({coverUrl, gameName}: Props) {


    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {coverUrl ? (
                <>
                    <img
                        src={coverUrl}
                        alt=""
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'blur(10px) brightness(0.7)',
                            transform: 'scale(1.1)',
                            zIndex: 1,
                        }}
                    />

                    <img
                        src={coverUrl}
                        alt={gameName}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            zIndex: 2,
                        }}
                    />
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '13.5rem',
                    zIndex: 2
                }}>
                    {gameName}
                </div>
            )}
        </Box>
    );
}

export default GameCover;