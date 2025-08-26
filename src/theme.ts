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
