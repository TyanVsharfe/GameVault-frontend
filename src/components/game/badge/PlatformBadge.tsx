import { FaXbox, FaPlaystation, FaWindows, FaApple, FaLinux, FaAndroid } from 'react-icons/fa';
import { SiIos, SiNintendoswitch, SiPlaystation3 } from 'react-icons/si';
import { GoBrowser } from "react-icons/go";
import { Chip } from '@mui/joy';

const PLATFORM_CONFIG: Record<string, { label: string; color: 'primary' | 'success' | 'neutral' | 'warning' | 'danger'; icon: JSX.Element }> = {
    XBOX:         { label: 'Xbox',         color: 'success', icon: <FaXbox /> },
    X360:         { label: 'Xbox 360',     color: 'success', icon: <FaXbox /> },
    XONE:         { label: 'Xbox One',     color: 'success', icon: <FaXbox /> },
    'SERIES-X|S':   { label: 'Xbox Series X|S',     color: 'success', icon: <FaXbox /> },
    VITA:          { label: 'PS Vita',  color: 'primary', icon: <FaPlaystation /> },
    PS1:          { label: 'PlayStation 1', color: 'primary', icon: <FaPlaystation /> },
    PS2:          { label: 'PlayStation 2', color: 'primary', icon: <FaPlaystation /> },
    PS3:          { label: 'PlayStation 3', color: 'primary', icon: <FaPlaystation /> },
    PS4:          { label: 'PlayStation 4',  color: 'primary', icon: <FaPlaystation /> },
    PS5:          { label: 'PlayStation 5',  color: 'primary', icon: <FaPlaystation /> },
    PC:           { label: 'PC',           color: 'neutral', icon: <FaWindows /> },
    MAC:          { label: 'macOS',        color: 'neutral', icon: <FaApple /> },
    LINUX:        { label: 'Linux',        color: 'neutral', icon: <FaLinux /> },
    ANDROID:      { label: 'Android',      color: 'success', icon: <FaAndroid /> },
    IOS:          { label: 'iOS',          color: 'neutral', icon: <SiIos /> },
    SWITCH:       { label: 'Switch',       color: 'danger',  icon: <SiNintendoswitch /> },
    'SWITCH-2':       { label: 'Switch 2',       color: 'danger',  icon: <SiNintendoswitch /> },
    BROWSER:        { label: 'Browser',        color: 'neutral', icon: <GoBrowser /> },
};

export const PlatformBadge = (platform: string, index: number, isShort: boolean) => {
    if (platform == undefined) {
        return "";
    }
    const key = platform.toUpperCase();
    const config = PLATFORM_CONFIG[key];

    if (config) {
        return (
            <Chip size={isShort ? 'sm' : 'md'} key={index}
                  style={{marginBottom: '0.4rem', marginRight: '0.3rem', fontSize: `${isShort ? 0.75 : 0.85}rem`}}
                  color={config.color} startDecorator={config.icon}
            >
                {isShort ? key.replace('-',' ') : config.label}
            </Chip>
        );
    }

    return (
        <Chip key={index} style={{marginBottom: '0.4rem', marginRight: '0.3rem', fontSize: `${isShort ? 0.75 : 0.85}rem`}} color="neutral">
            {platform}
        </Chip>
    )
};
