import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
    components: {
        JoySkeleton: {
            defaultProps: {
                animation: 'wave',
            },
        },
        JoyButton: {
            defaultProps: {
                sx: {
                    fontWeight: 'normal',
                    fontSize: '1rem',
                }
            }
        },
        JoyCard: {
            variants: [
                {
                    props: { variant: 'black' },
                    style: {
                        backgroundColor: '#1f1f24',
                        transition: '0.2s',
                        '&:hover': {
                            backgroundColor: '#26262c'
                        }
                    }
                }
            ]
        }
    },
    colorSchemes: {
        light: {},
        dark: {},
    },
    fontFamily: {
        body: 'Roboto, Arial, sans-serif',
    },
});

export default theme;
