import React from "react";
import { Box, Typography } from "@mui/joy";
import {getCategoryName} from "../../../utils/Enums";

interface IgdbGameTypeBadgeProps {
    gameType: number;
    t: (key: string) => string;
}

const IgdbGameTypeBadge: React.FC<IgdbGameTypeBadgeProps> = ({ gameType, t}) => {
    const typeName = getCategoryName(gameType);

    return (
        <Box
            sx={{
                position: "absolute",
                top: 8,
                left: 8,
                px: 1.5,
                borderRadius: "1rem",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                zIndex: 2,
            }}
        >
            <Typography
                level="body-md"
                sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                }}
            >
                {t(`${typeName}`)}
            </Typography>
        </Box>
    );
}

export default IgdbGameTypeBadge;

